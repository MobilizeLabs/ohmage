
var ReminderController = function (uuid) {

    var self = {};

    var model = (uuid)? new ReminderModel(uuid) : new ReminderModel();

    self.render = function () {
        return (new ReminderView(model, self)).render();
    };

    self.save = function (campaignURN, surveyID, title, date, supressionWindow, recurrences, excludeWeekends) {
        model.setAssociation(campaignURN, surveyID);
        model.setSupressionWindow(supressionWindow);
        model.setExcludeWeekends(excludeWeekends);
        model.setTitle(title);
        model.setMessage("Reminder: " + title);
        model.cancelAllNotifications();

        //Returns a new date that is 24 hours ahead of the specified day.
        var nextDay = function(date){
            return new Date(date.getTime() + (24 * 60 * 60 * 1000));
        };

        //If the user has set an alarm with an initial date in the past, then
        //skip the current day. Otherwise, a notification will be triggered
        //as soon as the reminder is set.
        if(date.getTime() < new Date().getTime()){
            date = nextDay(date);
        }
        var i;
        for (i = 0; i < recurrences; i += 1) {
            if (model.excludeWeekends()) {
                while(date.getDay() === 6 || date.getDay() === 0){
                    date = nextDay(date);
                }
            }
            model.addNotification(date);
            date = nextDay(date);
        }

        model.save();
    };

    self.getReminderCount = function () {
        return ReminderModel.getAllReminders().length;
    };

    return self;
};
