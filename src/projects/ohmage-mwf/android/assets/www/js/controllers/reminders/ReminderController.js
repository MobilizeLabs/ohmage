/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 * @constructor
 */
var ReminderController = function (reminderModelUUID) {
    "use strict";
    var that = {};

    var reminderModel = ReminderModel(reminderModelUUID);

    var cancelButtonCallback = function () {
        PageController.goBack();
    };

    /**
     * Returns a new date that is 24 hours ahead of the specified day.
     */
    var nextDay = function (date) {
        return new Date(date.getTime() + (24 * 60 * 60 * 1000));
    };

    var saveReminderCallback = function (campaignURN, surveyID, title, date, suppressionWindow, recurrences, excludeWeekends) {
        var i;

        reminderModel.setAssociation(campaignURN, surveyID);
        reminderModel.setSuppressionWindow(suppressionWindow);
        reminderModel.setExcludeWeekends(excludeWeekends);
        reminderModel.setTitle(title);
        reminderModel.setMessage("Reminder: " + title);
        reminderModel.cancelAllNotifications();

        //If the user has set an alarm with an initial date in the past, then
        //skip the current day. Otherwise, a notification will be triggered 
        //as soon as the reminder is set.
        if (date.getTime() < new Date().getTime()) {
            date = nextDay(date);
        }

        for (i = 0; i < recurrences; i += 1) {
            if (reminderModel.excludeWeekends()) {
                while (date.getDay() === 6 || date.getDay() === 0) {
                    date = nextDay(date);
                }
            }
            reminderModel.addNotification(date);
            date = nextDay(date);
        }

        reminderModel.save();
        PageController.goBack();
    };

    var deleteReminderButtonCallback = function () {
        var confirmMessage = "Are you sure you would like to delete the reminder for " + reminderModel.getTitle() + "?";
        var callback = function (yesDeleteReminder) {
            if (yesDeleteReminder) {
                reminderModel.deleteReminder();
                PageController.goBack();
            }
        };
        MessageDialogController.showConfirm(confirmMessage, callback, "Yes,No");
    };

    that.getView = function () {
        var reminderView = ReminderView(reminderModel);
        reminderView.cancelButtonCallback = cancelButtonCallback;
        reminderView.saveReminderButtonCallback = saveReminderCallback;
        reminderView.deleteReminderButtonCallback = deleteReminderButtonCallback;
        return reminderView;
    };

    return that;
};
