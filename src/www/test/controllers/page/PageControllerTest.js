/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

if (!fixture) {
    var fixture = {};
}

module("controllers.page.PageController", {
    setup: function () {
        "use strict";

        fixture.setPageController = function () {
            var pageModel = PageModel("PageName", "pageTitle");
            var rootPageModel = PageModel("RootPageName", "Root Page Title");
            PageController.registerPage(pageModel);
            PageController.registerPage(rootPageModel);
            PageController.setRootPageModel(rootPageModel);
            PageController.render = mockFunction();
        };
    },

    teardown: function () {
        "use strict";
        delete fixture.mockedScreen;
        PageController.unregisterAllPages();
        PageController.setScreen(null);
    }
});

test("Test Page Registration.", function () {
    "use strict";
    var pageModel = PageModel("PageName", "pageTitle");
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

test("Test tracking the root page model.", function () {
    "use strict";
    var pageModel = PageModel("PageName", "pageTitle");
    var rootPageModel = PageModel("RootPageName", "Root Page Title");
    PageController.registerPage(pageModel);
    PageController.registerPage(rootPageModel);
    ///
    PageController.setRootPageModel(rootPageModel);
    ///
    ok(PageController.isRootPage(rootPageModel), "Root page model should be recognized");
});

test("Test visiting unregistered page.", function () {
    "use strict";
    fixture.setPageController();
    ///
    var goToResult = PageController.goTo("UnknownPageName");
    ///
    ok(!goToResult, "The user should not be able to visit an unregistered page");
});

test("Test visiting a registered page.", function () {
    "use strict";
    fixture.setPageController();
    ///
    var goToResult = PageController.goTo("PageName");
    ///
    ok(goToResult, "The user should be able to visit a registered page");
});

test("Test tracking the current page.", function () {
    "use strict";
    fixture.setPageController();
    PageController.goTo("PageName");
    ///
    var currentPageName = PageController.getCurrentPageName();
    ///
    ok(currentPageName === "PageName", "Current page should be the last page that the user visited.");
    ok(PageStackModel.getStackSize() === 1, "After visiting a single page, there should only be one page in the page stack.");
});

test("Test visiting the root page.", function () {
    "use strict";
    fixture.setPageController();
    PageController.goTo("PageName");
    ///
    var goToRootPageResult = PageController.goTo("RootPageName");
    ///
    ok(goToRootPageResult, "The user should be able to visit the root page");
    ok(PageStackModel.getStackSize() === 1, "After visiting the root page, there should only be one page in the page stack.");
});

test("Test visiting two pages.", function () {
    "use strict";
    fixture.setPageController();
    ///
    PageController.goTo("RootPageName");
    PageController.goTo("PageName");
    ///
    ok(PageController.getCurrentPageName() === "PageName", "Current page should be the last page that the user visited.");
    ok(PageStackModel.getStackSize() === 2, "After visiting two pages, there should be two pages in the page stack.");
});

test("Test visiting two pages and going back.", function () {
    "use strict";
    fixture.setPageController();
    PageController.goTo("RootPageName");
    PageController.goTo("PageName");
    ///
    PageController.goBack();
    ///
    ok(PageController.getCurrentPageName() === "RootPageName", "Current page should be the page that the user went back to.");
    ok(PageStackModel.getStackSize() === 1, "After visiting two pages and going back, there should be only one page in the page stack.");
});

test("Test page parameters.", function () {
    "use strict";
    fixture.setPageController();
    PageController.goTo("RootPageName");
    ///
    PageController.goTo("PageName", {param : "value"});
    ///
    var pageParams = PageStackModel.getCurrentPageParams();
    ok(pageParams.param === "value", "The current page should have the same page parameters as was set.");
});

test("Test page parameters with dynamically created open page function.", function () {
    "use strict";
    fixture.setPageController();
    PageController.goTo("RootPageName");
    ///
    PageController.openPageName({param : "value"});
    ///
    var pageParams = PageStackModel.getCurrentPageParams();
    ok(pageParams.param === "value", "The current page should have the same page parameters as was set.");
});

test("Test page parameters after going back.", function () {
    "use strict";
    fixture.setPageController();
    ///
    PageController.goTo("RootPageName", {rootParam : "rootParamValue"});
    PageController.goTo("PageName", {param : "value"});
    PageController.goBack();
    ///
    var pageParams = PageStackModel.getCurrentPageParams();
    ok(pageParams.rootParam === "rootParamValue", "The current page should have the same page parameters as was set.");
});

test("Test getting a page parameter by name.", function () {
    "use strict";
    fixture.setPageController();
    PageController.goTo("RootPageName", {rootParam : "rootParamValue"});
    PageController.goTo("PageName", {param : "value"});
    ///
    var pageParamName = PageController.getPageParameter("param");
    ///
    ok(pageParamName === "value", "The parameter fetched by name should be equal to the parameter's set value.");
});

test("Test getting a page parameter by a wrong name.", function () {
    "use strict";
    fixture.setPageController();
    PageController.goTo("RootPageName", {rootParam : "rootParamValue"});
    PageController.goTo("PageName", {param : "value"});
    ///
    var pageParamName = PageController.getPageParameter("WRONG_PARAM_NAME");
    ///
    ok(pageParamName === null, "The value returned should be null if the parameter name is wrong.");
});