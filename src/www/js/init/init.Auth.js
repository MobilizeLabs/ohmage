
Init.invokeOnReady(function () {
    "use strict";

    /*
    if (auth.isUserLocked()) {

        //If the user is in a locked state, force the username field to
        //be read only.
        $("#username").val(auth.getUsername())
                      .attr('readonly', true);


        mwf.decorator.TopButton("Switch User", null, function () {
            if (auth.logout()) {

                $("#username").val("")
                              .attr('readonly', false);

                mwf.decorator.TopButton.remove();
            }
        }, true);
    } else {
        mwf.decorator.TopButton("Switch Server", null, PageNavigation.openServerChangeView, true);
    }
    */

    var pageModel = PageModel("auth", "Authentication Page");
    pageModel.setTopButton("Switch Server", function () {});
    pageModel.setView(AuthenticationController.getView());
    PageController.registerPage(pageModel);
    PageController.goTo("auth");
});
