/**
 * @author Zorayr Khalapyan
 * @version 4/16/13
 */

var AbstractEventPublisher = function () {
    "use strict";
    var that = {};

    var events = {};

    var addSubscriptionFunction = function (eventName) {
        that["subscribeTo" + eventName + "Event"] = function (onEventTriggeredCallback) {
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
        that["trigger" + eventName + "Event"] = function () {
            that.triggerEvent(eventName);
        };
    };

    that.registerEvent = function (eventName) {
        events[eventName] = [];
        addSubscriptionFunction(eventName);
        addUnsubscribeFunction(eventName);
        addTriggerFunction(eventName);
    };

    that.triggerEvent = function (eventName) {
        var subscribers = events[eventName],
            numSubscribers = subscribers.length,
            i;
        for (i = 0; i < numSubscribers; i += 1) {
            subscribers[i]();
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