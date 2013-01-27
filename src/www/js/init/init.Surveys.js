    
Init.invokeOnReady(function() {
    $("#view").append(SurveysController.renderSurveyList());
    $("#view").append(mwf.decorator.SingleClickButton("Upload Queue", PageNavigation.openUploadQueueView));
    mwf.decorator.TopButton("All Campaigns", null, PageNavigation.openInstalledCampaignsView , true);

});
