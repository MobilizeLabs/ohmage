/**
 * @author Zorayr Khalapyan
 * @version 4/8/13
 */
var AbstractView = function () {
    "use strict";

    var that = {};

    /**
     *  An abstract view initializer that immediately invokes the on success
     *  callback if defined. Custom views should override this method in case
     *  they need to have custom view initialization such as asynchronously
     *  loading HTML pages.
     *
     * @param onSuccessCallback Invoked when the initialization is complete.
     */
    that.initializeView = function (onSuccessCallback) {
        if (onSuccessCallback) {
            onSuccessCallback();
        }
    };

    /**
     * This method should be overridden by child object to return something more
     * useful.
     * @returns {HTMLElement} Stub DIV element that has no purpose in life.
     */
    that.render = function () {
        return document.createElement('div');
    };

    return that;
};