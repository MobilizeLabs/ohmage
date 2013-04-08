Init.invokeOnReady(function () {
    "use strict";

    var dashboardController = DashboardController(DashboardModel());

    var pageModel = PageModel("dashboard", "Dashboard");
    pageModel.setTopButton("Logout", AuthenticationController.logoutUser);
    pageModel.setView(dashboardController.getView());
    PageController.registerPage(pageModel);
    PageController.setRootPageModel(pageModel);
    //PageController.goToRootPage();

});
