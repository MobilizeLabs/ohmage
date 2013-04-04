/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */


module("controllers.page.PageController", {
    setup: function () {
        "use strict";
    },

    teardown: function () {
        "use strict";
        PageController.unregisterAllPages();
    }
});

test("Test Page Registration.", function () {
    "use strict";
    var pageModel = PageModel("PageName", "pageTitle");
    console.log(PageController);
    ///
    PageController.registerPage(pageModel);
    ///
    ok(PageController.isPageRegistered("PageName"), "Page name should be recognized as registered.");
    ok(PageController.getPageModel("PageName") === pageModel, "The registered page model should equal to the page model created.");
    ok(PageController.openPageName !== undefined, "A function should be created with the registered page's name.");
});

test("Test Page Unregistration.", function () {
    "use strict";
    var pageModel = PageModel("PageName", "pageTitle");
    PageController.registerPage(pageModel);
    ///
    PageController.unregisterPage(pageModel);
    ///
    ok(!PageController.isPageRegistered("PageName"), "Page name should not be recognized as registered.");
    ok(PageController.getPageModel("PageName") === null, "The unregistered page model should be null.");
    ok(PageController.openPageName === undefined, "Unregistered page should not have an associated open function.");

});