
Init.invokeOnReady(function () {
    "use strict";
    var helpController = HelpController();

    var pageModel = PageModel("help", "Help Topics");
    pageModel.setTopButton("Dashboard", PageController.openDashboard);
    pageModel.setView(helpController.getHelpMenuView());
    PageController.registerPage(pageModel);


});