
Init.invokeOnReady(function() {
    var surveyKey = PageNavigation.getPageParameter('survey-key');
    if(surveyKey === null){ PageNavigation.goBack(); }
    var surveyResponse = SurveyResponseModel.restoreSurveyResponse(surveyKey);
    var surveyResponseController = new SurveyResponseController(surveyResponse);
    document.getElementById("survey-response-view").appendChild(surveyResponseController.render());
    mwf.decorator.TopButton("Upload Queue", null, PageNavigation.openUploadQueueView, true);
});