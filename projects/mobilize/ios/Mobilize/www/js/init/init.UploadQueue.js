Init.invokeOnReady(function() {
    var uploadQueueController = new UploadQueueController();
    document.getElementById('upload-queue-menu').appendChild(uploadQueueController.render());
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView, true);
});