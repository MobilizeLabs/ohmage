/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 * @constructor
 */
var ReminderView = function (reminderModel) {
    "use strict";
    var that = AbstractView();

    var createSuppressionWindowSelectInput = function () {
        var select = document.createElement('select'),
            i;
        select.className = "suppression-window-select";
        for (i = 1; i <= 24; i += 1) {
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = i + " hour" + ((i !== 1) ? "s" : "");
            select.appendChild(option);

            if (i === reminderModel.getSuppressionWindow()) {
                option.selected = "selected";
            }
        }
        select.getInput = function () {
            return select.options[select.selectedIndex].value;
        };
        return select;
    };

    var createReminderRecurrenceSelectInput = function () {
        var select = document.createElement('select'),
            option,
            i;
        select.className = "recurrence-select";
        for (i = 1; i < 31; i += 1) {
            option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;
            select.appendChild(option);

            if (i === reminderModel.getRecurrence()) {
                option.selected = "selected";
            }
        }
        select.getInput = function () {
            return select.options[select.selectedIndex].value;
        };
        return select;
    };

    var createOption = function (title, surveyID, campaignURN) {
        var option = document.createElement('option');
        option.survey = {title: title, surveyID: surveyID, campaignURN: campaignURN};
        option.innerHTML = title;
        return option;
    };

    var createSurveySelectInput = function () {

        var select = document.createElement('select'),
            campaignModels,
            campaignURN,
            surveys,
            surveyID,
            survey,
            option,
            i,
            j;
        select.className = "reminder-survey-select";

        campaignModels = CampaignsModel.getInstalledCampaigns();

        select.appendChild(createOption("Select a Survey to Continue"));

        for (campaignURN in campaignModels) {
            if (campaignModels.hasOwnProperty(campaignURN)) {
                if (campaignModels[campaignURN].isRunning()) {
                    surveys = campaignModels[campaignURN].getSurveys();
                    for (surveyID in surveys) {
                        if (surveys.hasOwnProperty(surveyID)) {
                            survey = surveys[surveyID];
                            option = createOption(survey.getTitle(), surveyID, campaignURN);
                            if (reminderModel.getCampaignURN() === campaignURN && reminderModel.getSurveyID() === surveyID) {
                                option.selected = "selected";
                            }
                            select.appendChild(option);
                        }

                    }
                }
            }

        }

        select.getInput = function () {
            return select.options[select.selectedIndex].survey;
        };
        return select;
    };

    var createTimePickerInput = function () {
        var date = reminderModel.getDate(),
            dateTimePicker,
            timePicker;
        if (date === null) {
            date = new Date();
            date.setTime(date.getTime() + 10 * 60 * 1000);
        }
        dateTimePicker = new DateTimePicker();
        timePicker = dateTimePicker.createTimePicker(date);
        timePicker.className = timePicker.className + " time-picker-input";
        return timePicker;
    };

    var createExcludeWeekendsCheckboxInput = function () {

        var checkbox = document.createElement('input');
        var id = UUIDGen.generate();
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', id);
        if (reminderModel.excludeWeekends()) {
            checkbox.checked = "checked";
        }

        var label = document.createElement('label');
        label.innerHTML = "Exclude Weekends: ";
        label.setAttribute("for", id);

        var container = document.createElement('div');
        container.style.textAlign = "center";
        container.appendChild(label);
        container.appendChild(checkbox);
        container.excludeWeekends = function () {
            return checkbox.checked;
        };
        return container;
    };

    var saveCallbackClosure = function (surveySelect, timePicker, suppressionSelect, recurrenceSelect, weekendsCheckbox) {
        return function () {

            if (surveySelect.selectedIndex === 0) {
                MessageDialogController.showMessage("Please select a survey to add a reminder.");
                return;
            }

            var survey = surveySelect.getInput(),
                date = new Date(),
                suppression = suppressionSelect.getInput(),
                recurrences = recurrenceSelect.getInput(),
                excludeWeekends = weekendsCheckbox.excludeWeekends();

            date.setHours(timePicker.getHours());
            date.setMinutes(timePicker.getMinutes());

            that.saveReminderButtonCallback(survey.campaignURN, survey.surveyID, survey.title, date, suppression, recurrences, excludeWeekends);
        };

    };

    that.render = function () {
        var timePicker = createTimePickerInput(),
            surveySelect = createSurveySelectInput(),
            suppressionSelect = createSuppressionWindowSelectInput(),
            recurrenceSelect = createReminderRecurrenceSelectInput(),
            weekendsCheckbox = createExcludeWeekendsCheckboxInput(),
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

        var saveCallback = saveCallbackClosure(surveySelect, timePicker, suppressionSelect, recurrenceSelect, weekendsCheckbox);
        var actions = document.createElement('div');
        actions.appendChild(mwf.decorator.DoubleClickButton("Cancel", that.cancelButtonCallback, "Save", saveCallback));

        if (reminderModel.isSaved()) {
            actions.appendChild(mwf.decorator.SingleClickButton("Delete Reminder", that.deleteReminderButtonCallback));
        }

        var container = document.createElement('div');
        container.appendChild(inputs);
        container.appendChild(actions);
        return container;

    };

    that.cancelButtonCallback = function () {};
    that.saveReminderButtonCallback = function (campaignURN, surveyID, title, date, suppressionWindow, recurrences, excludeWeekends) {};
    that.deleteReminderButtonCallback = function () {};
    return that;
};