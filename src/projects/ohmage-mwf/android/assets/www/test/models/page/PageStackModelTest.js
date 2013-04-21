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
        PageStackModel.clearPageStack();
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
    strictEqual(PageStackModel.getStackSize(), 2, "There should be two pages in the stack after pushing two pages.");
    strictEqual(PageStackModel.top().pageName, "pageName2", "The top page should be the last paged that was pushed.");
});

test("Test popping out pages.", function () {
    "use strict";
    PageStackModel.push("pageName1", {});
    PageStackModel.push("pageName2", {});
    ///
    var poppedPage = PageStackModel.pop();
    ///
    strictEqual(PageStackModel.getStackSize(), 1, "There should be one page in the stack after pushing two pages and popping one page.");
    strictEqual(poppedPage.pageName, "pageName2", "The popped page should be the last paged that was pushed.");
});

test("Test clearing page stack.", function () {
    "use strict";
    PageStackModel.push("pageName1", {});
    PageStackModel.push("pageName2", {});
    ///
    PageStackModel.clearPageStack();
    ///
    strictEqual(PageStackModel.getStackSize(), 0, "There should be no pages in the stack after clearing the stack.");
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
    strictEqual(page2Params.param2, "value2", "The page parameters of the current page should be equal to the last pushed page's parameters.");
    strictEqual(page1Params.param1, "value1", "The page parameters of the popped page should be equal to the set page parameters.");
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
    strictEqual(page2Params.param2, "value2", "The page parameters of the current page should be equal to the last pushed page's parameters.");
    strictEqual(page1Params.param1, "value1", "The page parameters of the popped page should be equal to the set page parameters.");
});

test("Test detecting if a page stack is empty.", function () {
    "use strict";
    ///
    var isEmpty = PageStackModel.isEmpty();
    ///
    ok(isEmpty, "The page stack should be empty when there are no pages in the stack.");
});

test("Test detecting if a page stack is empty when there is actually a page in the stack.", function () {
    "use strict";
    PageStackModel.push("pageName1", {param1 : "value1"});
    ///
    var isEmpty = PageStackModel.isEmpty();
    ///
    ok(!isEmpty, "The page stack should not be empty when there are is a page in the stack.");
});

test("Test replacing current page", function () {
    "use strict";
    PageStackModel.push("pageName1", {param1 : "value1"});
    ///
    PageStackModel.replaceCurrentPage("pageName2");
    ///
    strictEqual(PageStackModel.top().pageName, "pageName2", "The top page should be replaced.");
});