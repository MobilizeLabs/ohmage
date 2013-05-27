Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("surveyResponse", "Response View");
    pageModel.setTopButton("Upload Queue", function () {
        PageController.openQueue();
    });
    pageModel.setPageInitializer(function (onSuccessCallback) {
        var surveyResponseKey = PageController.getPageParameter('surveyResponseKey'),
            surveyResponseController = SurveyResponseController(surveyResponseKey);
        pageModel.setView(surveyResponseController.getView());
        onSuccessCallback();
    });

    PageController.registerPage(pageModel);

});

