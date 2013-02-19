Init.invokeOnReady(function() {

    console.log("init.InsalledCampaigns: Initializing.");
    
    var onSuccess = function(){
        $('#campaigns').append(Campaigns.render(true));
    };

    var onError = function(){
        MessageDialogController.showMessage("Unable to download campaigns. Please try again later.")
    }

    Campaigns.download(false, onSuccess, onError);

});
