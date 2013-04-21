
var InstalledCampaignsView = function () {
    "use strict";
    var that = AbstractView();

    that.openMyCampaignHandler = function (campaignURN) {};

    that.render = function () {
        var campaigns = CampaignsModel.getInstalledCampaigns(),
            campaignsMenu = CampaignsMenuView.renderCampaignsMenu(campaigns, "My Campaigns", that.openMyCampaignHandler);
        return campaignsMenu;
    };

    return that;
};

