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

    that.render = function () {
        mwf.decorator.TopButton(pageModel.getTopButtonName(), null, pageModel.getTopButtonCallback(), true);
        return pageModel.getView().render();
    };

    return that;
};