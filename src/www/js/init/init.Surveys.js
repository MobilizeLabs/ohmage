Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("surveys", "Available Surveys");

    pageModel.setTopButton("Dashboard", function () {
        PageController.openDashboard();
    });

    pageModel.setNavigationButton("Campaigns", function () {
        PageController.openInstalledCampaigns();
    });

    pageModel.setView(SurveysController.getView());
    PageController.registerPage(pageModel);

});
