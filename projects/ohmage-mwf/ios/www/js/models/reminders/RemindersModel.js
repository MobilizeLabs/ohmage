/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 * @constructor
 */
var RemindersModel = (function () {
    "use strict";
    var that = {};

    var remindersMetadata = LocalMap("reminders-metadata");

    var reminders = new LocalMap("reminders");

    var log = Logger("RemindersModel");

    /**
     * Returns the next available ID that can be assigned to a new reminder.
     * @returns {Number}
     */
    that.getNextAvailableNotificationID = function () {
        var id = remindersMetadata.get('last-id') || 0;
        remindersMetadata.set('last-id', id + 1);
        return id;
    };

    /**
     * Returns all saved reminders.
     */
    that.getAllReminders = function () {
        var remindersMap = reminders.getMap(),
            allReminders = [],
            uuid;
        for (uuid in remindersMap) {
            if (remindersMap.hasOwnProperty(uuid)) {
                allReminders.push(ReminderModel(uuid));
            }
        }
        return allReminders;
    };

    /**
     * Cancels all set notifications for saved reminders.
     */
    that.cancelAll  = function () {
        log.info("Cancelling all reminders.");
        var reminders = that.getAllReminders(),
            i;
        for (i = 0; i < reminders.length; i += 1) {
            reminders[i].deleteReminder();
        }
    };

    /**
     * Suppresses all reminders associated with the specified survey.
     */
    that.suppressSurveyReminders = function (surveyID) {
        log.info("Suppressing all reminders for survey [$1].", surveyID);
        var reminders = that.getAllReminders(),
            i = 0;
        for (i; i < reminders.length; i += 1) {
            if (reminders[i].getSurveyID() === surveyID && reminders[i].suppress()) {
                break;
            }
        }
    };

    /**
     * Deletes all reminders associated with the specified campaign.
     */
    that.deleteCampaignReminders = function (campaignURN) {
        log.info("Deleting all reminders associated with campaign [$1].", campaignURN);
        var reminders = that.getAllReminders(), i = 0;
        for (i; i < reminders.length; i += 1) {
            if (reminders[i].getCampaignURN() === campaignURN) {
                reminders[i].deleteReminder();
            }
        }
    };

    /**
     * Returns an array of currently pending surveys.
     * @returns {Array}
     */
    that.getPendingSurveys = function () {
        var currentDate = new Date().getTime(),
            reminders = that.getAllReminders(),
            campaign,
            surveys = [],
            i = 0;
        for (i; i < reminders.length; i += 1) {
            if (reminders[i].getDate().getTime() < currentDate) {
                campaign = CampaignsModel.getCampaign(reminders[i].getCampaignURN());
                surveys.push(campaign.getSurvey(reminders[i].getSurveyID()));
            }
        }
        return surveys;
    };

    /**
     * Returns true if there are currently pending surveys.
     * @returns {boolean}
     */
    that.hasPendingSurveys = function () {
        return that.getPendingSurveys().length > 0;
    };

    /**
     * Returns all reminders that have at least single notification in the future.
     */
    that.getCurrentReminders  = function () {
        var reminders = that.getAllReminders();
        var currentReminders = [], i = 0;
        for (i; i < reminders.length; i += 1) {
            if (!reminders[i].isExpired()) {
                currentReminders.push(reminders[i]);
            }
        }
        return currentReminders;
    };

    that.saveReminderModel = function (reminderModel) {
        reminders.set(reminderModel.getUUID(), reminderModel.toJSON());
    };

    that.isReminderModelSaved = function (reminderModel) {
        return reminders.isSet(reminderModel.getUUID());
    };

    that.deleteReminderModel = function (reminderModel) {
        reminders.release(reminderModel.getUUID());
    };

    that.getStoredReminderModelJSON = function (storedReminderModelUUID) {
        return reminders.get(storedReminderModelUUID);
    };

    return that;
}());

