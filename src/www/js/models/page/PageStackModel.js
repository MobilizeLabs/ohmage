/**
 * @author Zorayr Khalapyan
 * @version 4/4/13
 */
var PageStackModel = (function () {
    "use strict";

    var that = {};

    /**
     * The object stores a stack of visited pages and can be used to navigated
     * backwards. The top page of the stack is the current page.
     */
    var pageStack = [];

    var save = function () {

    };

    var restore = function () {

    };

    var constructPageObject = function (pageName, pageParams) {
        pageParams = pageParams || {};
        return {pageName : pageName, pageParams : pageParams};
    };

    /**
     * Returns the page parameters of the last visited page (top page). If the
     * current stack is empty, an empty object will be returned.
     * @returns {*} Page paramters of the last page.
     */
    that.getCurrentPageParams = function () {
        return pageStack.length > 0 ? pageStack[pageStack.length - 1].pageParams : {};
    };

    /**
     * Returns the page object at the top of the stack. This method does not
     * modify the stack.
     * @returns {{pageName : string, pageParams : object}}
     */
    that.top = function () {
        return (pageStack.length > 0) ? pageStack[pageStack.length - 1] : false;
    };

    /**
     * Pushes the provided page information on the top of the stack.
     * @param pageName
     * @param pageParams
     */
    that.push = function (pageName, pageParams) {
        pageStack.push(constructPageObject(pageName, pageParams));
    };

    /**
     * Removes the top element on the stack and returns this object.
     * @returns {{pageName : string, pageParams : object}}
     */
    that.pop = function () {
        return pageStack.pop();
    };

    that.clearPageStack = function () {
        pageStack = [];
    };

    that.getStackSize = function () {
        return pageStack.length;
    };

    that.setPageStack = function (newPageStack) {
        pageStack = newPageStack;
    };

    that.getPageStack = function () {
        return pageStack;
    };

    return that;
}());