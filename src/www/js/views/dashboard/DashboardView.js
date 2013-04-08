/**
 * @author Zorayr Khalapyan
 * @version 4/4/13
 */
var DashboardView = function (dashboardModel) {
    "use strict";
    var that = AbstractView();

    var getDashboardIcon = function (iconKey) {
        return 'img/dash/dash_' + iconKey.toLowerCase() + '.png';
    };

    var onDashboardIconClickCallbackClosure = function (dashboardItemKey) {
        return function () {
            that.onDashboardIconClickCallback(dashboardItemKey);
        };
    };

    var createDashboardMenu = function () {
        //var queueSize = SurveyResponseModel.getUploadQueueSize();
        //var queueLabel = "Queue (";// + queueSize + ")";

        var dashboardMenu = mwf.decorator.Menu(),
            dashboardItems = dashboardModel.getDashboardItems(),
            dashboardItemKey,
            menuItem;
        for (dashboardItemKey in dashboardItems) {
            if (dashboardItems.hasOwnProperty(dashboardItemKey)) {
                menuItem = dashboardMenu.addMenuImageItem(dashboardItems[dashboardItemKey], null, getDashboardIcon(dashboardItemKey));
                TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onDashboardIconClickCallbackClosure(dashboardItemKey), "menu-highlight");
            }
        }
        return dashboardMenu;
    };

    that.onDashboardIconClickCallback = function (dashboardItemKey) {};

    that.render = function () {
        var div = document.createElement('div');
        div.className = 'grid';
        div.appendChild(createDashboardMenu());
        return div;
    };

    return that;
};