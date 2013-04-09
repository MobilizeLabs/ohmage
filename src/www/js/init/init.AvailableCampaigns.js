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
    pageModel.setTopButton("Dashboard", PageController.openDashboard);
    pageModel.setView(CampaignsController.getAvailableCampaignsView());
    PageController.registerPage(pageModel);

});
