var RemindersView = function(reminders){

    var self = {};
    
    var newReminderCallback = function(){
        PageNavigation.openNewReminderView();
    };
    
    var editReminderCallback = function(reminder){
        return function(){
            PageNavigation.openReminderView(reminder.getUUID());
        };
    };
    
    self.render = function(){
        
        var numInstalledCampaigns = Campaigns.getInstalledCampaignsCount();
        var menu = mwf.decorator.Menu("Available Reminders");
        
        if(numInstalledCampaigns === 0){
            var noAvailableSurveysMenuItem = menu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to create custom reminders.");
            TouchEnabledItemModel.bindTouchEvent(noAvailableSurveysMenuItem, noAvailableSurveysMenuItem, PageNavigation.openAvailableCampaignsView, "menu-highlight"); 
        }else if(reminders.length > 0){
            var title, date, time, reminderMenuItem;
            for(var i = 0; i < reminders.length; i++){   
                title = reminders[i].getTitle();
                date  = reminders[i].getDate();
                time   = "Reminder set for " + DateTimePicker.getPaddedTime(date) + ".";
                reminderMenuItem = menu.addMenuLinkItem(title, null, time);
                TouchEnabledItemModel.bindTouchEvent(reminderMenuItem, reminderMenuItem, editReminderCallback(reminders[i]), "menu-highlight");
            }
        }else{
            var noReminderFoundMenuItem = menu.addMenuLinkItem("No Reminder Found", null, "Click to add a new reminder.");
            TouchEnabledItemModel.bindTouchEvent(noReminderFoundMenuItem, noReminderFoundMenuItem, newReminderCallback, "menu-highlight");
        }
        
        var container = document.createElement('div');
        container.appendChild(menu);
        if(numInstalledCampaigns > 0){
            container.appendChild(mwf.decorator.SingleClickButton("Add Reminder", newReminderCallback));
        }
        return container;
        
    };
    
    return self;
};

