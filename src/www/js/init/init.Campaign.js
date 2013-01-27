
 Init.invokeOnReady( function () {

     var campaignURN = PageNavigation.getPageParameter('campaign-urn');

     //If a specific campaign is not specified, take the user to the
     //campaigns view where the user may be able to choose an appropriate
     //campaign.
     if (campaignURN === null) {
         PageNavigation.goBack();
     }

     var campaignModel = CampaignModel(campaignURN);

     document.getElementById('view').appendChild(CampaignController(campaignModel).renderCampaignView());

     mwf.decorator.TopButton("My Campaigns", null, PageNavigation.openInstalledCampaignsView, true);

 });
