if(!fixture){
    var fixture = {};
}


module( "models.reminders.ReminderModel", {
  setup: function() {
    fixture.mockNotificationAdapter = function() {
        return mock( LocalNotificationAdapter );
    };
    fixture.helpers = {};
    fixture.helpers.getFutureDate = function( hourOffset, dateOffset ) {
        var futureDate = new Date();
        futureDate.setHours( futureDate.getHours() + ( hourOffset || 1 ) );
        futureDate.setDate( futureDate.getDate() + ( dateOffset || 0 ) );
        return futureDate;
    };
    fixture.helpers.getPastDate = function( hourOffset, dateOffset ) {
        hourOffset = hourOffset || 1;
        dateOffset = dateOffset || 0;
        return fixture.helpers.getFutureDate( -hourOffset, -dateOffset );
    };
  },
  teardown: function() {
    LocalMap('reminders').erase();
    LocalMap('reminders-metadata').erase();
    delete fixture.helpers;
    delete fixture.notificationAdapter;
  }
});

test( "Test ReminderModel()", function() {
    ///
    var reminderModel = ReminderModel();
    ///
    ok(reminderModel.getUUID() != null, "UUID of the created model should not be null.");
});

test( "Test addNotification()", function() {
    var reminderModel = ReminderModel();
    var notificationAdapter = fixture.mockNotificationAdapter();
    var futureDate = fixture.helpers.getFutureDate();
    reminderModel.setNotificationAdapter( notificationAdapter );
    ///
    var notification = reminderModel.addNotification( futureDate );
    ///
    equal(reminderModel.getNotifications().length, 1, "The reminder model's notitication list should contain only one object after adding a single notification.");
    ok(/^\s*\d+\s*$/.test(reminderModel.getNotifications()[0].id), "The ID associated with the new notification should be digits only.");
    equal(reminderModel.getNotifications()[0].date, futureDate, "The date associated with the notification should match the provided future date.");

    try {
        verify( notificationAdapter ).add( notification );
        verifyNoMoreInteractions( notificationAdapter );
    } catch( errorMsg ) {
        ok(false, errorMsg );
    }

});

test( "Test toJSON()", function() {
    var reminderModel = ReminderModel();
    reminderModel.setTitle( "test-title" );
    reminderModel.setAssociation( "campaign-urn", "survey-id" );
    reminderModel.setMessage( "test-message" );
    reminderModel.setSupressionWindow( 100 );
    reminderModel.setExcludeWeekends( true );
    //Add some notifications in the next 3 hours.
    reminderModel.addNotification( fixture.helpers.getFutureDate( 1 ) );
    reminderModel.addNotification( fixture.helpers.getFutureDate( 2 ) );
    reminderModel.addNotification( fixture.helpers.getFutureDate( 3 ) );
    ///
    var json = reminderModel.toJSON();
    ///
    equal( json.title, reminderModel.getTitle(), "The JSON title should match the specified title." );
    equal( json.campaign_urn, reminderModel.getCampaignURN(), "The JSON campaign URN should match the specified URN." );
    equal( json.survey_id, reminderModel.getSurveyID(), "The JSON survey ID should match the specified ID." );
    equal( json.message, reminderModel.getMessage(), "The JSON message should match the specified message." );
    equal( json.supression_window, reminderModel.getSupressionWindow(), "The JSON suppression window should match the specified suppression window." );
    equal( json.exclude_weekends, reminderModel.excludeWeekends(), "The JSON value of exclude weekends should match the specified value." );
    equal( json.notifications.length, 3, "JSON notifications list should include all three notifications." );
    equal( json.notifications[0].id, 0, "First element of JSON notifications list should be notification with id 0." );
    equal( json.notifications[1].id, 1, "Second element of JSON notifications list should be notification with id 1." );
    equal( json.notifications[2].id, 2, "Third element of JSON notifications list should be notification with id 2." );
});

test( "Test save()", function() {
    var reminderModel = ReminderModel();
    ///
    reminderModel.save();
    ///
    equal(ReminderModel.reminders.length(), 1, "After calling save, only single reminder should be in the reminders list.");
    ok(ReminderModel.reminders.isSet( reminderModel.getUUID() ), "The saved reminders should contain an entry with the provided reminder's UUID value.");
});

