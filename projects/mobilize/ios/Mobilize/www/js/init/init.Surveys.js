Init.invokeOnReady(function() {

    var surveyMenu = mwf.decorator.Menu("Available Surveys");

    var campaigns = Campaigns.getInstalledCampaigns();

    for(var i = 0; i < campaigns.length; i++){
        if(campaigns[i].isRunning()){
            campaigns[i].renderSurveyList(surveyMenu);    
        }
    }

    if(surveyMenu.size() == 0){
        var noAvailableSurveysMenuItem = surveyMenu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to view available surveys.");
        TouchEnabledItemModel.bindTouchEvent(noAvailableSurveysMenuItem, noAvailableSurveysMenuItem, PageNavigation.openAvailableCampaignsView, "menu-highlight");
    }

    $("#surveys").append(surveyMenu);
    $("#surveys").append(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));

    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView , true);

});
