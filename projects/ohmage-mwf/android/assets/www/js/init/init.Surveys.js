
Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("surveys", "Available Surveys");

    pageModel.setPageInitializer(function (onSuccessCallback) {

        pageModel.setView(SurveysController.getView());

        pageModel.setTopButton("Dashboard", function () {
            PageController.openDashboard();
        });

        pageModel.setNavigationButton("Campaigns", function () {
            PageController.openInstalledCampaigns();
        });

        onSuccessCallback();
    });

    PageController.registerPage(pageModel);

});
