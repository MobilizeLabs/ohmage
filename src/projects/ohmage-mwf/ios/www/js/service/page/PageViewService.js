/**
 * This object is used for asynchronously loading HTML fragments.
 *
 * @author Zorayr Khalapyan
 * @version 4/8/13
 */

var PageViewService = (function () {
    "use strict";

    var that = {};

    that.loadPageView = function (pageViewLink, onSuccessCallback) {
        ServiceController.ajaxRequest({
            dataType : "html",
            url      : pageViewLink,
            success  : onSuccessCallback
        });
    };

    that.convertToDiv = function (responseValue) {
        var divContainer = document.createElement('div');
        divContainer.innerHTML = responseValue;
        return divContainer;
    };

    return that;
}());