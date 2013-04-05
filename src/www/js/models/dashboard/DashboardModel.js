/**
 * @author Zorayr Khalapyan
 * @version 4/4/13
 */
var DashboardModel = function () {
    "use strict";

    var that = {};

    /**
     * Stores a list of dashboard items. The key of the object is used in a
     * switch statement to open a page or do some action according to the user's
     * pressed item. The reason why these are stored in an object as opposed to
     * an array is that the labels may change i.e. instead of "Campaigns" have
     * "Tasks", but the page names have to remain the same.
     */
    var dashboardItems = {
        "Campaigns" : "Campaigns",
        "Surveys"   : "Surveys",
        "Queue"     : "Queue",
        "Profile"   : "Profile",
        "Help"      : "Help",
        "Reminders" : "Reminders"
    };

    /**
     * Returns an object representing the items displayed on the dashboard.
     * @returns {{Campaigns: string, Surveys: string, Queue: string, Profile: string, Help: string, Reminders: string}}
     */
    that.getDashboardItems = function () {
        return dashboardItems;
    };

    return that;
};