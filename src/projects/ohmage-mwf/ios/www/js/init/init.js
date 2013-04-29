/**
 * The object stores common functionality for the page initialization process.
 * Most initialization tasks should be done via the invokeOnReady(callback)
 * method in order to work with both PhoneGap and desktop versions.
 *
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */
var Init = (function () {
    "use strict";

    var that = {};

    var log = Logger("Init");

    /**
     * After the first successful vote, this flag will be set to true, and
     * remaining invocations to invokeOnReady will automatically be invoked
     * without going through other functions that wait for the document or the
     * device to be read etc.
     * @type {boolean}
     */
    var loaded = false;

    var invokeCallback = function (callback) {
        if (callback && typeof callback === 'function') {
            callback();
        }
    };

    /**
     * If the user is not authorized to view this page (pages that do not required authentication are set by the
     * ConfigManager), then opens the authentication page.
     */
    var authCheckpoint = function () {
        log.info("Hit authentication checkpoint: checking to see if the user is allowed to see this page.");
        var pageName = PageController.getCurrentPageName();
        if (!ConfigManager.isOpenPage(pageName) && PageController.getCurrentPageName() !== "auth" && !AuthenticationModel.isUserAuthenticated()) {
            log.info("User did not pass authentication checkpoint - redirecting to login page.");
            PageController.openAuth();
        } else {
            log.info("User passed checkpoint for this page [$1].", pageName);
        }
    };

    var initializeCheckpoint = function () {
        log.info("Initializing authentication checkpoint. Authentication checkpoint will be triggered on each page load.");
        PageController.subscribeToPageLoadedEvent(function () {
            if (PageController.isPageRegistered("auth")) {
                log.info("Authentication page is already registered, so jumping to authentication checkpoint.");
                authCheckpoint();
            } else {
                log.info("Authentication page is not registered, so waiting until authentication page is loaded to jump to the checkpoint.");
                PageController.subscribeToPageRegisteredEvent(function (pageName) {
                    if (pageName === "auth") {
                        authCheckpoint();
                    }
                });
            }

        });
    };

   /**
    * Method for invoking functions once the DOM and the device are ready.
    * This is a replacement function for the JQuery provided method i.e.
    * $(document).ready(...).
    */
    that.invokeOnReady = function (callback) {
        //After the first successful load, invoke the callback immediately.
        if (loaded) {
            invokeCallback(callback);

        //If the application has not completely loaded, wait for the document to
        //be ready, and in the case of a PhoneGap application, wait for the
        //device to be ready as well.
        } else {

            var callbackWrapper = function () {
                loaded = true;
                invokeCallback(callback);
            };

            $(document).ready(function () {
                //If the the application is running as a PhoneGap application, wait
                //for the device ready event before triggering the callback.
                if (DeviceDetection.isOnDevice() && DeviceDetection.isNativeApplication()) {
                    document.addEventListener("deviceready", callbackWrapper, false);
                } else {
                    invokeCallback(callbackWrapper);
                }
            });
        }

    };

    that.invokeOnReady(function () {
        //Initialize the page controller.
        PageController.setDefaultBackButtonHandler();
        PageController.setScreen(document.getElementById("screen"));

        initializeCheckpoint();
    });

    return that;

}());