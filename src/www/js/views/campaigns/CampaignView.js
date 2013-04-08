/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */

var CampaignView = function (campaignModel) {
    "use strict";

    var that = AbstractView();

    that.deleteCampaignHandler = function () {};
    that.openSurveyViewHandler = function () {};
    that.render = function () {
        var container = document.createElement('div');
        if (campaignModel.isRunning()) {
            container.appendChild(CampaignView.renderSurveyList(campaignModel, mwf.decorator.Menu("Available Surveys"), that.openSurveyViewHandler));
        } else {
            var errorContainer = mwf.decorator.Content('Inactive Campaign');
            errorContainer.addTextBlock('This campaign is currently inactive and does not open for participation.');
            container.appendChild(errorContainer);
        }
        container.appendChild(mwf.decorator.SingleClickButton("Delete Campaign", that.deleteCampaignHandler));
        return container;
    };
    return that;
};

CampaignView.renderSurveyList = function (campaignModel, surveyMenu, callback) {
    "use strict";
    var openSurveyViewCallback = function (surveyID) {
        return function () {
            callback(campaignModel.getURN(), surveyID);
        };
    };
    var surveys = campaignModel.getSurveys(),
        surveyMenuItem,
        numSurveys = surveys.length,
        i;
    for (i = 0; i < numSurveys; i += 1) {
        surveyMenuItem = surveyMenu.addMenuLinkItem(surveys[i].title, null, surveys[i].description);
        TouchEnabledItemModel.bindTouchEvent(surveyMenuItem, surveyMenuItem, openSurveyViewCallback(surveys[i].id), "menu-highlight");
    }
    return surveyMenu;
};