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

CampaignView.renderSurveyList = function (campaignModel, surveyMenu, onSurveyClickCallback) {
    "use strict";
    var surveys = campaignModel.getSurveys(),
        surveyMenuItem,
        surveyID,
        survey,
        openSurveyViewCallback = function (surveyID) {
            return function () {
                onSurveyClickCallback(campaignModel.getURN(), surveyID);
            };
        };

    for (surveyID in surveys) {
        if (surveys.hasOwnProperty(surveyID)) {
            survey = surveys[surveyID];
            surveyMenuItem = surveyMenu.addMenuLinkItem(survey.getTitle(), null, survey.getDescription());
            TouchEnabledItemModel.bindTouchEvent(surveyMenuItem, surveyMenuItem, openSurveyViewCallback(survey.getID()), "menu-highlight");
        }
    }
    return surveyMenu;
};