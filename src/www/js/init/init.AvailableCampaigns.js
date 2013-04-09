Init.invokeOnReady(function () {
    "use strict";


    var pageModel = PageModel("availableCampaigns", "Available Campaigns");

    pageModel.setView(CampaignsController.getAvailableCampaignsView());
    pageModel.setPageInitializer(function (onSuccessCallback) {

        if (CampaignsModel.getInstalledCampaignsCount() === 0) {
            pageModel.setTopButton("Dashboard", PageController.openDashboard);
        } else {
            pageModel.setTopButton("My Campaigns", PageController.openInstalledCampaigns);
        }

        var onDownloadSuccessCallback = function () {
            onSuccessCallback();
        };

        var onErrorCallback = function () {
            MessageDialogController.showMessage("Unable to download campaigns. Please try again later.");
            PageController.goToRootPage();
        };

        CampaignsMetadataService.download(false, onDownloadSuccessCallback, onErrorCallback);

    });

    PageController.registerPage(pageModel);

});
