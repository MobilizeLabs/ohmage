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

    /**
     * Stores information required for adding a top button to the mobile page.
     * If the top button name is null, that means that the current page does not
     * have a top button.
     */
    var topButtonName, topButtonCallback;

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

    that.setTopButton = function (newTopButtonName, newTopButtonCallback) {
        topButtonName = newTopButtonName;
        topButtonCallback = newTopButtonCallback;
    };

    that.removeTopButton = function () {
        topButtonName = null;
        topButtonCallback = null;
    };

    return that;
};
