/*-
 * Phonegap LocalNotification Plugin for Android
 * 
 * Created by Daniel van 't Oever 2012 MIT Licensed
 * 
 * Usage: 
 * 
 * plugins.localNotification.add({ date: new Date(), message: 'This is an Android alarm using the statusbar', id: 123 });
 * plugins.localNotification.cancel(123); 
 * plugins.localNotification.cancelAll();
 * 
 * This interface is similar to the existing iOS LocalNotification plugin created by Greg Allen
 */
if (typeof PhoneGap !== "undefined") {

    /**
     * Empty constructor
     */
    var LocalNotification = function () {
        "use strict";
    };

    /**
     * Register a notification message for a specific date / time.
     * @param options Object with arguments. Valid arguments are date, message,
     *        repeatDaily and id
     */
    LocalNotification.prototype.add = function (options) {
        "use strict";
        var defaults = {
            date : new Date(),
            message : '',
            ticker : '',
            repeatDaily : false,
            id : ""
        },
            key;

        if (options.date) {
            options.date = (options.date.getMonth()) + "/" + (options.date.getDate()) + "/"
                    + (options.date.getFullYear()) + "/" + (options.date.getHours()) + "/"
                    + (options.date.getMinutes());
        }

        for (key in defaults) {
            if (typeof options[key] !== "undefined")
                defaults[key] = options[key];
        }

        PhoneGap.exec(null, null, 'LocalNotification', 'add', [defaults]);
    };

    /**
     * Cancel an existing notification using its original ID.
     * 
     * @param notificationId The ID that was used when creating the
     *        notification using the 'add' method.
     */
    LocalNotification.prototype.cancel = function (notificationId) {
        "use strict";
        PhoneGap.exec(null, null, 'LocalNotification', 'cancel', new Array({
            id : notificationId
        }));
    };

    /**
     * Cancel all notifications that were created by your application.
     */
    LocalNotification.prototype.cancelAll = function () {
        "use strict";
        PhoneGap.exec(null, null, 'LocalNotification', 'cancelAll', []);
    };

    /**
     * Register this plugin with phonegap
     */
    PhoneGap.addConstructor(function () {
        "use strict";
        if (!window.plugins) {
            window.plugins = {};
        }
        window.plugins.localNotification = new LocalNotification();
    });
}