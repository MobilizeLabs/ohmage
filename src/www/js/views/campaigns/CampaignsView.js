
var CampaignsView = function (campaignsModel) {

    var that = {};

    /**
     * Callback for installing a new campaign.
     */
    var installNewCampaignHandlerCallback = function (campaignURN) {
        return function () {
            that.installNewCampaignHandler(campaignURN);
        };
    };

    /**
     * Callback for opening an already installed campaign.
     */
    var openMyCampaignHandlerCallback = function (campaignURN) {
        return function () {
            that.openMyCampaignHandler(campaignURN);
        };
    };

    that.installNewCampaignHandler = function (campaignURN) {};
    that.openMyCampaignHandler = function (campaignURN) {};
    that.refreshCampaignsListHandler = function () {};

    /**
     * Displays a list of installed campaigns.
     */
    that.renderMyCampaigns = function () {
        var myCampaignsMenu = mwf.decorator.Menu("My Campaigns"),
            installedCampaigns = campaignsModel.getInstalledCampaigns(),
            campaignModel, campaignMenuItem, campaignURN;
        for (campaignURN in installedCampaigns) {
            campaignModel = installedCampaigns[campaignURN];
            //Ignore inactive campaigns.
            if (campaignModel.isRunning()) {
                campaignMenuItem = myCampaignsMenu.addMenuLinkItem(campaignModel.getName());
                TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, openMyCampaignHandlerCallback(campaignURN), "menu-highlight");
            }
        }
        return myCampaignsMenu;
    };

    that.renderAvailableCampaigns = function () {
        var container = document.createElement("div"),
            availableCampaignsMenu = mwf.decorator.Menu("Available Campaigns"),
            availableCampaigns = campaignsModel.getAvailableCampaigns(),
            campaignModel,
            campaignMenuItem,
            campaignURN;
        for (campaignURN in availableCampaigns) {
            campaignModel = availableCampaigns[campaignURN];
            //Ignore inactive campaigns.
            if (campaignModel.isRunning()) {
                campaignMenuItem = availableCampaignsMenu.addMenuLinkItem(campaignModel.getName());
                TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, installNewCampaignHandlerCallback(campaignURN), "menu-highlight");
            }
        }
        $(availableCampaignsMenu).find("a").css('background', "url('img/plus.png') no-repeat 95% center");
        container.appendChild(availableCampaignsMenu);
        container.appendChild(mwf.decorator.SingleClickButton("Refresh Campaigns", that.refreshCampaignsListHandler));
        return container;
    };

    return that;
};