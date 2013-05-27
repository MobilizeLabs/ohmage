/**
 * @author Zorayr Khalapyan
 * @version 4/15/13
 */


if (!fixture) {
    fixture = {};
}

module("models.surveys.SurveyResponseModel", {
    setup: function () {
        "use strict";
        fixture.getTestSurveyResponseModel = function () {
            return SurveyResponseModel("survey-id", "campaign-urn");
        };
    },

    teardown: function () {
        "use strict";
        ImageStoreModel.deleteAllImages();
        delete fixture.getTestSurveyResponseModel;
    }
});

test("Test setting and getting user response.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel();
    ///
    surveyResponseModel.recordUserResponse("prompt-id-1", "prompt-value-1");
    surveyResponseModel.recordUserResponse("prompt-id-2", "prompt-value-2");
    ///
    strictEqual(surveyResponseModel.getResponse("prompt-id-1"), "prompt-value-1", "The retrieved prompt value should match the value recorded.");
    strictEqual(surveyResponseModel.getResponse("prompt-id-2"), "prompt-value-2", "The retrieved prompt value should match the value recorded.");
});

test("Test recording skipped prompt value.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel();
    ///
    surveyResponseModel.setPromptSkipped("prompt-id-1");
    surveyResponseModel.setPromptSkipped("prompt-id-2");
    ///
    strictEqual(surveyResponseModel.getResponse("prompt-id-1"), surveyResponseModel.getSkippedPromptValue(), "Skipped prompt should have skipped prompt value.");
    strictEqual(surveyResponseModel.getResponse("prompt-id-2"), surveyResponseModel.getSkippedPromptValue(), "Skipped prompt should have skipped prompt value.");
});

test("Test recording not displayed prompt value.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel();
    ///
    surveyResponseModel.setPromptNotDisplayed("prompt-id-1");
    surveyResponseModel.setPromptNotDisplayed("prompt-id-2");
    ///
    strictEqual(surveyResponseModel.getResponse("prompt-id-1"), surveyResponseModel.getNotDisplayedPromptValue(), "Not displayed prompt should have not displayed prompt value.");
    strictEqual(surveyResponseModel.getResponse("prompt-id-2"), surveyResponseModel.getNotDisplayedPromptValue(), "Not displayed prompt should have not displayed prompt value.");
});

test("Test accessing all responses.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel();
    surveyResponseModel.recordUserResponse("prompt-id-1", "prompt-value-1");
    surveyResponseModel.recordUserResponse("prompt-id-2", "prompt-value-2");
    surveyResponseModel.setPromptNotDisplayed("prompt-id-3");
    surveyResponseModel.setPromptSkipped("prompt-id-4");
    ///
    var responses = surveyResponseModel.getResponses();
    ///
    strictEqual(responses["prompt-id-1"], "prompt-value-1", "The retrieved prompt value should match the value recorded.");
    strictEqual(responses["prompt-id-2"], "prompt-value-2", "The retrieved prompt value should match the value recorded.");
    strictEqual(responses["prompt-id-3"], surveyResponseModel.getNotDisplayedPromptValue(), "Not displayed prompt should have not displayed prompt value.");
    strictEqual(responses["prompt-id-4"], surveyResponseModel.getSkippedPromptValue(), "Skipped prompt should have skipped prompt value.");
});

test("Test accessing upload data properties.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel();
    surveyResponseModel.recordUserResponse("prompt-id-1", "prompt-value-1");
    surveyResponseModel.recordUserResponse("prompt-id-2", "prompt-value-2");
    surveyResponseModel.setPromptNotDisplayed("prompt-id-3");
    surveyResponseModel.setPromptSkipped("prompt-id-4");
    ///
    var uploadData = surveyResponseModel.getUploadData();
    ///
    strictEqual(uploadData.responses.survey_id, "survey-id", "The survey ID recorded in the upload data should match the value specified.");
    strictEqual(uploadData.responses.responses.length, 4, "The total number of responses should match the number of responses recorded.");

    strictEqual(uploadData.responses.responses[0].prompt_id, "prompt-id-1", "The prompt ID in the upload data should match the ID recorded.");
    strictEqual(uploadData.responses.responses[1].prompt_id, "prompt-id-2", "The prompt ID in the upload data should match the ID recorded.");
    strictEqual(uploadData.responses.responses[2].prompt_id, "prompt-id-3", "The prompt ID in the upload data should match the ID recorded.");
    strictEqual(uploadData.responses.responses[3].prompt_id, "prompt-id-4", "The prompt ID in the upload data should match the ID recorded.");

    strictEqual(uploadData.responses.responses[0].value, "prompt-value-1", "The prompt value in the upload data should match the value recorded.");
    strictEqual(uploadData.responses.responses[1].value, "prompt-value-2", "The prompt value in the upload data should match the value recorded.");
    strictEqual(uploadData.responses.responses[2].value, surveyResponseModel.getNotDisplayedPromptValue(), "Not displayed prompt should have not displayed prompt value.");
    strictEqual(uploadData.responses.responses[3].value, surveyResponseModel.getSkippedPromptValue(), "Skipped prompt should have skipped prompt value.");
});

test("Test accessing upload data properties with recorded images.", function () {
    "use strict";
    var surveyResponseModel = fixture.getTestSurveyResponseModel(),
        photoUUID = ImageStoreModel.recordImage("photo-base64");
    surveyResponseModel.recordUserResponse("prompt-id-1", "prompt-value-1");
    surveyResponseModel.recordUserResponse("photo-prompt-id", photoUUID, true);
    ///
    var uploadData = surveyResponseModel.getUploadData();
    ///
    strictEqual(uploadData.responses.survey_id, "survey-id", "The survey ID recorded in the upload data should match the value specified.");
    strictEqual(uploadData.responses.responses.length, 2, "The total number of responses should match the number of responses recorded.");

    strictEqual(uploadData.responses.responses[0].prompt_id, "prompt-id-1", "The prompt ID in the upload data should match the ID recorded.");
    strictEqual(uploadData.responses.responses[1].prompt_id, "photo-prompt-id", "The prompt ID in the upload data should match the ID recorded.");

    strictEqual(uploadData.responses.responses[0].value, "prompt-value-1", "The prompt value in the upload data should match the ID recorded.");
    strictEqual(uploadData.responses.responses[1].value, photoUUID, "The photo prompt base64 value in the upload data should match the base64 value recorded.");

    ok(surveyResponseModel.getPhotoResponses()["photo-prompt-id"], "The photo prompt should be recorded in the image responses object.");

});