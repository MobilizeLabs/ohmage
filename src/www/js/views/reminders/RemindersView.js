
var RemindersView = function (reminders) {

    var self = {};

    var newReminderCallback = function () {
        PageNavigation.openNewReminderView();
    };

    var editReminderCallback = function (reminder) {
        return function () {
            PageNavigation.openReminderView(reminder.getUUID());
        };
    };

    self.render = function () {

        var numInstalledCampaigns = CampaignsModel.getInstalledCampaignsCount(),
            menu = mwf.decorator.Menu("Available Reminders"),
            container = document.createElement('div'),
            title, date, time, reminderMenuItem, i;

        if (numInstalledCampaigns === 0) {
            var noAvailableSurveysMenuItem = menu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to create custom reminders.");
            TouchEnabledItemModel.bindTouchEvent(noAvailableSurveysMenuItem, noAvailableSurveysMenuItem, PageNavigation.openAvailableCampaignsView, "menu-highlight");
        } else if (reminders.length > 0) {
            for (i = 0; i < reminders.length; i+=1) {
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

        container.appendChild(menu);
        if (numInstalledCampaigns > 0) {
            container.appendChild(mwf.decorator.SingleClickButton("Add Reminder", newReminderCallback));
        }
        return container;

    };

    return self;
};

