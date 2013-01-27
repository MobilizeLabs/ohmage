
var SurveysController = (function () {
    var that = {};
    return that;
}());

/**
 *
 */
SurveysController.renderSurveyList = function () {
    var campaigns = CampaignsModel.getInstalledCampaigns(),
        surveyMenu = mwf.decorator.Menu("Available Surveys"),
        campaignURN,
        noAvailableSurveysMenuItem;
    for (campaignURN in campaigns) {
        if (campaigns[campaignURN].isRunning()) {
            CampaignView.renderSurveyList(campaigns[campaignURN], surveyMenu, CampaignController.openSurveyViewHandler);
        }
    }
    if (surveyMenu.size() === 0) {
        noAvailableSurveysMenuItem = surveyMenu.addMenuLinkItem("No Available Surveys", null, "Please install a campaign, to view available surveys.");
        TouchEnabledItemModel.bindTouchEvent(noAvailableSurveysMenuItem, noAvailableSurveysMenuItem, PageNavigation.openAvailableCampaignsView, "menu-highlight");
    }
    return surveyMenu;
};