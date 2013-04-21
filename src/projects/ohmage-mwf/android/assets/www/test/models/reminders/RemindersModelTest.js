/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 */


if (!fixture) {
    var fixture = {};
}

module("models.reminders.RemindersModel", {
    setup: function () {
        "use strict";

        fixture.remindersMap = LocalMap("reminders");

        fixture.mockNotificationAdapter = function () {
            return mock(LocalNotificationAdapter);
        };

        fixture.getFutureDate = function (hourOffset, dateOffset) {
            var futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + (hourOffset || 1));
            futureDate.setDate(futureDate.getDate() + (dateOffset || 0));
            return futureDate;
        };

        fixture.getPastDate = function (hourOffset, dateOffset) {
            hourOffset = hourOffset || 1;
            dateOffset = dateOffset || 0;
            return fixture.getFutureDate(-hourOffset, -dateOffset);
        };
    },
    teardown: function () {
        "use strict";
        fixture.remindersMap.erase();
        LocalMap('reminders-metadata').erase();

        delete fixture.remindersMap;
        delete fixture.mockNotificationAdapter;
        delete fixture.getFutureDate;
        delete fixture.getPastDate;

    }
});
test("Test getting the next available notification ID.", function () {
    "use strict";
    ///
    var id1 = RemindersModel.getNextAvailableNotificationID();
    var id2 = RemindersModel.getNextAvailableNotificationID();
    var id3 = RemindersModel.getNextAvailableNotificationID();
    var id4 = RemindersModel.getNextAvailableNotificationID();
    ///
    strictEqual(id1, 0);
    strictEqual(id2, 1);
    strictEqual(id3, 2);
    strictEqual(id4, 3);

});

test("Test accessing all available reminders.", function () {
    "use strict";
    ///
    var allReminders = RemindersModel.getAllReminders();
    ///
    strictEqual(allReminders.length, 0, "The number of restored reminders should equal to the number of saved reminders.");
});

test("Test RemindersModel.getAllReminders()", function () {
    "use strict";
    var reminderModel1 = ReminderModel(),
        reminderModel2 = ReminderModel(),
        reminderModel3 = ReminderModel();
    reminderModel1.save();
    reminderModel2.save();
    reminderModel3.save();
    ///
    var allReminders = RemindersModel.getAllReminders();
    ///
    strictEqual(allReminders.length, 3, "The number of restored reminders should equal to the number of saved reminders.");
    strictEqual(allReminders[0].getUUID(), reminderModel1.getUUID(), "The UUID of the restored reminder should match the UUID of the saved reminder model.");
    strictEqual(allReminders[1].getUUID(), reminderModel2.getUUID(), "The UUID of the restored reminder should match the UUID of the saved reminder model.");
    strictEqual(allReminders[2].getUUID(), reminderModel3.getUUID(), "The UUID of the restored reminder should match the UUID of the saved reminder model.");
});

test("Test cancelling all reminders.", function () {
    "use strict";
    var reminderModel1 = ReminderModel(),
        reminderModel2 = ReminderModel(),
        reminderModel3 = ReminderModel();
    //Add some notifications in the next 3 hours.
    reminderModel1.addNotification(fixture.getFutureDate(1));
    reminderModel2.addNotification(fixture.getFutureDate(2));
    reminderModel3.addNotification(fixture.getFutureDate(3));
    //Save the models.
    reminderModel1.save();
    reminderModel2.save();
    reminderModel3.save();
    ///
    RemindersModel.cancelAll();
    ///
    strictEqual(RemindersModel.getAllReminders().length, 0, "All reminders should be canceled.");
});