
/**
 * @class ReminderModel
 * @author Zorayr Khalapyan
 * @version 8/13/2012
 */
var ReminderModel = function( uuid ) {

    var that = {};
    var title = "";
    var campaignURN = "";
    var surveyID = "";
    var message = "";
    var ticker = "";
    var notificationAdapter = LocalNotificationAdapter;

    /**
     * Supression window in hours. Default is 24.
     */
    var supressionWindow = 24;

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
    var cancelNotification = function( notification ) {
        //Don't cancel notifications that are in the past.
        if( notification.date.getTime() >= new Date().getTime() ) {
            console.log("ReminderModel: Canceling notification with id [" + notification.id + "] associated with survey [" + surveyID + "]");
            notificationAdapter.cancel( notification.id );
        }
    };

    /**
     * Returns a JSON representation of the current reminder model. All time
     * related data will be stored as integers.
     * @visibleForTesting
     */
     that.toJSON = function(){
        var reminderJSON = {
            title             : title,
            campaign_urn      : campaignURN,
            survey_id         : surveyID,
            message           : message,
            ticker            : ticker,
            supression_window : supressionWindow,
            exclude_weekends  : excludeWeekends
        }, i;
        reminderJSON.notifications = [];
        for (i = 0; i < notifications.length; i+=1) {
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
    that.addNotification = function( date ){
        var id = ReminderModel.getNextAvailableNotificationID();
        var options = {
            date        : date,
            message     : message,
            ticker      : ticker,
            repeatDaily : false,
            id          : id
        };
        console.log("ReminderModel: Notification was set with the following options - " + window.JSON.stringify(options));
        notificationAdapter.add(options);
        notifications.push({id : id, date : date});
        return options;
    };

    /**
     * Saves the current reminder in localStorage.
     */
    that.save = function(){
        ReminderModel.reminders.set( uuid, that.toJSON() );
    };

    /**
     * Returns true if the current reminder has been saved in localStorage.
     */
    that.isSaved = function(){
        return ReminderModel.reminders.isSet(uuid);
    };

    /**
     * This method is useful when updating the reminder. Instead of deleting and
     * recreating a reminder - the controller can cancel all the current set
     * notifications, and add new reminders according to the user's
     * modification.
     */
    that.cancelAllNotifications = function () {
        var i;
        for (i = 0; i < notifications.length; i+=1) {
            cancelNotification( notifications[i] );
        }
        notifications = [];
        that.save();
    };

    /**
     * Cancels all set notifications for this reminder and then deletes this
     * reminder from the localStorage.
     */
    that.deleteReminder = function() {
        console.log("ReminderModel: Deleting reminder with the following UUID [" + uuid + "].");
        that.cancelAllNotifications();
        ReminderModel.reminders.release(uuid);
    };

    /**
     * Given a cutoff date, cancel all notifications that occured within the
     * suppresion window's timeperiod.
     */
    that.suppress = function( date ){
        date = date || new Date();
        var activeNotifications = [],
            i,
            suppressionWindowTime = supressionWindow * 60 * 60 * 1000,
            surveySuppressed = false;
        for (i = 0; i < notifications.length; i += 1) {
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
        if(notifications.length === 0){
            that.deleteReminder();
        }else{
            that.save();
        }
        return surveySuppressed;
    };

    /**
     * Restores a reminder with the specified UUID from localStorage.
     */
    that.restore = function( storedUUID ){
        var object       = ReminderModel.reminders.get(storedUUID), i;
        uuid             = storedUUID;
        title            = object.title;
        campaignURN      = object.campaign_urn;
        surveyID         = object.survey_id;
        message          = object.message;
        ticker           = object.ticker;
        supressionWindow = object.supression_window;
        excludeWeekends  = object.exclude_weekends;
        notifications = [];
        for (i = 0; i < object.notifications.length; i+=1) {
            notifications.push({
                id   : object.notifications[i].id,
                date : new Date( object.notifications[i].time )
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

    that.setSupressionWindow = function (newSupressionWindow) {
        supressionWindow = newSupressionWindow;
    };

    that.setExcludeWeekends = function (newExcludeWeekends) {
        excludeWeekends = newExcludeWeekends;
    };

    /**
     * A remineder is expired if it doesn't have any more notificationss, or if
     * the last notification is in the past.
     */
    that.isExpired = function () {
        return notifications.length === 0
            || notifications[notifications.length - 1].date.getTime() <= new Date().getTime();
    };

    that.getUUID = function(){
        return uuid;
    };

    that.getCampaignURN = function(){
        return campaignURN;
    };

    that.getSurveyID = function(){
        return surveyID;
    };

    that.getTitle = function(){
        return title;
    };

    /**
     * Returns the date of the earliest set notification for this reminder.
     */
    that.getDate = function () {
        return (notifications.length !== 0)? notifications[0].date : null;
    };

    that.getSupressionWindow = function () {
        return parseInt(supressionWindow, 10);
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
    that.getNotifications = function () {
        return notifications;
    };

    that.getMessage = function () {
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
    (function(){
        if(typeof(uuid) !== "undefined"){
            that.restore(uuid);
        }else{
            uuid = UUIDGen.generate();
        }
    }());



    return that;
};


ReminderModel.getNextAvailableNotificationID = function(){

    if(!ReminderModel.remindersMetadata.isSet('last-id')){
        ReminderModel.remindersMetadata.set('last-id', 0);
    }

    var id = ReminderModel.remindersMetadata.get('last-id');
    ReminderModel.remindersMetadata.set('last-id', id + 1);
    return id;
};

ReminderModel.remindersMetadata = new LocalMap("reminders-metadata");
ReminderModel.reminders = new LocalMap("reminders");

/**
 * Returns all saved reminders.
 */
ReminderModel.getAllReminders = function(){
    var remindersMap = ReminderModel.reminders.getMap(),
        allReminders = [],
        uuid;
    for(uuid in remindersMap){
        if(remindersMap.hasOwnProperty(uuid)){
            allReminders.push( new ReminderModel(uuid) );
        }
    }
    return allReminders;
};

/**
 * Cancels all set notifications for saved reminders.
 */
ReminderModel.cancelAll = function() {
    console.log("ReminderModel: Cancelling all reminders.");
    var reminders = ReminderModel.getAllReminders(), i;
    for (i = 0; i < reminders.length; i+=1) {
        reminders[i].deleteReminder();
    }
};

/**
 * Supresses all reminders associated with the specified survey.
 */
ReminderModel.supressSurveyReminders = function (surveyID) {
    console.log("ReminderModel: Supressing all reminders for survey [" + surveyID + "].");
    var reminders = ReminderModel.getAllReminders(),
        i;
    for (i = 0; i < reminders.length; i += 1) {
        if (reminders[i].getSurveyID() === surveyID && reminders[i].suppress()) {
            break;
        }
    }
};

/**
 * Deletes all reminders associated with the specified campaign.
 */
ReminderModel.deleteCampaignReminders = function(campaignURN){
    console.log("ReminderModel: Deleting all reminders associated with campaign [" + campaignURN + "].");
    var reminders = ReminderModel.getAllReminders(),
        i;
    for (i = 0; i < reminders.length; i += 1) {
        if (reminders[i].getCampaignURN() === campaignURN) {
            reminders[i].deleteReminder();
        }
    }
};

ReminderModel.getPendingSurveys = function () {
    var currentDate = new Date().getTime();
    var reminders = ReminderModel.getAllReminders();
    var campaign,
        surveys = [],
        i;
    for(i = 0; i < reminders.length; i += 1){
        if(reminders[i].getDate().getTime() < currentDate){
            campaign = CampaignModel(reminders[i].getCampaignURN());
            surveys.push(campaign.getSurvey(reminders[i].getSurveyID()));
        }
    }
    return surveys;
};

/**
 * Returns all reminders that have at least single notification in the future.
 */
ReminderModel.getCurrentReminders = function () {
    var reminders = ReminderModel.getAllReminders(),
        currentReminders = [],
        i;
    for (i = 0; i < reminders.length; i += 1) {
        if (!reminders[i].isExpired()) {
            currentReminders.push(reminders[i]);
        }
    }
    return currentReminders;
};