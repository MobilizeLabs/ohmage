
Init.invokeOnReady(function () {
    "use strict";
    var pageModel = PageModel("changePassword", "Change Password");
    pageModel.setView(ChangePasswordController.getView());
    PageController.registerPage(pageModel);
});
