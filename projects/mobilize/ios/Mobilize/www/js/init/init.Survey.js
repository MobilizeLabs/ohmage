Init.invokeOnReady(function() {

    //Required for retreiving specific campaign configuration file.
    var campaignURN = PageNavigation.getPageParameter('campaign-urn');

    //Required for getting a specific survey from the campaign.
    var surveyID    = PageNavigation.getPageParameter('survey-id');
   
    //If a specific campaign is not specified, take the user to the
    //campaigns view where the user may be able to choose an appropriate
    //campaign.
    if( campaignURN === null || surveyID === null ) {
        
        PageNavigation.goBack();
        
    } else {

        PageNavigation.unsetPageParameter("survey-id");

        var campaign = new Campaign( campaignURN );
        var surveyModel = campaign.getSurvey( surveyID );
        
        var surveyController = SurveyController( surveyModel );

        var navigation = surveyController.start(document.getElementById('survey'));

        mwf.decorator.TopButton("All Surveys", null, function(){
            navigation.confirmSurveyExit(function() {
                PageNavigation.openCampaignView(campaignURN, surveyID);
            });
        }, true);

        $("#header-link").click(function() {
            navigation.confirmSurveyExit(function() {
                PageNavigation.openDashboard();
            });
        });
    }
});