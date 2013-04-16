Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("reminder");
    pageModel.setTopButton("Dashboard", PageController.openDashboard);
    pageModel.setPageInitializer(function (onSuccessCallback) {
        var reminderModelUUID = PageController.getPageParameter('reminderModelUUID');
        pageModel.setView(ReminderController(reminderModelUUID).getView());
        onSuccessCallback();
    });
    PageController.registerPage(pageModel);

});