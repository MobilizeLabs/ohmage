/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 *
 * @param pageName The name is used as a unique identifier of the current page.
 * @param pageTitle The title of the current page.
 */
var PageModel = function (pageName, pageTitle) {
    "use strict";

    var that = {};

    var view = null;

    /**
     * Stores information required for adding a top button to the mobile page.
     * If the top button name is null, that means that the current page does not
     * have a top button.
     */
    var topButtonLabel, topButtonCallback;

    that.getPageName = function () {
        return pageName;
    };

    that.getPageTitle = function () {
        return pageTitle;
    };

    that.setPageTitle = function (newPageTitle) {
        pageTitle = newPageTitle;
    };

    that.getPageTitle = function () {
        return pageTitle;
    };

    that.setTopButton = function (newTopButtonLabel, newTopButtonCallback) {
        topButtonLabel = newTopButtonLabel;
        topButtonCallback = newTopButtonCallback;
    };

    that.getTopButtonName = function () {
        return topButtonLabel;
    };

    that.getTopButtonCallback = function () {
        return topButtonCallback;
    };

    that.removeTopButton = function () {
        topButtonLabel = null;
        topButtonCallback = null;
    };

    that.setView = function (newView) {
        view = newView;
    };

    that.getView = function () {
        return view;
    };

    return that;
};