test( "Test isSaved()", function() {
    var reminderModel = ReminderModel();
    reminderModel.save();
    ///
    var isSaved = reminderModel.isSaved();
    ///
    ok(isSaved, "Reminder model that has been manually saved should have a true value for isSaved().");
});

test( "Test !isSaved()", function() {
    var reminderModel = ReminderModel();
    ///
    var isSaved = reminderModel.isSaved();
    ///
    ok(!isSaved, "Reminder model that has not been manually saved should not have a true value for isSaved().");
});

test( "Test cancelAllNotifications()", function() {
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter( notificationAdapter );

    //Add some notifications to cancel.
    var notification1 = reminderModel.addNotification( fixture.helpers.getFutureDate( 1 ) );
    var notification2 = reminderModel.addNotification( fixture.helpers.getFutureDate( 2 ) );
    var notification3 = reminderModel.addNotification( fixture.helpers.getFutureDate( 3 ) );

    ///
    reminderModel.cancelAllNotifications();
    ///

    equal( reminderModel.getNotifications().length, 0, "After cancelling all notifications, the reminder model's notitication list should be empty." );

    try {
        verify( notificationAdapter ).add( notification1 );
        verify( notificationAdapter ).add( notification2 );
        verify( notificationAdapter ).add( notification3 );

        verify( notificationAdapter ).cancel( 0 );
        verify( notificationAdapter ).cancel( 1 );
        verify( notificationAdapter ).cancel( 2 );

        verifyNoMoreInteractions( notificationAdapter );
    } catch( errorMsg ) {
        ok( false, errorMsg );
    }

});

test( "Test deleteReminder()", function() {
    var reminderModel = ReminderModel();
    ///
    reminderModel.deleteReminder();
    ///
    ok( !reminderModel.isSaved(), "Deleted reminder model should not be saved." );
    equal( reminderModel.getNotifications().length, 0, "Deleted reminder model's notitication list should be empty." );
});

test( "Test suppress()", function() {
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter( notificationAdapter );

    //Add some notifications in the next 3 hours.
    var notification1 = reminderModel.addNotification( fixture.helpers.getFutureDate( 1 ) );
    var notification2 = reminderModel.addNotification( fixture.helpers.getFutureDate( 2 ) );
    var notification3 = reminderModel.addNotification( fixture.helpers.getFutureDate( 3 ) );

    //Set a suppression window.
    reminderModel.setSupressionWindow( 24 );

    ///
    var suppress = reminderModel.suppress();
    ///

    equal( reminderModel.getNotifications().length, 0, "All notifications should have been cancelled and the notifications list should be empty." );
    ok( suppress, "The returned value should be true since three notifications have been cancelled. ");
    try {
        verify( notificationAdapter ).add( notification1 );
        verify( notificationAdapter ).add( notification2 );
        verify( notificationAdapter ).add( notification3 );

        verify( notificationAdapter ).cancel( 0 );
        verify( notificationAdapter ).cancel( 1 );
        verify( notificationAdapter ).cancel( 2 );

        verifyNoMoreInteractions( notificationAdapter );
    } catch( errorMsg ) {
        ok( false, errorMsg );
    }

});

test( "Test suppress()", function() {
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter( notificationAdapter );

    //Set a suppression window.
    reminderModel.setSupressionWindow( 24 );

    //Add some notifications in the next 3 hours, and one notification past the
    //suppression window (i.e. 29 > 24).
    var notification1 = reminderModel.addNotification( fixture.helpers.getFutureDate( 1 ) );
    var notification2 = reminderModel.addNotification( fixture.helpers.getFutureDate( 2 ) );
    var notification29 = reminderModel.addNotification( fixture.helpers.getFutureDate( 29 ) );

    ///
    var suppress = reminderModel.suppress();
    ///

    equal( reminderModel.getNotifications().length, 1, "All notifications should have been cancelled and the notifications list should be empty." );
    ok( suppress, "The returned value should be true since two notifications have been cancelled. ");
    try {
        verify( notificationAdapter ).add( notification1 );
        verify( notificationAdapter ).add( notification2 );
        verify( notificationAdapter ).add( notification29 );

        verify( notificationAdapter ).cancel( 0 );
        verify( notificationAdapter ).cancel( 1 );

        verifyNoMoreInteractions( notificationAdapter );
    } catch( errorMsg ) {
        ok( false, errorMsg );
    }

});

