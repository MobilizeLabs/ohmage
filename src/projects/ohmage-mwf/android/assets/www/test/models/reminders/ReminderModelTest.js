/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.reminders.ReminderModel", {
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

test("Test constructing ReminderModel()", function () {
    "use strict";
    ///
    var reminderModel = ReminderModel();
    ///
    ok(reminderModel.getUUID() !== null, "UUID of the created model should not be null.");
});

test("Test adding a new notification to a reminder.", function () {
    "use strict";
    var reminderModel = ReminderModel(),
        notificationAdapter = fixture.mockNotificationAdapter(),
        futureDate = fixture.getFutureDate();
    reminderModel.setNotificationAdapter(notificationAdapter);
    ///
    var notification = reminderModel.addNotification(futureDate);
    ///
    strictEqual(reminderModel.getNotifications().length, 1, "The reminder model's notification list should contain only one object after adding a single notification.");
    ok(/^\s*\d+\s*$/.test(reminderModel.getNotifications()[0].id), "The ID associated with the new notification should be digits only.");
    strictEqual(reminderModel.getNotifications()[0].date, futureDate, "The date associated with the notification should match the provided future date.");

    try {
        JsMockito.verify(notificationAdapter).add(notification);
        JsMockito.verifyNoMoreInteractions(notificationAdapter);
    } catch (errorMsg) {
        ok(false, errorMsg);
    }

});

test("Test converting a reminder model to a JSON object.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    reminderModel.setTitle("test-title");
    reminderModel.setAssociation("campaign-urn", "survey-id");
    reminderModel.setMessage("test-message");
    reminderModel.setSuppressionWindow(100);
    reminderModel.setExcludeWeekends(true);
    //Add some notifications in the next 3 hours.
    reminderModel.addNotification(fixture.getFutureDate(1));
    reminderModel.addNotification(fixture.getFutureDate(2));
    reminderModel.addNotification(fixture.getFutureDate(3));
    ///
    var json = reminderModel.toJSON();
    ///
    strictEqual(json.title, reminderModel.getTitle(), "The JSON title should match the specified title.");
    strictEqual(json.campaign_urn, reminderModel.getCampaignURN(), "The JSON campaign URN should match the specified URN.");
    strictEqual(json.survey_id, reminderModel.getSurveyID(), "The JSON survey ID should match the specified ID.");
    strictEqual(json.message, reminderModel.getMessage(), "The JSON message should match the specified message.");
    strictEqual(json.suppression_window, reminderModel.getSuppressionWindow(), "The JSON suppression window should match the specified suppression window.");
    strictEqual(json.exclude_weekends, reminderModel.excludeWeekends(), "The JSON value of exclude weekends should match the specified value.");
    strictEqual(json.notifications.length, 3, "JSON notifications list should include all three notifications.");
    strictEqual(json.notifications[0].id, 0, "First element of JSON notifications list should be notification with id 0.");
    strictEqual(json.notifications[1].id, 1, "Second element of JSON notifications list should be notification with id 1.");
    strictEqual(json.notifications[2].id, 2, "Third element of JSON notifications list should be notification with id 2.");
});

test("Test saving the reminder model in local storage using RemindersModel.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    ///
    reminderModel.save();
    ///
    strictEqual(fixture.remindersMap.length(), 1, "After calling save, only single reminder should be in the reminders list.");
    ok(fixture.remindersMap.isSet(reminderModel.getUUID()), "The saved reminders should contain an entry with the provided reminder's UUID value.");
});


test("Test detecting if a reminder model has been saved after saving it.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    reminderModel.save();
    ///
    var isSaved = reminderModel.isSaved();
    ///
    ok(isSaved, "Reminder model that has been manually saved should have a true value for isSaved().");
});


test("Test detecting if a reminder model has been saved without actually saving it.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    ///
    var isSaved = reminderModel.isSaved();
    ///
    ok(!isSaved, "Reminder model that has not been manually saved should not have a true value for isSaved().");
});

