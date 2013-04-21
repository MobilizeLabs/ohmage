/**
 * @author Zorayr Khalapyan
 * @version 4/15/13
 */

var SurveysController = (function () {
    "use strict";
    var that = {};

    var onSurveyClickCallback = function (surveyModel) {
        PageController.openSurvey({campaignURN : surveyModel.getCampaign().getURN(), surveyID : surveyModel.getID()});
    };

    that.getView = function () {
        var surveyListView = SurveyListView("Available Surveys");
        surveyListView.onSurveyClickCallback = onSurveyClickCallback;
        return surveyListView;
    };

    return that;
}());