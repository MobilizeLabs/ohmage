var ReminderListView = function(reminders, listTitle, onReminderClickCallback){
    var self = {};

    self.render = function(menu){

        menu = menu || mwf.decorator.Menu(listTitle);

        var onReminderClickCallbackClosure = function(reminder){
            return function () {
                onReminderClickCallback(reminder);
            };
        };

        var i, title, date, time, menuItem;

        for (i = 0; i < reminders.length; i += 1) {
            title = reminders[i].getTitle();
            date  = reminders[i].getDate();
            time   = "Reminder set for " + DateTimePicker.getPaddedTime(date) + ".";
            menuItem = menu.addMenuLinkItem(title, null, time);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onReminderClickCallbackClosure(reminders[i]), "menu-highlight");
        }

        return menu;

    };

    return self;
};