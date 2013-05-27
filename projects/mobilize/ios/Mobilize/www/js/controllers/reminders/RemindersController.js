var RemindersController = function(){
    var self = {};
    
    self.render = function(){
        var reminders = ReminderModel.getCurrentReminders();
        var view = new RemindersView(reminders);
        return view.render();
    };
    
    return self;
};