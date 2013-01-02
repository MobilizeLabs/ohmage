var CampaignView = function ( campaignModel ) {
    
    var that = {};
    
    that.render = function () {

        if (campaignModel.isRunning()) {
            return that.renderSurveyList(mwf.decorator.Menu("Available Surveys"));

        } else {

            var errorContainer = mwf.decorator.Content('Inactive Campaign');
            errorContainer.addTextBlock('This campaign is currently inactive and does not open for participation.');
            return errorContainer;

        }

    };

    that.renderSurveyList = function (surveyMenu) {
        var openSurveyViewCallback = function(surveyID){
            return function(){
                PageNavigation.openSurveyView(urn, surveyID);
            };
        };
        var surveys = that.getSurveys();
        var surveyMenuItem;
        for (var i = 0; i < surveys.length; i++) {
            surveyMenuItem = surveyMenu.addMenuLinkItem(surveys[i].title, null, surveys[i].description);
            TouchEnabledItemModel.bindTouchEvent(surveyMenuItem, surveyMenuItem, openSurveyViewCallback(surveys[i].id), "menu-highlight");
        }
        return surveyMenu;
    };
    
    return that;
};