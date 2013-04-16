var LocalNotificationAdapter = (function () {
    "use strict";
    var that = {};

    var isLocalNotificationAvailable = function () {
        return typeof plugins !== "undefined" && plugins.localNotification !== undefined;
    };

    that.add = function (options) {
        if (isLocalNotificationAvailable()) {
            if (DeviceDetection.isDeviceAndroid()) {
                plugins.localNotification.add({
                    date        : options.date,
                    message     : "You have a pending survey.",
                    ticker      : "You have a pending survey.",
                    repeatDaily : options.repeatDaily,
                    id          : options.id
                });
            } else if (DeviceDetection.isDeviceiOS()) {
                plugins.localNotification.add({
                    date        : options.date,
                    message     : options.message,
                    background  : "goToPendingSurveys",
                    badge       : 0,
                    id          : options.id,
                    sound       : 'horn.caf'
                });
            }
        }
    };

    that.cancel = function (id) {
        if (isLocalNotificationAvailable()) {
            console.log("LocalNotificationAdapter: cancel(" + id + ")");
            plugins.localNotification.cancel(id);
        }
    };

    that.cancelAll = function () {
        if (isLocalNotificationAvailable()) {
            console.log("LocalNotificationAdapter: cancelAll()");
            plugins.localNotification.cancelAll();
        }
    };

    return that;
}());

function goToPendingSurveys() {
    "use strict";
    window.location = "pending-surveys.html";
}
