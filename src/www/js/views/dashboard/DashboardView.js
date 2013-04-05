/**
 * @author Zorayr Khalapyan
 * @version 4/4/13
 */
var DashboardView = function (dashboardModel) {
    "use strict";
    var that = {};

    var getDashboardIcon = function (iconKey) {
        return 'img/dash/dash_' + iconKey.toLowerCase() + '.png';
    };

    var createDashboardMenu = function () {
        //var queueSize = SurveyResponseModel.getUploadQueueSize();
        //var queueLabel = "Queue (";// + queueSize + ")";

        var dashboardMenu = mwf.decorator.Menu();
        var dashboardItems = dashboardModel.getDashboardItems(), itemKey;
        for (itemKey in dashboardItems) {
            if (dashboardItems.hasOwnProperty(itemKey)) {
                dashboardMenu.addMenuImageItem(dashboardItems[itemKey], null, getDashboardIcon(itemKey));
            }
        }
        return dashboardMenu;
    };

    that.render = function () {
        var div = document.createElement('div');
        div.className = 'grid';
        div.appendChild(createDashboardMenu());
        return div;
    };

    return that;
};