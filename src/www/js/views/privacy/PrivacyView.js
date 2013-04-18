/**
 * @author Zorayr Khalapyan
 * @version 4/18/13
 */

var PrivacyView = (function () {
    "use strict";
    var that = AbstractView();

    var view = null;

    var PRIVACY_PAGE_URL = "privacy.html";

    that.initializeView = function (onSuccessCallback) {
        PageViewService.loadPageView(PRIVACY_PAGE_URL, function (response) {
            view = PageViewService.convertToDiv(response);
            onSuccessCallback();
        });
    };

    that.render = function () {
        return view;
    };

    return that;
}());