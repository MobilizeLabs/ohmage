/**
 * @class ReminderModel 
 * @author Zorayr Khalapyan
 * @version 8/13/2012
 */
var ReminderModel = function(uuid){
    
    var self = this;
    var title = "";
    var campaignURN = "";
    var surveyID = ""
    var message = "";
    var ticker = "";
    var supressionWindow = 24;
    var excludeWeekends = false;
    var notifications = [];
    
    /**
     * Cancels a set notification with the provided ID.
     */
    var cancelNotification = function(notification){
        //Don't cancel notifications  that are in the past. '
        if(notification.date.getTime() < new Date().getTime()) {
            console.log("ReminderModel: Canceling notification with id [" + notification.id + "] associated with survey [" + surveyID + "]");
            LocalNotificationAdapter.cancel(notification.id);
        }
    };
    
    /**
     * Returns a JSON representation of the current reminder model. All time 
     * related data will be stored as integers.
     */
    var toJSON = function(){
        var reminderJSON = {
            title             : title,
            campaign_urn      : campaignURN,
            survey_id         : surveyID,
            messsage          : message,
            ticker            : ticker,
            supression_window : supressionWindow,
            exclude_weekends  : excludeWeekends
        };
        reminderJSON.notifications = [];
        for(var i = 0; i < notifications.length; i++){
            reminderJSON.notifications.push({
               id   : notifications[i].id,
               time : notifications[i].date.getTime()
            });
        }
        return reminderJSON;
    };
   
    self.addNotification = function(date){
        var id = ReminderModel.getNextAvailableNotificationID();
        var options = {
            date        : date,
            message     : message,
            ticker      : ticker,
            repeatDaily : false,
            id          : id
        };
        console.log("ReminderModel: Notification was set with the following options - " + JSON.stringify(options));
        LocalNotificationAdapter.add(options);
        notifications.push({id : id, date : date});
    };
    
    /**
     * Saves the current reminder in localStorage.
     */
    self.save = function(){
        ReminderModel.reminders.set(uuid, toJSON());  
    };
    
    /**
     * Returns true if the current reminder has been saved in localStorage.
     */
    self.isSaved = function(){
        return ReminderModel.reminders.isSet(uuid);
    };
    
    /**
     * This method is useful when updating the reminder. Instead of deleting and
     * recreating a reminder - the controller can cancel all the current set 
     * notifications, and add new reminders according to the user's 
     * modification. 
     */
    self.cancelAllNotifications = function(){
        for(var i = 0; i < notifications.length; i++){
            cancelNotification(notifications[i]);
        }
        notifications = [];
        self.save();
    };
    
    /**
     * Cancels all set notifications for this reminder and then deletes this
     * reminder from the localStorage.
     */
    self.deleteReminder = function(){
        self.cancelAllNotifications();
        ReminderModel.reminders.release(uuid);
    };
    
    self.suppress = function(date){
        date = date || new Date();
        var activeNotifications = [], i = 0;
        var suppressionWindowTime = supressionWindow * 60 * 60 * 1000;
        var surveySuppressed = false;
        for(i; i < notifications.length; i++){
            if(notifications[i].date.getTime() - date.getTime() < suppressionWindowTime){
                cancelNotification(notifications[i]);
                surveySuppressed = true;
            }else{
                activeNotifications.push(notifications[i]);
            }
        }
        notifications = activeNotifications;
        if(notifications.length === 0){
            self.deleteReminder();
        }else{
            self.save();
        }        
        return surveySuppressed;
    };
    
    /**
     * Restores a reminder with the specified UUID from localStorage.
     */
    self.restore = function(storedUUID){
        var object       = ReminderModel.reminders.get(storedUUID);
        uuid             = storedUUID;
        title            = object.title;
        campaignURN      = object.campaign_urn;
        surveyID         = object.survey_id;
        message          = object.message;
        ticker           = object.ticker;
        supressionWindow = object.supression_window;
        excludeWeekends  = object.exclude_weekends;
        
        notifications = [];
        for(var i = 0; i < object.notifications.length; i++){	
            notifications.push({
                id   : object.notifications[i].id,
                date : new Date(object.notifications[i].time)
            });
        }
    };
    
    self.setAssociation = function(newCampaignURN, newSurveyID){
        campaignURN = newCampaignURN
        surveyID    = newSurveyID;
    };
    
    self.setMessage = function(newMessage){
        message = newMessage;
        ticker  = newMessage;
    };
    
    self.setTitle = function(newTitle){
        title = newTitle;
    };
    
    self.setSupressionWindow = function(newSupressionWindow){
        supressionWindow = newSupressionWindow;
    };
    
    self.setExcludeWeekends = function(newExcludeWeekends){
        excludeWeekends = newExcludeWeekends;
    };
    
    /**
     * A remineder is expired if it doesn't have any more notificationss, or if 
     * the last notification is in the past.
     */
    self.isExpired = function(){
        return notifications.length == 0 
            || notifications[notifications.length - 1].date.getTime() <= new Date().getTime();
    };
     
    self.getUUID = function(){
        return uuid;
    };
    
    self.getCampaignURN = function(){
        return campaignURN;
    };
    
    self.getSurveyID = function(){
        return surveyID;
    };
    
    self.getTitle = function(){
        return title;
    };
    
    /**
     * Returns the date of the earliest set notification for this reminder.
     */
    self.getDate = function(){
        return (notifications.length !== 0)? notifications[0].date : null;
    };
    
    self.getSupressionWindow = function(){
        return parseInt(supressionWindow);
    };
    
    self.excludeWeekends = function(){
        return excludeWeekends;
    };
    
    self.getRecurrence = function(){
        return notifications.length;
    };
    
    //Initialization: if the user has specified a UUID for this reminder than
    //restore the saved model from localStorage. Otherwise, generate a new 
    //unique identifier.
    (function(){
        if(typeof(uuid) !== "undefined"){
            self.restore(uuid);
        }else{
            uuid = UUIDGen.generate();
        }
    }());
    
    return self;
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

ReminderModel.getAllReminders = function(){
    var remindersMap = ReminderModel.reminders.getMap();
    var allReminders = [];
    for(var uuid in remindersMap){
        if(remindersMap.hasOwnProperty(uuid)){
            allReminders.push(new ReminderModel(uuid));
        }
    }
    return allReminders;
};

/**
 * Cancels all set notifications.
 */
ReminderModel.cancelAll = function(){
    console.log("ReminderModel: Cancelling all reminders.");
    var reminders = ReminderModel.getAllReminders(), i = 0;
    for(i; i < reminders.length; i++){
        reminders[i].deleteReminder();
    }
};

/**
 * Supresses all reminders associated with the specified survey.
 */
ReminderModel.supressSurveyReminders = function(surveyID){
    console.log("ReminderModel: Supressing all reminders for survey [" + surveyID + "].");
    var reminders = ReminderModel.getAllReminders(), i = 0;
    for(i; i < reminders.length; i++){
        if(reminders[i].getSurveyID() === surveyID && reminders[i].suppress()){
            break;
        }
    }
};

/**
 * Deletes all reminders associated with the specified campaign.
 */
ReminderModel.deleteCampaignReminders = function(campaignURN){
    console.log("ReminderModel: Deleting all reminders associated with campaign [" + campaignURN + "].");
    var reminders = ReminderModel.getAllReminders(), i = 0;
    for(i; i < reminders.length; i++){
        if(reminders[i].getCampaignURN() === campaignURN){
            reminders[i].deleteReminder();
        }
    }
};
 
ReminderModel.getPendingSurveys = function(){
    var currentDate = new Date().getTime();
    var reminders = ReminderModel.getAllReminders();
    var campaign, surveys = [], i = 0;
    for(i; i < reminders.length; i++){
        if(reminders[i].getDate().getTime() < currentDate){
            campaign = new Campaign(reminders[i].getCampaignURN());
            surveys.push(campaign.getSurvey(reminders[i].getSurveyID()));
        }
    }
    return surveys;
};

/**
 * Returns all reminders that have at least single notification in the future.
 */
ReminderModel.getCurrentReminders = function(){
    var reminders = ReminderModel.getAllReminders();
    var currentReminders = [], i = 0;
    for(i; i < reminders.length; i++){
        if(!reminders[i].isExpired()){
            currentReminders.push(reminders[i]);
        }
    }
    return currentReminders;
};