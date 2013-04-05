Init.invokeOnReady(function () {
    "use strict";




    var helpController = new HelpController();

    var pageModel = PageModel("helpSection", "Help Section");
    pageModel.setTopButton("Help Menu", PageController.openHelp);
    pageModel.setPageInitializer(function () {
        var helpSectionIndex = PageController.getPageParameter('helpSectionIndex');

        if (helpSectionIndex !== null) {
            pageModel.setView(helpController.getHelpSectionView(helpSectionIndex));
        } else {
            PageController.goBack();
        }
    });

    PageController.registerPage(pageModel);
});