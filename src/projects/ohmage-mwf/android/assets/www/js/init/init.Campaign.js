Init.invokeOnReady(function () {
    "use strict";

    var helpController = new HelpController();

    var pageModel = PageModel("campaign");

    pageModel.setTopButton("My Campaigns", PageController.openInstalledCampaigns);
    pageModel.setPageInitializer(function (onSuccessCallback) {
        var campaignURN = PageController.getPageParameter('campaignURN'),
            campaignModel = CampaignsModel.getCampaign(campaignURN);
        pageModel.setPageTitle(campaignModel.getName());
        pageModel.setView(CampaignController(campaignModel).getCampaignView());
        onSuccessCallback();
    });

    PageController.registerPage(pageModel);
});