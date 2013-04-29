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

    dashboardView.onDashboardIconClickCallback = function (dashboardItemKey) {

        if (dashboardItemKey === "campaigns") {

            if (CampaignsModel.getInstalledCampaignsCount() === 0) {
                PageController.openAvailableCampaigns();
            } else {
                PageController.openInstalledCampaigns();
            }

        //Since the keys we used to index the dashboard buttons correspond to
        //to the actual page names, in most cases, we don't have to do any conversion.
        } else {
            PageController.goTo(dashboardItemKey);
        }


    };

    that.getView = function () {
        return dashboardView;
    };

    return that;
};
