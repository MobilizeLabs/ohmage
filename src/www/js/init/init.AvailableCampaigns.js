Init.invokeOnReady(function () {
    "use strict";
    /*
    var onSuccess = function(){
        $('#campaigns').append(Campaigns.render(false));
    };

    var onError = function(){
        MessageDialogController.showMessage("Unable to download campaigns. Please try again later.")
    };

    Campaigns.download(false, onSuccess, onError);
    */


    var pageModel = PageModel("availableCampaigns", "Available Campaigns");

    pageModel.setView(CampaignsController.getAvailableCampaignsView());
    pageModel.setPageInitializer(function (onSuccessCallback) {
        if (CampaignsModel.getInstalledCampaignsCount() === 0) {
            pageModel.setTopButton("Dashboard", PageController.openDashboard);
        } else {
            pageModel.setTopButton("My Campaigns", PageController.openInstalledCampaigns);
        }
        onSuccessCallback();
    });

    PageController.registerPage(pageModel);

});
