
var PendingSurveysController = function () {
    "use strict";
    var that = {};

    var onSurveyClickCallback = function (surveyModel) {
        PageController.openSurvey({
            campaignURN : surveyModel.getCampaign().getURN(),
            surveyID : surveyModel.getID()
        });
    };

    that.getView = function () {
        var pendingSurveys = RemindersModel.getPendingSurveys(),
            pendingSurveysView = PendingSurveysView(pendingSurveys);
        pendingSurveysView.onSurveyClickCallback = onSurveyClickCallback;
        return pendingSurveysView;
    };

    return that;

};