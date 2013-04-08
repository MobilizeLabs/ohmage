Init.invokeOnReady(function () {
    "use strict";

    var helpController = new HelpController();

    var pageModel = PageModel("helpSection", "Help Section");
    pageModel.setTopButton("Help Menu", PageController.openHelp);
    pageModel.setPageInitializer(function (onSuccessCallback) {
        var helpSectionIndex = PageController.getPageParameter('helpSectionIndex');
        if (helpSectionIndex !== null) {
            pageModel.setView(helpController.getHelpSectionView(helpSectionIndex));
            onSuccessCallback();
        } else {
            PageController.goBack();
        }
    });

    PageController.registerPage(pageModel);
});