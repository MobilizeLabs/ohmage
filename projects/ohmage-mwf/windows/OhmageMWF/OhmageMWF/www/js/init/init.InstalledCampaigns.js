invokeOnReady(function(){

    var onSuccess = function(){
        $('#campaigns').append(Campaigns.render(true));
    };

    var onError = function(){
        showMessage("Unable to download campaigns. Please try again later.")
    }

    Campaigns.download(false, onSuccess, onError);

});
