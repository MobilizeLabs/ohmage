Init.invokeOnReady(function () {
    "use strict";

    var profileController = ProfileController();

    var pageModel = PageModel("profile", "User Profile");
    pageModel.setTopButton("Dashboard", PageController.openDashboard);
    pageModel.setView(profileController.getView());
    PageController.registerPage(pageModel);

});