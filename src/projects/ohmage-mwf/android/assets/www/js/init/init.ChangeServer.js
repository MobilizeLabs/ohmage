Init.invokeOnReady(function () {
    "use strict";
    var pageModel = PageModel("changeServer", "Switch Server"),
        changeServerController = ChangeServerController();
    pageModel.setTopButton("Login", PageController.openAuth);
    pageModel.setView(changeServerController.getView());
    PageController.registerPage(pageModel);
});