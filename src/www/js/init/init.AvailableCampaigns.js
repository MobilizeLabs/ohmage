
Init.invokeOnReady( function () {

    if (CampaignsModel.getInstalledCampaignsCount() > 0 ) {
        mwf.decorator.TopButton("My Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
    }

    var onSuccess = function () {
        $("#view").append(CampaignsController.renderAvailableCampaigns());
    };

    var onError = function () {
        MessageDialogController.showMessage("Unable to download campaigns. Please try again later.");
    };

    CampaignsModel.download(false, onSuccess, onError);



});
