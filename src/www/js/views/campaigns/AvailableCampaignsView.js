/**
 * Created with JetBrains WebStorm.
 * User: root
 * Date: 4/9/13
 * Time: 5:25 AM
 * To change this template use File | Settings | File Templates.
 */

var AvailableCampaignsView = function () {
    "use strict";
    var that = AbstractView();

    that.installNewCampaignHandler = function (campaignURN) {};
    that.refreshCampaignsListHandler = function () {};

    that.render = function () {
        var campaigns = CampaignsModel.getAvailableCampaigns(),
            campaignsMenu = CampaignsMenuView.renderCampaignsMenu(campaigns, "Available Campaigns", that.installNewCampaignHandler),
            container = document.createElement('div');

        //Switch the menu item arrow signs to plus signs.
        $(campaignsMenu).find("a").css('background', "url('img/plus.png') no-repeat 95% center");

        container.appendChild(campaignsMenu);
        container.appendChild(mwf.decorator.SingleClickButton("Refresh Campaigns", that.refreshCampaignsListHandler));

        return container;
    };

    return that;
};
