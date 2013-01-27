var auth, checkpoint = false;
var Init = (function () {

    var that = {};

    var initialized = false;

    /**
     * Will be called only once after the document.ready() event is fired. This
     * is the location where singleton constructors should be invoked.
     */
    var initialize = function () {
        ConfigManagerInitializer();
        PageNavigationInitializer();
        auth = new UserAuthentication ();

        if (typeof(checkpoint) !== 'undefined' && checkpoint) {
            auth.checkpoint();
        }
        initialized = true;
    };

   /**
    * Method for invoking functions once the DOM and the device are ready.
    * This is a replacement function for the JQuery provided method i.e.
    * $(document).ready(...).
    */
    that.invokeOnReady = function (callback) {
        $(document).ready(function () {

            if (!initialized) {
                initialize();
            }

            //Wait for the device ready event only if the the application is running
            //on a mobile browser embedded in a Cordova deployment.
            if (DeviceDetection.isOnDevice() && DeviceDetection.isNativeApplication()) {
                document.addEventListener("deviceready", callback, false);
            } else if (callback && typeof( callback ) === 'function') {
                callback();
            }

        });
    };

    return that;

}());