
Init.invokeOnReady(function () {
    "use strict";
    var pageModel = PageModel("auth", "Authentication Page");
    pageModel.setView(AuthenticationController.getView());
    pageModel.setPageInitializer(function (onSuccessCallback) {
        if (AuthenticationModel.isUserAuthenticated()) {
            pageModel.setTopButton("Switch User", AuthenticationController.logoutUser);
        } else {
            pageModel.setTopButton("Switch Server", PageController.openServerChange);
        }
        onSuccessCallback();
    });
    PageController.registerPage(pageModel);
});
