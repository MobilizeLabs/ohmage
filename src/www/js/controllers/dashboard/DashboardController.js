/**
 * DashboardController is responsible for handling icon presses in the
 * dashboard.
 *
 * @author Zorayr Khalapyan
 * @version 4/4/13
 */
var DashboardController = function (dashboardModel) {
    "use strict";

    var that = {};

    var dashboardView = DashboardView(dashboardModel);

    dashboardView.onDashboardIconPressCallback = function (dashboardItemKey) {
        //Since the keys we used to index the dashboard buttons correspond to
        //to the actual page names, we don't have to do any conversion.
        PageController.goTo(dashboardItemKey);
    };

    that.getView = function () {
        return dashboardView;
    };

    return that;
};
