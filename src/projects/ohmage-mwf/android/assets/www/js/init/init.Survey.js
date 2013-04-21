
//ToDo: "Data from your current survey response will be lost. Are you sure you would like to continue?";
Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("survey");
    pageModel.setPageInitializer(function (onSuccessCallback) {
        var campaignURN = PageController.getPageParameter('campaignURN'),
            surveyID = PageController.getPageParameter('surveyID'),
            surveyModel = CampaignsModel.getSurvey(campaignURN, surveyID),
            surveyController = SurveyController(surveyModel);
        pageModel.setPageTitle(surveyModel.getTitle());
        pageModel.setView(surveyController.getView());
        surveyController.initializeSurvey();
        pageModel.setTopButton("All Surveys", function () {
            PageController.goBack();
        });
        onSuccessCallback();
    });

    PageController.registerPage(pageModel);

});