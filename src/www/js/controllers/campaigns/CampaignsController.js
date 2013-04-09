/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */

var CampaignsController = (function () {
    "use strict";
    var that = {};

    /**
     * On success, update the current view which will show the newly installed
     * campaign.
     */
    var onCampaignInstallSuccess = function () {
        PageController.openInstalledCampaigns();
    };

    /**
     * On error, just display an alert to the user with the error message.
     */
    var onCampaignInstallError = function () {
        MessageDialogController.showMessage("Unable to install campaign. Please try again later.");
    };

    /**
     * Handler for installing a new campaign.
     */
    var installNewCampaignHandler = function (campaignURN) {
        CampaignDownloadService.downloadCampaign(campaignURN, onCampaignInstallSuccess, onCampaignInstallError);
    };

    /**
     * When the campaign list has been successfully refreshed, refresh the view to display the updated list of
     * campaigns.
     */
    var onCampaignListRefreshSuccess = function () {
        MessageDialogController.showMessage("All campaigns have been updated.", PageController.refresh);
    };

    /**
     * If there was an error during the campaign list refresh process, display an
     * error message to the user.
     */
    var onCampaignListRefreshError = function () {
        MessageDialogController.showMessage("Unable to download all campaigns. Please try again.");
    };

    /**
     * Handler for opening an already installed campaign.
     */
    that.openMyCampaignHandler = function (campaignURN) {
        PageController.openCampaign(campaignURN);
    };


    var refreshCampaignsListHandler = function () {
        CampaignsMetadataService.download(true, onCampaignListRefreshSuccess, onCampaignListRefreshError);
    };

    that.getInstalledCampaignsView = function () {
        var campaignsView = InstalledCampaignsView();
        campaignsView.openMyCampaignHandler = that.openMyCampaignHandler;
        return campaignsView;
    };

    that.getAvailableCampaignsView = function () {
        var availableCampaignsView = AvailableCampaignsView();
        availableCampaignsView.installNewCampaignHandler = installNewCampaignHandler;
        availableCampaignsView.refreshCampaignsListHandler = refreshCampaignsListHandler;
        return availableCampaignsView;
    };

    return that;

}());