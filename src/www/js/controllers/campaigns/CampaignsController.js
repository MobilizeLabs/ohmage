/**
 * Singleton Model!
 */
var CampaignsController = (function () {
    
    var that = {};
    
    /**
     * On success, update the current view which will show the newly installed
     * campaign.
     */
    var onCampaignInstallSuccess = function () {
        PageNavigation.openInstalledCampaignsView();
    };

    /**
     * On error, just display an alert to the user with the error message.
     */
    var onCampaignInstallError = function () {
        MessageDialogController.showMessage("Unable to install campaign. Please try again later.");
    };
    
    /**
     * When the campaign list has been sucessfully refreshed, refresh the view.
     */
    var onCampaignListRefreshSuccess = function () {
        MessageDialogController.showMessage("All campaigns have been updated.", PageNavigation.openAvailableCampaignsView);
    };
    
    /**
     * If there was an error during the campaign list refresh process, display an 
     * error message to the user.
     */
    var onCampaignListRefreshError = function () {
        MessageDialogController.showMessage("Unable to download all campaigns. Please try again.");
    };

    /**
     * Handler for installing a new campaign.
     */
    that.installNewCampaignHandler = function (campaignURN) {
        Campaign.install(campaignURN, onCampaignInstallSuccess, onCampaignInstallError);
    };
    
    /**
     * Handler for opening an already installed campaign.
     */
    that.openMyCampaignHandler = function (campaignURN) {
        PageNavigation.openCampaignView(campaignURN);        
    };
    
    that.refreshCampaignsListHandler = function () {
        CampaignsModel.download(true, onCampaignListRefreshSuccess, onCampaignListRefreshError);
    };
    
    that.renderInstalledCampaigns = function () {
        var campaignsView = CampaignsView(CampaignsModel);
        campaignsView.openMyCampaignHandler = that.openMyCampaignHandler;
        return campaignsView.renderMyCampaigns();
    };
    
    that.renderAvailableCampaigns = function () {
        var campaignsView = CampaignsView(CampaignsModel);
        campaignsView.installNewCampaignHandler = that.installNewCampaignHandler;
        campaignsView.refreshCampaignsListHandler = that.refreshCampaignsListHandler;
        return campaignsView.renderAvailableCampaigns();
    };
    
    return that;
    
})();