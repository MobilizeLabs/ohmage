/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 */

module("util.AbstractEventPublisher", {
    setup: function () {
        "use strict";
    },
    teardown: function () {
        "use strict";
    }
});

test("Test registering an event.", function () {
    "use strict";
    var eventPublisher = AbstractEventPublisher();
    ///
    eventPublisher.registerEvent("EventName");
    ///
    strictEqual(eventPublisher.getEvents().EventName.length, 0, "Without any subscribers the event array should be empty.");
    notStrictEqual(eventPublisher.subscribeToEventNameEvent, undefined, "A subscription function should be dynamically added to the event publisher.");
    notStrictEqual(eventPublisher.unsubscribeFromEventNameEvent, undefined, "An unsubscription function should be dynamically added to the event publisher.");
    notStrictEqual(eventPublisher.triggerEventNameEvent, undefined, "A trigger function should be dynamically added to the event publisher.");
});

test("Test registering multiple events.", function () {
    "use strict";
    var eventPublisher = AbstractEventPublisher();
    ///
    eventPublisher.registerEvent("EventName1");
    eventPublisher.registerEvent("EventName2");
    ///

    strictEqual(eventPublisher.getEvents().EventName1.length, 0, "Without any subscribers the event array should be empty.");
    notStrictEqual(eventPublisher.subscribeToEventName1Event, undefined, "A subscription function should be dynamically added to the event publisher.");
    notStrictEqual(eventPublisher.unsubscribeFromEventName1Event, undefined, "An unsubscription function should be dynamically added to the event publisher.");
    notStrictEqual(eventPublisher.triggerEventName1Event, undefined, "A trigger function should be dynamically added to the event publisher.");

    strictEqual(eventPublisher.getEvents().EventName2.length, 0, "Without any subscribers the event array should be empty.");
    notStrictEqual(eventPublisher.subscribeToEventName2Event, undefined, "A subscription function should be dynamically added to the event publisher.");
    notStrictEqual(eventPublisher.unsubscribeFromEventName2Event, undefined, "An unsubscription function should be dynamically added to the event publisher.");
    notStrictEqual(eventPublisher.triggerEventName2Event, undefined, "A trigger function should be dynamically added to the event publisher.");
});

test("Test subscribing to an event.", function () {
    "use strict";
    var eventPublisher = AbstractEventPublisher(),
        onEventTriggeredCallback = function () {};
    eventPublisher.registerEvent("EventName");
    ///
    eventPublisher.subscribeToEventNameEvent(onEventTriggeredCallback);
    ///
    strictEqual(eventPublisher.getEvents().EventName.length, 1, "With only one subscriber the event array should include one callback.");
    strictEqual(eventPublisher.getEvents().EventName[0], onEventTriggeredCallback, "The first subscriber of the registered event should be the correct callback function.");
});

test("Test unsubscribing from an event.", function () {
    "use strict";
    var eventPublisher = AbstractEventPublisher(),
        onEventTriggeredCallback = function () {};
    eventPublisher.registerEvent("EventName");
    eventPublisher.subscribeToEventNameEvent(onEventTriggeredCallback);
    ///
    eventPublisher.unsubscribeFromEventNameEvent(onEventTriggeredCallback);
    ///
    strictEqual(eventPublisher.getEvents().EventName.length, 0, "After unsubscribing from the event, the callback list for the event should be empty.");
});

test("Test triggering an event.", function () {
    "use strict";
    var eventPublisher = AbstractEventPublisher(),
        onEventTriggeredCallback = JsMockito.mockFunction("onEventTriggeredCallback"),
        args = {arg : "value"};
    eventPublisher.registerEvent("EventName");
    eventPublisher.subscribeToEventNameEvent(onEventTriggeredCallback);

    ///
    eventPublisher.triggerEvent("EventName", args);
    ///
    JsMockito.verify(onEventTriggeredCallback)(args);
    JsMockito.verifyNoMoreInteractions(onEventTriggeredCallback);
    notStrictEqual(eventPublisher.triggerEventNameEvent, undefined, "A trigger function should be dynamically added to the event publisher.");
});
