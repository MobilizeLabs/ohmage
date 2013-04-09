/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */

var CampaignController = function (campaignModel) {
    "use strict";
    var that = {};

    var campaignView = null;

    var deleteCampaignConfirmationCallback = function (yes) {
        if (yes) {
            CampaignsModel.uninstallCampaign(campaignModel.getURN());
            PageController.goBack();
        }
    };

    var deleteCampaignHandler = function () {
        var message = "All data will be lost. Are you sure you would like to proceed?";
        MessageDialogController.showConfirm(message, deleteCampaignConfirmationCallback, "Yes,No");
    };

    var openSurveyViewHandler = function (campaignURN, surveyID) {
        PageController.openSurvey({campaignURN : campaignURN, surveyID : surveyID});
    };

    that.getCampaignView = function () {
        if (campaignView === null) {
            campaignView = CampaignView(campaignModel);
            campaignView.openSurveyViewHandler = openSurveyViewHandler;
            campaignView.deleteCampaignHandler = deleteCampaignHandler;
        }

        return campaignView;
    };

    return that;
};