/**
 * @author Zorayr Khalapyan
 * @version 4/3/13
 */

var PageView = function (pageModel) {
    "use strict";
    var that = {};

    /**
     * DOM fragments for storing the header, the main view, and the footer of
     * the current page.
     */
    var header, view, footer;

    var headerTitle = document.getElementById("header-title");
    var homeLink = document.getElementById("header-home-icon");
    var privacyLink = document.getElementById("footer-privacy-link");

    that.render = function () {
        mwf.decorator.TopButton(pageModel.getTopButtonName(), null, pageModel.getTopButtonCallback(), true);
        headerTitle.innerHTML = pageModel.getPageTitle();
        homeLink.onclick = PageController.goToRootPage;
        privacyLink.onclick = function () {
            PageController.openPrivacy();
        };
        return pageModel.getView().render();
    };

    return that;
};