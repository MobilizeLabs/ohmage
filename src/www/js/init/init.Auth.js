
Init.invokeOnReady(function () {
    "use strict";

    var pageModel = PageModel("auth", "Authentication Page");

    pageModel.setView(AuthenticationController.getView());

    if (AuthenticationModel.isUserAuthenticated()) {
        pageModel.setTopButton("Switch User", AuthenticationController.logoutUser);
    } else {
        pageModel.setTopButton("Switch Server", PageController.openServerChange);
    }

    PageController.registerPage(pageModel);
    PageController.goTo("auth");
});
