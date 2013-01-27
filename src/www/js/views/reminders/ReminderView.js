
var ReminderView = function (reminder, controller) {

    var that = {};

    var createSuppressionWindowSelectInput = function () {
        var select = document.createElement('select'), i;
        select.className = "supression-window-select";
        for (i = 1; i <= 24; i+=1) {
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i + " hour" + ((i !== 1) ? "s" : "");
            select.appendChild(option);

            if(i === reminder.getSupressionWindow()){
                option.selected = "selected";
            }
        }
        select.getInput = function(){
            return select.options[select.selectedIndex].value;
        };
        return select;
    };

    var createReminderRecurrenceSelectInput = function () {
        var select = document.createElement('select'),
            option,
            i;
        select.className = "recurrence-select";
        for (i = 1; i < 31; i+=1)  {
            option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            select.appendChild(option);
            if (i === reminder.getRecurrence()) {
                option.selected = "selected";
            }
        }
        select.getInput = function () {
            return select.options[select.selectedIndex].value;
        };
        return select;
    };


    var createSurveySelectInput = function(){

       var createOption = function(title, surveyID, campaignURN){
            var option = document.createElement('option');
            option.survey = {title: title, surveyID: surveyID, campaignURN: campaignURN};
            option.innerHTML = title;
            return option;
        };

        var select = document.createElement('select'),
        campaigns = CampaignsModel.getInstalledCampaigns(),
        survey, surveys, campaignURN, option, i, j;

        select.className = "reminder-survey-select";
        select.appendChild(createOption("Select a Survey to Continue"));

        for (i = 0; i < campaigns.length; i+=1) {
            if (campaigns[i].isRunning()) {
                surveys = campaigns[i].getSurveys();
                campaignURN = campaigns[i].getURN();
                for (j = 0; j < surveys.length; j+=1) {
                    survey = surveys[j];
                    option = createOption(survey.title, survey.id, campaignURN);
                    if(reminder.getCampaignURN() === campaignURN && reminder.getSurveyID() === survey.id){
                        option.selected = "selected";
                    }
                    select.appendChild(option);
                }
            }
        }

        select.getInput = function(){
            return select.options[select.selectedIndex].survey;
        };
        return select;
    };

    var createTimePickerInput = function(){
        var date = reminder.getDate();
        if(date === null){
            date = new Date();
            date.setTime(date.getTime() + 10 * 60 * 1000);
        }
        var dateTimePicker = new DateTimePicker();
        var timePicker = dateTimePicker.createTimePicker(date);
        timePicker.className = timePicker.className + " time-picker-input";
        return timePicker;
    };

    var createExcludeWeekendsChecbkoxInput = function(){


        var checkbox = document.createElement('input');
        var id = UUIDGen.generate();
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', id);
        if(reminder.excludeWeekends()){
            checkbox.checked = "checked";
        }

        var label = document.createElement('label');
        label.innerHTML = "Exclude Weekends: ";
        label.setAttribute("for", id);

        var container = document.createElement('div');
        container.style.textAlign = "center";
        container.appendChild(label);
        container.appendChild(checkbox);
        container.excludeWeekends = function(){
            return checkbox.checked;
        };
        return container;
    };

    var cancel = function(){
        PageNavigation.openRemindersView();
    };

    var save = function(surveySelect, timePicker, suppressionSelect, recurrenceSelect, weekendsCheckbox){
       return function(){
            if(surveySelect.selectedIndex === 0){
                alert("Please select a survey to add a reminder.");
                return;
            }

            var survey = surveySelect.getInput();
            var date = new Date();
            date.setHours(timePicker.getHours());
            date.setMinutes(timePicker.getMinutes());
            console.log("time picker getMinutes() -- " + timePicker.getMinutes());
            console.log("date getMinutes() -- " + date.getMinutes());
            var supression = suppressionSelect.getInput();
            var recurrences = recurrenceSelect.getInput();
            var excludeWeekends = weekendsCheckbox.excludeWeekends();

            controller.save( survey.campaignURN,
                             survey.surveyID,
                             survey.title,
                             date,
                             supression,
                             recurrences,
                             excludeWeekends
                           );

            PageNavigation.openRemindersView();

       };

    };


    var deleteReminderCallback = function() {
        var confirmMessage = "Are you sure you would like to delete the reminder for " + reminder.getTitle() + "?";
        var callback = function( yes ) {
            if( yes ) {
                reminder.deleteReminder();
                PageNavigation.openRemindersView();
            }
        };
        MessageDialogController.showConfirm( confirmMessage, callback, "Yes,No" );
    };

    that.render = function() {
        var timePicker = createTimePickerInput(),
            surveySelect = createSurveySelectInput(),
            suppressionSelect = createSuppressionWindowSelectInput(),
            recurrenceSelect = createReminderRecurrenceSelectInput(),
            weekendsCheckbox = createExcludeWeekendsChecbkoxInput(),
            inputs = mwf.decorator.Form("Create New Reminder");

        inputs.addLabel("Reminder Survey");
        inputs.addItem(surveySelect);
        inputs.addLabel("Select Time");
        inputs.addItem(timePicker);
        inputs.addLabel("Suppression Window");
        inputs.addItem(suppressionSelect);
        inputs.addLabel("Recurrence (number of days)");
        inputs.addItem(recurrenceSelect);
        inputs.addLabel("Preferences");
        inputs.addItem(weekendsCheckbox);

        var saveCallback = save(surveySelect, timePicker, suppressionSelect, recurrenceSelect, weekendsCheckbox);
        var actions = document.createElement('div');
        actions.appendChild(mwf.decorator.DoubleClickButton("Cancel", cancel, "Save", saveCallback));

        if(reminder.isSaved()){
            actions.appendChild(mwf.decorator.SingleClickButton("Delete Reminder", deleteReminderCallback));
        }

        var container = document.createElement('div');
        container.appendChild(inputs);
        container.appendChild(actions);
        return container;

    };

    return that;
};