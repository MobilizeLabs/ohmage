Init.invokeOnReady(function () {
    "use strict";
    var pageModel = PageModel("privacy", "Privacy Policy");
    pageModel.setTopButton("Go Back", PageController.goBack);
    pageModel.setView(PrivacyView);
    PageController.registerPage(pageModel);
});