Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("installedCampaigns", "My Campaigns");
    pageModel.setTopButton("Add Campaign", PageController.openAvailableCampaigns);
    pageModel.setView(CampaignsController.getInstalledCampaignsView());
    PageController.registerPage(pageModel);

});
