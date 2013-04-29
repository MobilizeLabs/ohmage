var RemindersView = function () {
    "use strict";
    var that = AbstractView();

    var reminders = null;

    that.newReminderCallback = function () {};
    that.editReminderCallback = function (reminderModel) {};

    var editReminderCallbackClosure = function (reminderModel) {
        return function () {
            that.editReminderCallback(reminderModel);
        };
    };

    var renderNoCampaignsInstalled = function (remindersMenu) {
        var noAvailableSurveysMenuItem = remindersMenu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to create custom reminders.");
        TouchEnabledItemModel.bindTouchEvent(noAvailableSurveysMenuItem, noAvailableSurveysMenuItem, PageController.openAvailableCampaigns, "menu-highlight");
    };

    var renderNoRemindersFound = function (remindersMenu) {
        var noReminderFoundMenuItem = remindersMenu.addMenuLinkItem("No Reminder Found", null, "Click to add a new reminder.");
        TouchEnabledItemModel.bindTouchEvent(noReminderFoundMenuItem, noReminderFoundMenuItem, that.newReminderCallback, "menu-highlight");
    };

    var renderAvailableReminders = function (remindersMenu) {
        var title,
            date,
            time,
            reminderMenuItem,
            i;
        for (i = 0; i < reminders.length; i += 1) {
            title = reminders[i].getTitle();
            date  = reminders[i].getDate();
            time  = "Reminder set for " + DateTimePicker.getPaddedTime(date) + ".";
            reminderMenuItem = remindersMenu.addMenuLinkItem(title, null, time);
            TouchEnabledItemModel.bindTouchEvent(reminderMenuItem, reminderMenuItem, editReminderCallbackClosure(reminders[i]), "menu-highlight");
        }
        return remindersMenu;
    };

    that.initializeView = function (onSuccessCallback) {
        reminders = RemindersModel.getAllReminders();
        onSuccessCallback();
    };

    that.render = function () {

        var numInstalledCampaigns = CampaignsModel.getInstalledCampaignsCount(),
            remindersMenu = mwf.decorator.Menu("Available Reminders");

        if (numInstalledCampaigns === 0) {
            renderNoCampaignsInstalled(remindersMenu);

        } else if (reminders.length > 0) {
            renderAvailableReminders(remindersMenu);
        } else {
            renderNoRemindersFound(remindersMenu);
        }

        var container = document.createElement('div');
        container.appendChild(remindersMenu);

        if (numInstalledCampaigns > 0) {
            container.appendChild(mwf.decorator.SingleClickButton("Add Reminder", that.newReminderCallback));
        }

        return container;

    };

    return that;
};