test( "Test !suppress()", function() {
    var reminderModel = ReminderModel();
    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter( notificationAdapter );
    ///
    var suppress = reminderModel.suppress();
    ///
    ok( !suppress, "The returned value should be false since no notifications have been cancelled. ");
    try {
        verifyNoMoreInteractions( notificationAdapter );
    } catch( errorMsg ) {
        ok( false, errorMsg );
    }
});

test( "Test !suppress()", function() {
    var reminderModel = ReminderModel();

    //Mock the notification adapter to detect add/cancel calls.
    var notificationAdapter = fixture.mockNotificationAdapter();
    reminderModel.setNotificationAdapter( notificationAdapter );

    //Set a suppression window.
    reminderModel.setSupressionWindow( 24 );

    //Add some notifications past the suppression window.
    var notification30 = reminderModel.addNotification( fixture.helpers.getFutureDate( 30 ) );
    var notification35 = reminderModel.addNotification( fixture.helpers.getFutureDate( 35 ) );
    var notification40 = reminderModel.addNotification( fixture.helpers.getFutureDate( 40 ) );

    ///
    var suppress = reminderModel.suppress();
    ///

    equal( reminderModel.getNotifications().length, 3, "No notifications should have been cancelled." );
    ok( !suppress, "The returned value should be false since no notifications have been cancelled. ");
    try {
        verify( notificationAdapter ).add( notification30 );
        verify( notificationAdapter ).add( notification35 );
        verify( notificationAdapter ).add( notification40 );

        verifyNoMoreInteractions( notificationAdapter );
    } catch( errorMsg ) {
        ok( false, errorMsg );
    }

});

test( "Test restore()", function() {
    var reminderModel = ReminderModel();
    reminderModel.setTitle( "test-title" );
    reminderModel.setAssociation( "campaign-urn", "survey-id" );
    reminderModel.setMessage( "test-message" );
    reminderModel.setSupressionWindow( 100 );
    reminderModel.setExcludeWeekends( true );
    //Add some notifications in the next 3 hours.
    var notification1 = reminderModel.addNotification( fixture.helpers.getFutureDate( 1 ) );
    var notification2 = reminderModel.addNotification( fixture.helpers.getFutureDate( 2 ) );
    var notification3 = reminderModel.addNotification( fixture.helpers.getFutureDate( 3 ) );
    reminderModel.save();
    ///
    var restoredModel = ReminderModel( reminderModel.getUUID() );
    ///
    equal( restoredModel.getTitle(), reminderModel.getTitle(), "The restored title should match the specified title." );
    equal( restoredModel.getCampaignURN(), reminderModel.getCampaignURN(), "The restored campaign URN should match the specified URN." );
    equal( restoredModel.getSurveyID(), reminderModel.getSurveyID(), "The restored survey ID should match the specified ID." );
    equal( restoredModel.getMessage(), reminderModel.getMessage(), "The restored message should match the specified message." );
    equal( restoredModel.getSupressionWindow(), reminderModel.getSupressionWindow(), "The restored suppression window should match the specified suppression window." );
    equal( restoredModel.excludeWeekends(), reminderModel.excludeWeekends(), "The restored value of exclude weekends should match the specified value." );
    equal( restoredModel.getNotifications().length, 3, "All notifications should have been restored." );
    equal( restoredModel.getNotifications()[0].id, 0, "First restored notification should have ID of 0." );
    equal( restoredModel.getNotifications()[1].id, 1, "First restored notification should have ID of 0." );
    equal( restoredModel.getNotifications()[2].id, 2, "First restored notification should have ID of 0." );
    equal( restoredModel.getNotifications()[0].date.getTime(), notification1.date.getTime(), "The time of the notification should be correctly restored." );
    equal( restoredModel.getNotifications()[1].date.getTime(), notification2.date.getTime(), "The time of the notification should be correctly restored." );
    equal( restoredModel.getNotifications()[2].date.getTime(), notification3.date.getTime(), "The time of the notification should be correctly restored." );

});