test("Test canceling all notifications from a given reminder model.", function () {
    "use strict";
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter(notificationAdapter);

    //Add some notifications to cancel.
    var notification1 = reminderModel.addNotification(fixture.getFutureDate(1));
    var notification2 = reminderModel.addNotification(fixture.getFutureDate(2));
    var notification3 = reminderModel.addNotification(fixture.getFutureDate(3));

    ///
    reminderModel.cancelAllNotifications();
    ///

    strictEqual(reminderModel.getNotifications().length, 0, "After cancelling all notifications, the reminder model's notitication list should be empty.");

    try {
        JsMockito.verify(notificationAdapter).add(notification1);
        JsMockito.verify(notificationAdapter).add(notification2);
        JsMockito.verify(notificationAdapter).add(notification3);

        JsMockito.verify(notificationAdapter).cancel(0);
        JsMockito.verify(notificationAdapter).cancel(1);
        JsMockito.verify(notificationAdapter).cancel(2);

        JsMockito.verifyNoMoreInteractions(notificationAdapter);
    } catch (errorMsg) {
        ok(false, errorMsg);
    }

});

test("Test deleting a reminder model.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    ///
    reminderModel.deleteReminder();
    ///
    ok(!reminderModel.isSaved(), "Deleted reminder model should not be saved.");
    strictEqual(reminderModel.getNotifications().length, 0, "Deleted reminder model's notification list should be empty.");
});

test("Test suppress()", function () {
    "use strict";
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter(notificationAdapter);

    //Add some notifications in the next 3 hours.
    var notification1 = reminderModel.addNotification(fixture.getFutureDate(1));
    var notification2 = reminderModel.addNotification(fixture.getFutureDate(2));
    var notification3 = reminderModel.addNotification(fixture.getFutureDate(3));

    //Set a suppression window.
    reminderModel.setSuppressionWindow(24);

    ///
    var suppress = reminderModel.suppress();
    ///

    strictEqual(reminderModel.getNotifications().length, 0, "All notifications should have been cancelled and the notifications list should be empty.");
    ok(suppress, "The returned value should be true since three notifications have been cancelled. ");
    try {
        JsMockito.verify(notificationAdapter).add(notification1);
        JsMockito.verify(notificationAdapter).add(notification2);
        JsMockito.verify(notificationAdapter).add(notification3);

        JsMockito.verify(notificationAdapter).cancel(0);
        JsMockito.verify(notificationAdapter).cancel(1);
        JsMockito.verify(notificationAdapter).cancel(2);

        JsMockito.verifyNoMoreInteractions(notificationAdapter);
    } catch (errorMsg) {
        ok(false, errorMsg);
    }

});

test("Test suppress()", function () {
    "use strict";
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter(notificationAdapter);

    //Set a suppression window.
    reminderModel.setSuppressionWindow(24);

    //Add some notifications in the next 3 hours, and one notification past the
    //suppression window (i.e. 29 > 24).
    var notification1 = reminderModel.addNotification(fixture.getFutureDate(1));
    var notification2 = reminderModel.addNotification(fixture.getFutureDate(2));
    var notification29 = reminderModel.addNotification(fixture.getFutureDate(29));

    ///
    var suppress = reminderModel.suppress();
    ///

    strictEqual(reminderModel.getNotifications().length, 1, "All notifications should have been cancelled and the notifications list should be empty.");
    ok(suppress, "The returned value should be true since two notifications have been cancelled. ");
    try {
        JsMockito.verify(notificationAdapter).add(notification1);
        JsMockito.verify(notificationAdapter).add(notification2);
        JsMockito.verify(notificationAdapter).add(notification29);

        JsMockito.verify(notificationAdapter).cancel(0);
        JsMockito.verify(notificationAdapter).cancel(1);

        JsMockito.verifyNoMoreInteractions(notificationAdapter);
    } catch (errorMsg) {
        ok(false, errorMsg);
    }

});

test("Test !suppress()", function () {
    "use strict";
    var reminderModel = ReminderModel();
    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter(notificationAdapter);
    ///
    var suppress = reminderModel.suppress();
    ///
    ok(!suppress, "The returned value should be false since no notifications have been cancelled. ");
    try {
        JsMockito.verifyNoMoreInteractions(notificationAdapter);
    } catch (errorMsg) {
        ok(false, errorMsg);
    }
});

test("Test !suppress()", function () {
    "use strict";
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter(notificationAdapter);

    //Set a suppression window.
    reminderModel.setSuppressionWindow(24);

    //Add some notifications past the suppression window.
    var notification30 = reminderModel.addNotification(fixture.getFutureDate(30));
    var notification35 = reminderModel.addNotification(fixture.getFutureDate(35));
    var notification40 = reminderModel.addNotification(fixture.getFutureDate(40));

    ///
    var suppress = reminderModel.suppress();
    ///

    strictEqual(reminderModel.getNotifications().length, 3, "No notifications should have been cancelled.");
    ok(!suppress, "The returned value should be false since no notifications have been cancelled. ");
    try {
        JsMockito.verify(notificationAdapter).add(notification30);
        JsMockito.verify(notificationAdapter).add(notification35);
        JsMockito.verify(notificationAdapter).add(notification40);

        JsMockito.verifyNoMoreInteractions(notificationAdapter);
    } catch (errorMsg) {
        ok(false, errorMsg);
    }

});

