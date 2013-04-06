/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.page.PageStackModel", {
    setup: function () {
        "use strict";
    },

    teardown: function () {
        "use strict";
        PageStackModel.clearPageStack();
    }
});


test("Test pushing in pages.", function () {
    "use strict";
    ///
    PageStackModel.push("pageName1", {});
    PageStackModel.push("pageName2", {});
    ///
    ok(PageStackModel.getStackSize() === 2, "There should be two pages in the stack after pushing two pages.");
    ok(PageStackModel.top().pageName === "pageName2", "The top page should be the last paged that was pushed.");
});

test("Test popping out pages.", function () {
    "use strict";
    PageStackModel.push("pageName1", {});
    PageStackModel.push("pageName2", {});
    ///
    var poppedPage = PageStackModel.pop();
    ///
    ok(PageStackModel.getStackSize() === 1, "There should be one page in the stack after pushing two pages and popping one page.");
    ok(poppedPage.pageName === "pageName2", "The popped page should be the last paged that was pushed.");
});

test("Test clearing page stack.", function () {
    "use strict";
    PageStackModel.push("pageName1", {});
    PageStackModel.push("pageName2", {});
    ///
    PageStackModel.clearPageStack();
    ///
    ok(PageStackModel.getStackSize() === 0, "There should be no pages in the stack after clearing the stack.");
});

test("Test setting page parameters.", function () {
    "use strict";
    PageStackModel.push("pageName1", {param1 : "value1"});
    PageStackModel.push("pageName2", {param2 : "value2"});
    ///
    var page2Params = PageStackModel.getCurrentPageParams();
    PageStackModel.pop();
    var page1Params = PageStackModel.getCurrentPageParams();
    ///
    console.log(page2Params);
    ok(page2Params.param2 === "value2", "The page parameters of the current page should be equal to the last pushed page's parameters.");
    ok(page1Params.param1 === "value1", "The page parameters of the popped page should be equal to the set page parameters.");
});