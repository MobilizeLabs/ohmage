/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */

var CampaignsMenuView = (function () {
    "use strict";
    var that = AbstractView();


    var onCampaignClickCallbackClosure = function (onCampaignClickCallback, clickedCampaignURN) {
        return function () {
            onCampaignClickCallback(clickedCampaignURN);
        };
    };

    that.renderCampaignsMenu = function (campaigns, menuTitle, onCampaignClickCallback) {
        var campaignsMenu = mwf.decorator.Menu(menuTitle),
            campaignModel,
            campaignMenuItem,
            campaignURN;

        for (campaignURN in campaigns) {
            if (campaigns.hasOwnProperty(campaignURN)) {
                campaignModel = campaigns[campaignURN];

                //Ignore inactive campaigns.
                if (campaignModel.isRunning()) {
                    campaignMenuItem = campaignsMenu.addMenuLinkItem(campaignModel.getName());
                    TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, onCampaignClickCallbackClosure(onCampaignClickCallback, campaignURN), "menu-highlight");
                }
            }

        }
        return campaignsMenu;
    };

    return that;
}());