test("Test restoring saved reminder model.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    reminderModel.setTitle("test-title");
    reminderModel.setAssociation("campaign-urn", "survey-id");
    reminderModel.setMessage("test-message");
    reminderModel.setSuppressionWindow(100);
    reminderModel.setExcludeWeekends(true);
    //Add some notifications in the next 3 hours.
    var notification1 = reminderModel.addNotification(fixture.getFutureDate(1));
    var notification2 = reminderModel.addNotification(fixture.getFutureDate(2));
    var notification3 = reminderModel.addNotification(fixture.getFutureDate(3));
    reminderModel.save();
    ///
    var restoredModel = ReminderModel(reminderModel.getUUID());
    ///
    strictEqual(restoredModel.getTitle(), reminderModel.getTitle(), "The restored title should match the specified title.");
    strictEqual(restoredModel.getCampaignURN(), reminderModel.getCampaignURN(), "The restored campaign URN should match the specified URN.");
    strictEqual(restoredModel.getSurveyID(), reminderModel.getSurveyID(), "The restored survey ID should match the specified ID.");
    strictEqual(restoredModel.getMessage(), reminderModel.getMessage(), "The restored message should match the specified message.");
    strictEqual(restoredModel.getSuppressionWindow(), reminderModel.getSuppressionWindow(), "The restored suppression window should match the specified suppression window.");
    strictEqual(restoredModel.excludeWeekends(), reminderModel.excludeWeekends(), "The restored value of exclude weekends should match the specified value.");
    strictEqual(restoredModel.getNotifications().length, 3, "All notifications should have been restored.");
    strictEqual(restoredModel.getNotifications()[0].id, 0, "First restored notification should have ID of 0.");
    strictEqual(restoredModel.getNotifications()[1].id, 1, "First restored notification should have ID of 0.");
    strictEqual(restoredModel.getNotifications()[2].id, 2, "First restored notification should have ID of 0.");
    strictEqual(restoredModel.getNotifications()[0].date.getTime(), notification1.date.getTime(), "The time of the notification should be correctly restored.");
    strictEqual(restoredModel.getNotifications()[1].date.getTime(), notification2.date.getTime(), "The time of the notification should be correctly restored.");
    strictEqual(restoredModel.getNotifications()[2].date.getTime(), notification3.date.getTime(), "The time of the notification should be correctly restored.");
});

test("Test setting and accessing campaign URN and survey ID for a given reminder model.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    ///
    reminderModel.setAssociation("campaign-urn", "survey-id");
    ///
    strictEqual(reminderModel.getCampaignURN(), "campaign-urn", "Campaign URN should match the specified URN.");
    strictEqual(reminderModel.getSurveyID(), "survey-id", "Survey ID should match the specified ID.");
});

test("Test detecting an expired reminder model.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    ///
    var isExpired = reminderModel.isExpired();
    ///
    ok(isExpired, "Reminder model with no notifications should be expired.");
});

test("Test detecting an expired reminder model with several notifications.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    reminderModel.addNotification(fixture.getPastDate(2));
    reminderModel.addNotification(fixture.getPastDate(1));
    ///
    var isExpired = reminderModel.isExpired();
    ///
    ok(isExpired, "Reminder model with notifications in the past should be expired.");
});

test("Test detecting a reminder model that is not expired and has a single notification.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    reminderModel.addNotification(fixture.getFutureDate(1));
    ///
    var isExpired = reminderModel.isExpired();
    ///
    ok(!isExpired, "Reminder model with a notification in the future should not be expired.");
});

test("Test getting the date of a reminder that has no added notifications.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    ///
    var getDate = reminderModel.getDate();
    ///
    strictEqual(getDate, null, "Date of a reminder with no notifications should be null.");
});

test("Test getting the date of a reminder model with two added notifications.", function () {
    "use strict";
    var reminderModel = ReminderModel();
    reminderModel.addNotification(fixture.getFutureDate(1));
    reminderModel.addNotification(fixture.getFutureDate(2));
    ///
    var getDate = reminderModel.getDate();
    ///
    strictEqual(getDate, reminderModel.getNotifications()[0].date, "getDate should return the earliest set notification for the reminder.");
});