test( "Test setAssociation()", function() {
    var reminderModel = ReminderModel();
    ///
    reminderModel.setAssociation( "campaign-urn", "survey-id" );
    ///
    equal( reminderModel.getCampaignURN(), "campaign-urn", "Campaign URN should match the specified URN." );
    equal( reminderModel.getSurveyID(), "survey-id", "Survey ID should match the specified ID." );
});

test( "Test isExpired()", function() {
    var reminderModel = ReminderModel();
    ///
    var isExpired = reminderModel.isExpired();
    ///
    ok( isExpired, "Reminder model with no notifications should be expired." );
});

test( "Test isExpired()", function() {
    var reminderModel = ReminderModel();
    reminderModel.addNotification( fixture.helpers.getPastDate( 2 ) );
    reminderModel.addNotification( fixture.helpers.getPastDate( 1 ) );
    ///
    var isExpired = reminderModel.isExpired();
    ///
    ok( isExpired, "Reminder model with notifications in the past should be expired." );
});

test( "Test !isExpired()", function() {
    var reminderModel = ReminderModel();
    reminderModel.addNotification( fixture.helpers.getFutureDate( 1 ) );
    ///
    var isExpired = reminderModel.isExpired();
    ///
    ok( !isExpired, "Reminder model with a notification in the future should not be expired." );
});

test( "Test getDate()", function() {
    var reminderModel = ReminderModel();
    ///
    var getDate = reminderModel.getDate();
    ///
    equal( getDate, null, "Date of a reminder with no notifications should be null." );
});

test( "Test getDate()", function() {
    var reminderModel = ReminderModel();
    reminderModel.addNotification( fixture.helpers.getFutureDate( 1 ) );
    reminderModel.addNotification( fixture.helpers.getFutureDate( 2 ) );
    ///
    var getDate = reminderModel.getDate();
    ///
    equal( getDate, reminderModel.getNotifications()[0].date, "getDate should return the earliest set notification for the reminder. " );
});

test( "Test ReminderModel.getNextAvailableNotificationID()", function() {
    ///
    var id1 = ReminderModel.getNextAvailableNotificationID();
    var id2 = ReminderModel.getNextAvailableNotificationID();
    var id3 = ReminderModel.getNextAvailableNotificationID();
    var id4 = ReminderModel.getNextAvailableNotificationID();
    ///
    equal(id1, 0);
    equal(id2, 1);
    equal(id3, 2);
    equal(id4, 3);

});

test( "Test ReminderModel.getAllReminders()", function() {
    ///
    var allReminders = ReminderModel.getAllReminders();
    ///
    equal(allReminders.length, 0, "The number of restored reminders should equal to the number of saved reminders.");
});

test( "Test ReminderModel.getAllReminders()", function() {
    var reminderModel1 = ReminderModel();
    var reminderModel2 = ReminderModel();
    var reminderModel3 = ReminderModel();
    reminderModel1.save();
    reminderModel2.save();
    reminderModel3.save();
    ///
    var allReminders = ReminderModel.getAllReminders();
    ///
    equal(allReminders.length, 3, "The number of restored reminders should equal to the number of saved reminders.");
    equal(allReminders[0].getUUID(), reminderModel1.getUUID(), "The UUID of the restored reminder should match the UUID of the saved reminder model.");
    equal(allReminders[1].getUUID(), reminderModel2.getUUID(), "The UUID of the restored reminder should match the UUID of the saved reminder model.");
    equal(allReminders[2].getUUID(), reminderModel3.getUUID(), "The UUID of the restored reminder should match the UUID of the saved reminder model.");
});

test( "Test ReminderModel.cancelAll()", function() {
    var reminderModel1 = ReminderModel();
    var reminderModel2 = ReminderModel();
    var reminderModel3 = ReminderModel();
    //Add some notifications in the next 3 hours.
    reminderModel1.addNotification( fixture.helpers.getFutureDate( 1 ) );
    reminderModel2.addNotification( fixture.helpers.getFutureDate( 2 ) );
    reminderModel3.addNotification( fixture.helpers.getFutureDate( 3 ) );
    //Save the models.
    reminderModel1.save();
    reminderModel2.save();
    reminderModel3.save();
    ///
    ReminderModel.cancelAll();
    ///
    equal(ReminderModel.getAllReminders().length, 0, "All reminders should be canceled.");
});