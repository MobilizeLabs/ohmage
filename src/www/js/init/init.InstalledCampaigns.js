
Init.invokeOnReady(function () {

    mwf.decorator.TopButton("Add Campaign", null, PageNavigation.openAvailableCampaignsView, true);

    if (CampaignsModel.getInstalledCampaignsCount() > 0) {
        $('#view').append(CampaignsController.renderInstalledCampaigns());
        $("#view").append(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));
    } else {
        PageNavigation.openAvailableCampaignsView();
    }
});
