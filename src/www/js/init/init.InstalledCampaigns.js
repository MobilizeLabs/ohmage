Init.invokeOnReady(function () {

    mwf.decorator.TopButton("Add Campaign", null, PageNavigation.openAvailableCampaignsView, true);

    var onSuccess = function () {
        $('#view').append(CampaignsController.renderInstalledCampaigns());
        $("#view").append(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));
    };

    var onError = function () {
        MessageDialogController.showMessage("Unable to download campaigns. Please try again later.")
    };

    CampaignsModel.download(false, onSuccess, onError);

});
