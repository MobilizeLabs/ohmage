Init.invokeOnReady(function () {
    "use strict";
    var uploadQueueController = UploadQueueController(),
        pageModel = PageModel("queue", "Upload Queue");
    pageModel.setTopButton("Dashboard", PageController.openDashboard);
    pageModel.setView(uploadQueueController.getView());
    PageController.registerPage(pageModel);
});