Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("installedCampaigns", "My Campaigns");
    pageModel.setTopButton("Add Campaign", function () {
        PageController.openAvailableCampaigns();
    });

    pageModel.setNavigationButton("Dashboard", function () {
        PageController.openDashboard();
    });

    pageModel.setPageInitializer(function (onSuccessCallback) {
        if (CampaignsModel.getInstalledCampaignsCount() === 0) {
            PageController.replaceCurrentPage("availableCampaigns");
        } else {
            onSuccessCallback();
        }
    });

    pageModel.setView(CampaignsController.getInstalledCampaignsView());
    PageController.registerPage(pageModel);

});
