/**
 * @author Zorayr Khalapyan
 * @version 4/15/13
 */
var SurveyResponseController = function (surveyResponseKey) {
    "use strict";
    var that = {};

    var surveyResponseModel = SurveyResponseStoreModel.restoreSurveyResponse(surveyResponseKey);

    var campaignModel = CampaignsModel.getCampaign(surveyResponseModel.getCampaignURN());

    var surveyModel = campaignModel.getSurvey(surveyResponseModel.getSurveyID());

    /**
     * Button callback that will initialize a survey response upload. If the
     * upload is successful, then a message is displayed to the user and then
     * the entire queue is displayed. If unsuccessful, an error message is
     * displayed and the user has the option to retry.
     */
    var uploadSurveyResponseCallback = function () {
        var onSuccess = function (response) {
            MessageDialogController.showMessage("Successfully uploaded your survey response.", function () {
                SurveyResponseStoreModel.deleteSurveyResponse(surveyResponseModel);
                PageController.openQueue();
            });
        },
            onError = function (error) {
                MessageDialogController.showMessage("Unable to upload survey response at this time. Please try again later.");
            };
        (SurveyResponseUploadService(surveyModel, surveyResponseModel)).upload(onSuccess, onError, ConfigManager.getGpsEnabled());
    };

    /**
     * Button handler for deleting an individual survey response. The user
     * will be prompted for confirmation before deleting the survey response.
     */
    var deleteSurveyResponseCallback = function () {
        var message = "Are you sure you would like to delete your response?";
        MessageDialogController.showConfirm(message, function (yesDeleteSurveyResponse) {
            if (yesDeleteSurveyResponse) {
                SurveyResponseStoreModel.deleteSurveyResponse(surveyResponseModel);
                PageController.openQueue();
            }
        }, "Yes,No");
    };

    that.getSurvey = function () {
        return surveyModel;
    };

    that.getSurveyResponseModel = function () {
        return surveyResponseModel;
    };

    that.getCampaign = function () {
        return campaignModel;
    };

    that.getView = function () {
        var surveyResponseView = SurveyResponseView(that);
        surveyResponseView.deleteSurveyResponseCallback = deleteSurveyResponseCallback;
        surveyResponseView.uploadSurveyResponseCallback = uploadSurveyResponseCallback;
        return surveyResponseView;
    };

    return that;
};
