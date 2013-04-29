/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 */

var AbstractEventPublisher = function (eventPublisherName) {
    "use strict";
    var that = {};

    var events = {};

    var log = Logger(eventPublisherName + "[event]" || "AbstractEventPublisher[event]");

    var addSubscriptionFunction = function (eventName) {
        that["subscribeTo" + eventName + "Event"] = function (onEventTriggeredCallback) {
            log.info("Added new subscriber for event [$1].", eventName);
            events[eventName].push(onEventTriggeredCallback);
        };
    };

    var addUnsubscribeFunction = function (eventName) {
        that["unsubscribeFrom" + eventName + "Event"] = function (onEventTriggeredCallback) {
            var eventSubscribers = events[eventName],
                numEventSubscribers = eventSubscribers.length,
                i;
            for (i = 0; i < numEventSubscribers; i += 1) {
                if (eventSubscribers[i] === onEventTriggeredCallback) {
                    eventSubscribers.splice(i, 1);
                }
            }
        };
    };

    var addTriggerFunction = function (eventName) {
        that["trigger" + eventName + "Event"] = function (args) {
            that.triggerEvent(eventName, args);
        };
    };

    that.registerEvent = function (eventName) {
        events[eventName] = [];
        addSubscriptionFunction(eventName);
        addUnsubscribeFunction(eventName);
        addTriggerFunction(eventName);
    };

    that.triggerEvent = function (eventName, args) {
        var subscribers = events[eventName],
            numSubscribers = subscribers.length,
            i;
        log.info("Triggered event [$1] with arguments [$2].", eventName, args);
        for (i = 0; i < numSubscribers; i += 1) {
            subscribers[i](args);
        }
    };

    /**
     * @visibleForTesting
     * @returns {{}}
     */
    that.getEvents = function () {
        return events;
    };

    return that;
};