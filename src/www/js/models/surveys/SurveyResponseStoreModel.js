/**
 * @author Zorayr Khalapyan
 * @version 4/15/13
 */
var SurveyResponseStoreModel = (function () {
    "use strict";
    var that = {};

    var surveyResponseMap = LocalMap("survey-responses");

    that.saveSurveyResponse = function (surveyResponseModel) {
        surveyResponseMap.set(surveyResponseModel.getSurveyKey(), surveyResponseModel.getData());
    };

    /**
     * The function restores a stored SurveyResponseModel object.
     * @returns {SurveyResponseModel|Boolean}
     */
    that.restoreSurveyResponse = function (surveyKey) {
        var surveyResponseData,
            surveyResponseModel;

        if (surveyResponseMap.isSet(surveyKey)) {
            surveyResponseData = surveyResponseMap.get(surveyKey);
            surveyResponseModel = SurveyResponseModel(surveyResponseData.id, surveyResponseData.campaign_urn, surveyResponseData.survey_key);
            surveyResponseModel.setData(surveyResponseData);
            return surveyResponseModel;
        }

        return false;
    };

    /**
     * Deletes the survey response with it associated images if any.
     */
    that.deleteSurveyResponse = function (surveyResponseModel) {
        var surveyResponseImages = surveyResponseModel.getPhotoResponses(),
            photoPromptID,
            photoUUID;
        for (photoPromptID in surveyResponseImages) {
            if (surveyResponseImages.hasOwnProperty(photoPromptID)) {
                photoUUID = surveyResponseModel.getResponse(photoPromptID);
                ImageStoreModel.deleteImage(photoUUID);
            }
        }
        surveyResponseMap.release(surveyResponseModel.getSurveyKey());
    };

    that.deleteAllSurveyResponses = function () {
        var surveyResponseUUID,
            responseMap = surveyResponseMap.getMap(),
            restoredSurveyResponseModel;
        for (surveyResponseUUID in responseMap) {
            if (responseMap.hasOwnProperty(surveyResponseUUID)) {
                restoredSurveyResponseModel = that.restoreSurveyResponse(surveyResponseUUID);
                that.deleteSurveyResponse(restoredSurveyResponseModel);
            }
        }
    };

    /**
     * Returns all pending survey responses.
     */
    that.getPendingResponses = function () {
        var pendingResponses = {},
            response,
            survey,
            surveyResponseUUID,
            responseMap = surveyResponseMap.getMap();
        for (surveyResponseUUID in responseMap) {
            if (responseMap.hasOwnProperty(surveyResponseUUID)) {
                response = that.restoreSurveyResponse(surveyResponseUUID);
                survey = CampaignsModel.getSurvey(response.getCampaignURN(), response.getSurveyID());
                pendingResponses[surveyResponseUUID] = {'survey': survey, 'response': response};
            }
        }
        return pendingResponses;
    };

    /**
     * Returns the number of survey responses that have not been uploaded.
     */
    that.getUploadQueueSize = function () {
        return surveyResponseMap.length();
    };

    return that;

}());