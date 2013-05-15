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

    /**
     * Returns a URN list that maps the campaigns according to alphabetical
     * order of their names.
     * @param campaignsMap The campaigns map to sort.
     * @returns {Array}
     */
    var sortCampaigns = function (campaignsMap) {
        var urnList = [],
            campaignURN;
        for (campaignURN in campaignsMap) {
            if (campaignsMap.hasOwnProperty(campaignURN)) {
                urnList.push(campaignURN);
            }
        }
        urnList.sort(function (a, b) {
            var nameA = campaignsMap[a].getName(),
                nameB = campaignsMap[b].getName();
            return nameA.localeCompare(nameB);
        });
        return urnList;
    };

    /**
     * Method encapsulates rendering campaigns in a menu.
     * @param campaignsMap Object that maps URN to CampaignModel.
     * @param menuTitle The title of the generated menu UI component.
     * @param onCampaignClickCallback The callback to be invoked when the
     *        campaign is clicked on. The first argument of the callback will
     *        be the URN of the clicked campaign.
     * @returns {MWFMenu}
     */
    that.renderCampaignsMenu = function (campaignsMap, menuTitle, onCampaignClickCallback) {
        var campaignsMenu = mwf.decorator.Menu(menuTitle),
            campaignModel,
            campaignMenuItem,
            campaignURN,
            i,
            sortedURNList = sortCampaigns(campaignsMap),
            campaignsLength = sortedURNList.length;

        for (i = 0; i < campaignsLength; i += 1) {
            campaignURN = sortedURNList[i];
            campaignModel = campaignsMap[campaignURN];

            //Ignore inactive campaigns.
            if (campaignModel.isRunning()) {
                campaignMenuItem = campaignsMenu.addMenuLinkItem(campaignModel.getName());
                TouchEnabledItemModel.bindTouchEvent(campaignMenuItem, campaignMenuItem, onCampaignClickCallbackClosure(onCampaignClickCallback, campaignURN), "menu-highlight");
            }

        }
        return campaignsMenu;
    };

    return that;
}());