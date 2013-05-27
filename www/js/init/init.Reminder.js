Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("reminder", "Reminder Settings");
    pageModel.setTopButton("Dashboard", PageController.openDashboard);
    pageModel.setPageInitializer(function (onSuccessCallback) {
        var reminderModelUUID = PageController.getPageParameter('reminderModelUUID');
        pageModel.setView(ReminderController(reminderModelUUID).getView());
        onSuccessCallback();
    });
    PageController.registerPage(pageModel);

});