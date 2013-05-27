/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 *
 * @param pageName The name is used as a unique identifier of the current page.
 * @param pageTitle The title of the current page.
 * @constructor
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

    /**
     * The navigation buttons are added to the bottom of the rendered view and
     * are usually used to go back to the main page, or go to another page.
     */
    var navigationButtonLabel, navigationButtonCallback;

    /**
     * Stores a callback that is invoked before the page is rendered. This
     * callback can be used to fetch any page parameters for rendering. By
     * default, the method is set to immediately invoke the onSuccessCallback.
     */
    var pageInitializer = function (onSuccessCallback) {
        if (onSuccessCallback) {
            onSuccessCallback();
        }
    };

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

    that.setNavigationButton = function (newNavigationButtonLabel, newNavigationButtonCallback) {
        navigationButtonLabel = newNavigationButtonLabel;
        navigationButtonCallback = newNavigationButtonCallback;
    };

    that.getNavigationButtonLabel = function () {
        return navigationButtonLabel;
    };

    that.getNavigationButtonCallback = function () {
        return navigationButtonCallback;
    };

    that.setView = function (newView) {
        view = newView;
    };

    that.getView = function () {
        return view;
    };

    that.setPageInitializer = function (newPageInitializer) {
        pageInitializer = newPageInitializer;
    };

    that.initialize = function (onSuccessCallback) {
        pageInitializer(function () {
            that.getView().initializeView(onSuccessCallback);
        });
    };

    return that;
};
