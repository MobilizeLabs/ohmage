/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 * @constructor
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
