/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 * @constructor
 */
var RemindersController = (function () {
    "use strict";
    var that = {};

    var remindersView = null;

    var newReminderCallback = function () {
        PageController.openReminder();
    };

    var editReminderCallback = function (reminderModel) {
        PageController.openReminder({reminderModelUUID : reminderModel.getUUID()});
    };

    that.getView = function () {
        if (remindersView === null) {
            remindersView = RemindersView();
            remindersView.newReminderCallback = newReminderCallback;
            remindersView.editReminderCallback = editReminderCallback;
            return remindersView;
        }
    };

    return that;
}());