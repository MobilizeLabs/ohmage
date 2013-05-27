/**
 * Encapsulates functionality for manipulating a single reminder.
 * @author Zorayr Khalapyan
 * @version 8/13/2012
 * @constructor
 */
var ReminderModel = function (reminderUUID) {
    "use strict";
    var that = {};
    var title = "";
    var campaignURN = "";
    var surveyID = "";
    var message = "";
    var ticker = "";
    var notificationAdapter = LocalNotificationAdapter;

    var log = Logger("ReminderModel");

    /**
     * Suppression window in hours. Default is 24.
     */
    var suppressionWindow = 24;

    /**
     * If true, weekends will be excluded in recurring reminders.
     */
    var excludeWeekends = false;

    /**
     * A list of individual notifications i.e. objects that contain id and date.
     */
    var notifications = [];

    /**
     * Cancels a set notification with the provided ID.
     */
    var cancelNotification = function (notification) {
        //Don't cancel notifications that are in the past.
        if (notification.date.getTime() >= new Date().getTime()) {
            log.info("Canceling notification with id [$1] associated with survey [$2]", notification.id, surveyID);
            notificationAdapter.cancel(notification.id);
        }
    };

    /**
     * Returns a JSON representation of the current reminder model. All time
     * related data will be stored as integers.
     * @visibleForTesting
     */
    that.toJSON = function () {
        var reminderJSON = {
            title              : title,
            campaign_urn       : campaignURN,
            survey_id          : surveyID,
            message            : message,
            ticker             : ticker,
            suppression_window : suppressionWindow,
            exclude_weekends   : excludeWeekends
        },
            i;
        reminderJSON.notifications = [];
        for (i = 0; i < notifications.length; i += 1) {
            reminderJSON.notifications.push({
                id   : notifications[i].id,
                time : notifications[i].date.getTime()
            });
        }
        return reminderJSON;
    };

    /**
     * Adds a new notification with the specified date to the current reminder
     * model.
     */
    that.addNotification = function (date) {
        var id = RemindersModel.getNextAvailableNotificationID();
        var options = {
            date        : date,
            message     : message,
            ticker      : ticker,
            repeatDaily : false,
            id          : id
        };
        log.info("Notification was set with the following options - " + JSON.stringify(options));
        notificationAdapter.add(options);
        notifications.push({id : id, date : date});
        return options;
    };

    /**
     * Saves the current reminder in localStorage.
     */
    that.save = function () {
        RemindersModel.saveReminderModel(that);
    };

    /**
     * Returns true if the current reminder has been saved in localStorage.
     */
    that.isSaved = function () {
        return RemindersModel.isReminderModelSaved(that);
    };

    /**
     * This method is useful when updating the reminder. Instead of deleting and
     * recreating a reminder - the controller can cancel all the current set
     * notifications, and add new reminders according to the user's
     * modification.
     */
    that.cancelAllNotifications = function () {
        var i;
        for (i = 0; i < notifications.length; i += 1) {
            cancelNotification(notifications[i]);
        }
        notifications = [];
        that.save();
    };

    /**
     * Cancels all set notifications for this reminder and then deletes this
     * reminder from the localStorage.
     */
    that.deleteReminder  = function () {
        log.info("Deleting reminder with the following UUID [$1].", reminderUUID);
        that.cancelAllNotifications();
        RemindersModel.deleteReminderModel(that);
    };

    /**
     * Given a cutoff date, cancel all notifications that occurred within the
     * suppression window's timeperiod.
     */
    that.suppress = function (date) {
        date = date || new Date();
        var activeNotifications = [], i = 0;
        var suppressionWindowTime = suppressionWindow * 60 * 60 * 1000;
        var surveySuppressed = false;
        for (i; i < notifications.length; i += 1) {
            if (notifications[i].date.getTime() - date.getTime() < suppressionWindowTime) {
                cancelNotification(notifications[i]);
                surveySuppressed = true;
            } else {
                activeNotifications.push(notifications[i]);
            }
        }
        notifications = activeNotifications;
        //If all the notifications have been suppressed, delete this reminder
        //model. Otherwise, save the updates.
        if (notifications.length === 0) {
            that.deleteReminder();
        } else {
            that.save();
        }
        return surveySuppressed;
    };

    /**
     * Restores a reminder with the specified UUID from localStorage.
     */
    that.restore = function (storedReminderModelUUID) {
        var object       = RemindersModel.getStoredReminderModelJSON(storedReminderModelUUID),
            i;
        reminderUUID     = storedReminderModelUUID;
        title            = object.title;
        campaignURN      = object.campaign_urn;
        surveyID         = object.survey_id;
        message          = object.message;
        ticker           = object.ticker;
        suppressionWindow = object.suppression_window;
        excludeWeekends  = object.exclude_weekends;
        notifications = [];
        for (i = 0; i < object.notifications.length; i += 1) {
            notifications.push({
                id   : object.notifications[i].id,
                date : new Date(object.notifications[i].time)
            });
        }
    };

    that.setAssociation = function (newCampaignURN, newSurveyID) {
        campaignURN = newCampaignURN;
        surveyID    = newSurveyID;
    };

    that.setMessage = function (newMessage) {
        message = newMessage;
        ticker  = newMessage;
    };

    that.setTitle = function (newTitle) {
        title = newTitle;
    };

    that.setSuppressionWindow = function (newSuppressionWindow) {
        suppressionWindow = newSuppressionWindow;
    };

    that.setExcludeWeekends = function (newExcludeWeekends) {
        excludeWeekends = newExcludeWeekends;
    };

    /**
     * A reminder is expired if it doesn't have any more notifications, or if
     * the last notification is in the past.
     */
    that.isExpired = function () {
        return notifications.length === 0
            || notifications[notifications.length - 1].date.getTime() <= new Date().getTime();
    };

    that.getUUID = function () {
        return reminderUUID;
    };

    that.getCampaignURN = function () {
        return campaignURN;
    };

    that.getSurveyID = function () {
        return surveyID;
    };

    that.getTitle = function () {
        return title;
    };

    /**
     * Returns the date of the earliest set notification for this reminder.
     */
    that.getDate = function () {
        return (notifications.length !== 0) ? notifications[0].date : null;
    };

    that.getSuppressionWindow = function () {
        return parseInt(suppressionWindow, 10);
    };

    that.excludeWeekends = function () {
        return excludeWeekends;
    };

    that.getRecurrence = function () {
        return notifications.length;
    };

    /**
     * Returns current notifications.
     * @visibleForTesting
     */
    that.getNotifications  = function () {
        return notifications;
    };

    that.getMessage  = function () {
        return message;
    };

    /**
     * Replaces the reference to the LocalNotificationAdapter.
     * @visibleForTesting
     */
    that.setNotificationAdapter = function (newNotificationAdapter) {
        notificationAdapter = newNotificationAdapter;
    };

    //Initialization: if the user has specified a UUID for this reminder than
    //restore the saved model from localStorage. Otherwise, generate a new
    //unique identifier.
    (function () {
        if (reminderUUID !== undefined && reminderUUID !== null) {
            that.restore(reminderUUID);
        } else {
            reminderUUID = UUIDGen.generate();
        }
    }());

    return that;
};

