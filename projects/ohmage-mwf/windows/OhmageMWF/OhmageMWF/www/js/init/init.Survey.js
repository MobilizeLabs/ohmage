invokeOnReady(function(){

    //Required for retreiving specific campaign configuration file.
    var campaignURN = PageNavigation.getPageParameter('campaign-urn');
    
    //Required for getting a specific survey from the campaign.
    var surveyID    = PageNavigation.getPageParameter('survey-id');
    
    console.log((surveyID === null) + " " + (campaignURN === null));
    
    //If a specific campaign is not specified, take the user to the
    //campaigns view where the user may be able to choose an appropriate
    //campaign.
    if(campaignURN === null || surveyID === null){
        PageNavigation.goBack();
    }else{
        
        PageNavigation.unsetPageParameter("survey-id");
        
        var campaign = new Campaign(campaignURN);
        var survey = campaign.getSurvey(surveyID);

        var navigation = survey.start(document.getElementById('survey'));

        mwf.decorator.TopButton("All Surveys", null, function(){
            navigation.confirmSurveyExit(function(){
                PageNavigation.openCampaignView(campaignURN, surveyID);
            }); 
        }, true);

        $("#header-link").click(function(e){
            navigation.confirmSurveyExit(function(){
                PageNavigation.openDashboard();
            }); 
        });
    }
});