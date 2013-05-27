 
 Init.invokeOnReady( function() {
     var campaignURN = PageNavigation.getPageParameter('campaign-urn');

     //If a specific campaign is not specified, take the user to the
     //campaigns view where the user may be able to choose an appropriate
     //campaign.
     if(campaignURN === null){
         PageNavigation.goBack();
     }

     var campaign = new Campaign(campaignURN);

     document.getElementById('surveys').appendChild(campaign.render());
     
     document.getElementById('surveys').appendChild(mwf.decorator.SingleClickButton("Delete Campaign", function(){
         
         var deleteCampaignConfirmationCallback = function(yes){
             if(yes){
                 Campaigns.uninstallCampaign(campaignURN);
                 PageNavigation.goBack();
             }
         };
         
         var message = "All data will be lost. Are you sure you would like to proceed?";
         MessageDialogController.showConfirm(message, deleteCampaignConfirmationCallback, "Yes,No");
         
     }));
     
     mwf.decorator.TopButton("My Campaigns", null, PageNavigation.openInstalledCampaignsView, true);

 });
