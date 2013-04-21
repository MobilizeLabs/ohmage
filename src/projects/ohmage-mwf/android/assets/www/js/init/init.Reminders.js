Init.invokeOnReady(function () {
    "use strict";
    var pageModel = PageModel("reminders", "Available Reminders");
    pageModel.setTopButton("Dashboard", PageController.openDashboard);
    pageModel.setView(RemindersController.getView());
    PageController.registerPage(pageModel);

});