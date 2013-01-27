
var CampaignController = function ( campaignModel ) {

    var that = {};

    var deleteCampaignConfirmationCallback = function (yes) {
        if (yes) {
             CampaignsModel.uninstallCampaign(campaignModel.getURN());
             PageNavigation.goBack();
         }
    };

    that.deleteCampaignHandler = function () {
         var message = "All data will be lost. Are you sure you would like to proceed?";
         MessageDialogController.showConfirm(message, deleteCampaignConfirmationCallback, "Yes,No");
    };

    that.renderCampaignView = function () {
        var campaignView = CampaignView(campaignModel);
        campaignView.openSurveyViewHandler = CampaignController.openSurveyViewHandler;
        campaignView.deleteCampaignHandler = that.deleteCampaignHandler;
        return campaignView.render();
    };

    return that;
};

CampaignController.openSurveyViewHandler = function (campaignURN, surveyID) {
    PageNavigation.openSurveyView(campaignURN, surveyID);
};