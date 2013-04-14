/**
 * @author Zorayr Khalapyan
 * @version 4/11/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.prompt.CustomPromptPropertyVault", {
    setup: function () {
        "use strict";

        fixture.getTestPrompt = function (promptID, surveyID, campaignURN) {

            var testPrompt = mock({
                getCampaignURN : mockFunction(),
                getSurveyID : mockFunction(),
                getID : mockFunction()
            });

            //Set some defaults if not specified by the function call.
            campaignURN = campaignURN || "campaign-urn";
            surveyID = surveyID || "survey-id";
            promptID = promptID || "prompt-id";

            //Mock the prompt model to return the set values.
            when(testPrompt).getCampaignURN().thenReturn(campaignURN);
            when(testPrompt).getSurveyID().thenReturn(surveyID);
            when(testPrompt).getID().thenReturn(promptID);

            return testPrompt;
        };

        fixture.getCustomPromptPropertyVault = function (promptID, surveyID, campaignURN) {
            return CustomPromptPropertyVault(fixture.getTestPrompt(promptID, surveyID, campaignURN));
        };
    },
    teardown: function () {
        "use strict";

        CustomPromptPropertyVault.deleteAllCustomProperties();

        delete fixture.getTestPrompt;
        delete fixture.getCustomPromptPropertyVault;
    }
});

test("Test setting and getting a custom property.", function () {
    "use strict";
    var customPromptPropertyVault = fixture.getCustomPromptPropertyVault();
    ///
    customPromptPropertyVault.addCustomProperty("key", "value");
    ///
    strictEqual(customPromptPropertyVault.getCustomProperties().key, "value", "Set property should be saved and returned.");
});


test("Test setting and getting several custom properties.", function () {
    "use strict";
    var customPromptPropertyVault = fixture.getCustomPromptPropertyVault();
    ///
    customPromptPropertyVault.addCustomProperty("key1", "value1");
    customPromptPropertyVault.addCustomProperty("key2", "value2");
    customPromptPropertyVault.addCustomProperty("key3", "value3");
    ///
    strictEqual(customPromptPropertyVault.getCustomProperties().key1, "value1", "Set property should be saved and returned.");
    strictEqual(customPromptPropertyVault.getCustomProperties().key2, "value2", "Set property should be saved and returned.");
    strictEqual(customPromptPropertyVault.getCustomProperties().key3, "value3", "Set property should be saved and returned.");
});

test("Test deleting all custom prompt properties.", function () {
    "use strict";
    var customPromptPropertyVault = fixture.getCustomPromptPropertyVault();
    customPromptPropertyVault.addCustomProperty("key1", "value1");
    customPromptPropertyVault.addCustomProperty("key2", "value2");
    customPromptPropertyVault.addCustomProperty("key3", "value3");
    ///
    CustomPromptPropertyVault.deleteAllCustomProperties();
    ///
    strictEqual(customPromptPropertyVault.getCustomProperties().key1, undefined, "Set property should be deleted after deleting all custom properties.");
    strictEqual(customPromptPropertyVault.getCustomProperties().key2, undefined, "Set property should be deleted after deleting all custom properties.");
    strictEqual(customPromptPropertyVault.getCustomProperties().key3, undefined, "Set property should be deleted after deleting all custom properties.");
});

test("Test deleting custom prompt properties for a specific prompt.", function () {
    "use strict";
    var customPromptPropertyVault = fixture.getCustomPromptPropertyVault();
    customPromptPropertyVault.addCustomProperty("key1", "value1");
    customPromptPropertyVault.addCustomProperty("key2", "value2");
    customPromptPropertyVault.addCustomProperty("key3", "value3");
    ///
    customPromptPropertyVault.deleteCustomProperties();
    ///
    strictEqual(customPromptPropertyVault.getCustomProperties().key1, undefined, "Set property should be deleted after deleting prompt's custom properties.");
    strictEqual(customPromptPropertyVault.getCustomProperties().key2, undefined, "Set property should be deleted after deleting prompt's custom properties.");
    strictEqual(customPromptPropertyVault.getCustomProperties().key3, undefined, "Set property should be deleted after deleting prompt's custom properties.");
});

test("Test separation of properties between two prompts.", function () {
    "use strict";
    var customPromptPropertyVault1 = fixture.getCustomPromptPropertyVault("prompt1");
    var customPromptPropertyVault2 = fixture.getCustomPromptPropertyVault("prompt2");
    ///
    customPromptPropertyVault1.addCustomProperty("key", "value1");
    customPromptPropertyVault2.addCustomProperty("key", "value2");
    ///
    strictEqual(customPromptPropertyVault1.getCustomProperties().key, "value1", "Set property should be associated with prompt ID and separate from other prompts.");
    strictEqual(customPromptPropertyVault2.getCustomProperties().key, "value2", "Set property should be associated with prompt ID and separate from other prompts.");
});

test("Test separation of properties between two surveys.", function () {
    "use strict";
    var customPromptPropertyVault1 = fixture.getCustomPromptPropertyVault("prompt-id", "survey-id-1");
    var customPromptPropertyVault2 = fixture.getCustomPromptPropertyVault("prompt-id", "survey-id-2");
    ///
    customPromptPropertyVault1.addCustomProperty("key", "value1");
    customPromptPropertyVault2.addCustomProperty("key", "value2");
    ///
    strictEqual(customPromptPropertyVault1.getCustomProperties().key, "value1", "Set property should be associated with survey ID and separate from other surveys.");
    strictEqual(customPromptPropertyVault2.getCustomProperties().key, "value2", "Set property should be associated with survey ID and separate from other surveys.");
});

test("Test separation of properties between two campaigns.", function () {
    "use strict";
    var customPromptPropertyVault1 = fixture.getCustomPromptPropertyVault("prompt-id", "survey-id", "campaign-urn-1");
    var customPromptPropertyVault2 = fixture.getCustomPromptPropertyVault("prompt-id", "survey-id", "campaign-urn-2");
    ///
    customPromptPropertyVault1.addCustomProperty("key", "value1");
    customPromptPropertyVault2.addCustomProperty("key", "value2");
    ///
    strictEqual(customPromptPropertyVault1.getCustomProperties().key, "value1", "Set property should be associated with campaign URN and separate from other campaigns.");
    strictEqual(customPromptPropertyVault2.getCustomProperties().key, "value2", "Set property should be associated with campaign URN and separate from other campaigns.");
});