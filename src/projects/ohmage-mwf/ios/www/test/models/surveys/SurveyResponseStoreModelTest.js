/**
 * @author Zorayr Khalapyan
 * @version 4/15/13
 */
if (!fixture) {
    fixture = {};
}

module("models.surveys.SurveyResponseStoreModel", {
    setup: function () {
        "use strict";
        fixture.getTestSurveyResponseModel = function () {
            var surveyResponseModel = SurveyResponseModel("survey-id", "campaign-urn"),
                photoUUID = ImageStoreModel.recordImage("photo-base64");
            surveyResponseModel.recordUserResponse("prompt-id-1", "prompt-value-1");
            surveyResponseModel.recordUserResponse("photo-prompt-id", photoUUID, true);
            return surveyResponseModel;
        };
    },

    teardown: function () {
        "use strict";
        ImageStoreModel.deleteAllImages();
        SurveyResponseStoreModel.deleteAllSurveyResponses();
        delete fixture.getTestSurveyResponseModel;
    }
});


test("Test saving and restoring a survey response model.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel(),
        surveyResponseKey = surveyResponseModel.getSurveyKey(),
        restoredSurveyResponseModel;
    ///
    SurveyResponseStoreModel.saveSurveyResponse(surveyResponseModel);
    restoredSurveyResponseModel = SurveyResponseStoreModel.restoreSurveyResponse(surveyResponseKey);
    ///
    strictEqual(restoredSurveyResponseModel.getCampaignURN(), "campaign-urn", "The campaign URN should be the same after saving and restoring.");
    strictEqual(restoredSurveyResponseModel.getSurveyKey(), surveyResponseKey, "The restored survey key should match the key of the saved survey response.");

    ok(surveyResponseModel.getPhotoResponses()["photo-prompt-id"], "The photo prompt should be recorded in the restored survey response model.");
    strictEqual(surveyResponseModel.getResponse("prompt-id-1"), "prompt-value-1", "The restored prompt value should match the prompt value stored.");
});


test("Test deleting stored survey response model.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel(),
        surveyKey = surveyResponseModel.getSurveyKey(),
        surveyResponseMap = LocalMap("survey-responses"),
        imageMap = LocalMap("images"),
        responseImages = surveyResponseModel.getPhotoResponses(),
        promptID,
        photoUUID;
    SurveyResponseStoreModel.saveSurveyResponse(surveyResponseModel);
    ///
    SurveyResponseStoreModel.deleteSurveyResponse(surveyResponseModel);
    ///
    ok(!surveyResponseMap.isSet(surveyKey), "After deleting a stored survey response, the local storage should not have anything saved under the survey key.");
    for (promptID in responseImages) {
        if (responseImages.hasOwnProperty(promptID)) {
            photoUUID = surveyResponseModel.getResponse(promptID);
            ok(!imageMap.isSet(photoUUID), "All the photos associated with the survey response should be deleted.");
        }
    }
});

test("Test getting number of pending survey responses.", function () {
    "use strict";
    var surveyResponseModel1 = fixture.getTestSurveyResponseModel(),
        surveyResponseModel2 = fixture.getTestSurveyResponseModel();
    SurveyResponseStoreModel.saveSurveyResponse(surveyResponseModel1);
    SurveyResponseStoreModel.saveSurveyResponse(surveyResponseModel2);
    ///
    var numberOfSavedResponses = SurveyResponseStoreModel.getUploadQueueSize();
    ///
    strictEqual(numberOfSavedResponses, 2, "The number of pending responses should match the number of saved responses.");
});