
Init.invokeOnReady(function () {
    "use strict";

    var pendingSurveysController = PendingSurveysController();

    var pageModel = PageModel("pendingSurveys", "Pending Surveys");
    pageModel.setPageInitializer(function (onSuccessCallback) {
        pageModel.setTopButton("Dashboard", PageController.openDashboard);
        pageModel.setView(pendingSurveysController.getView());
        onSuccessCallback();
    });

    PageController.registerPage(pageModel);

});