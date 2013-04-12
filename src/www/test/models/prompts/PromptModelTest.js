/**
 * @author Zorayr Khalapyan
 * @version 4/11/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.prompts.PromptModel", {
    setup: function () {
        "use strict";

        //Example campaigns metadata for testing.
        fixture.testCampaignsMetadata = {
            "urn:campaign:ca:ucla:cens:josh_prompt_types_test": {
                "user_roles": ["participant", "analyst"],
                "description": "Josh's Test Campaign for trying out all of the prompt types.",
                "name": "Josh's 2.8 Prompt Types Test",
                "privacy_state": "shared",
                "creation_timestamp": "2011-11-16 12:55:38",
                "running_state": "running"
            }
        };

        fixture.testCampaignConfiguration = {
            "urn:campaign:ca:ucla:cens:josh_prompt_types_test": {
                "campaignurn": "urn:campaign:ca:ucla:cens:josh_prompt_types_test",
                "campaignname": "Josh&apos;s 2.8 Prompt Types Test",
                "serverurl": "https://dev1.andwellness.org/",
                "surveys": {
                    "survey": [{
                        "id": "numberSurvey",
                        "title": "Number Survey",
                        "description": "This is a survey to test behavior of the number prompt type.",
                        "submittext": "Done with the number survey",
                        "showsummary": "false",
                        "editsummary": "false",
                        "summarytext": "Number Test",
                        "anytime": "true",
                        "contentlist": {
                            "prompt": [{
                                "id": "numberZeroToTen",
                                "displaytype": "event",
                                "displaylabel": "numberZeroToTen",
                                "prompttext": "Pick a number.",
                                "abbreviatedtext": "Pick a number.",
                                "prompttype": "number",
                                "properties": {
                                    "property": [{
                                        "key": "min",
                                        "label": 0
                                    }, {
                                        "key": "max",
                                        "label": 10
                                    }
                                        ]
                                },
                                "defaultvalue": 0,

                                //This line was added for testing conditional statement preparation.
                                //This line is not part of the original configuration!!
                                "condition": "(numberNegTenToZero &lt; 10 && and numberNegTenToZero &gt; 0)",
                                "skippable": "true",
                                "skiplabel": "Skip"
                            }
                                ]
                        }
                    }, {
                        "id": "multiChoiceCustomSurvey",
                        "title": "Multi Choice Custom Survey",
                        "description": "This is a survey to test behavior of the multi choice custom prompt type.",
                        "submittext": "Done with the multi choice custom survey",
                        "showsummary": "false",
                        "editsummary": "false",
                        "summarytext": "Multi Choice Custom Test",
                        "anytime": "true",
                        "contentlist": {
                            "prompt": [{
                                "id": "multiChoiceCustom1",
                                "displaytype": "event",
                                "displaylabel": "Multi Choice Custom 1",
                                "prompttext": "Add a choice:",
                                "abbreviatedtext": "add a choice",
                                "prompttype": "multi_choice_custom",
                                "skippable": "true",
                                "skiplabel": "Skip"
                            }, {
                                "id": "multiChoiceCustom2",
                                "displaytype": "event",
                                "displaylabel": "Multi Choice Custom 2",
                                "prompttext": "Geographical facets of southern California",
                                "abbreviatedtext": "geo facets",
                                "prompttype": "multi_choice_custom",
                                "properties": {
                                    "property": [{
                                        "key": 0,
                                        "label": "The Beach"
                                    }, {
                                        "key": 1,
                                        "label": "The Desert"
                                    }, {
                                        "key": 2,
                                        "label": "The Mountains"
                                    }
                                        ]
                                },
                                "skippable": "true",
                                "skiplabel": "Skip"
                            }
                                ]
                        }
                    }
                        ]
                }
            }
        };

        fixture.getTestSurvey = function (surveyID) {
            var campaign = fixture.testCampaignConfiguration["urn:campaign:ca:ucla:cens:josh_prompt_types_test"],
                surveys = campaign.surveys.survey,
                i,
                numSurveys = surveys.length;
            for (i = 0; i < numSurveys; i += 1) {
                if (surveys[i].id === surveyID) {
                    return surveys[i];
                }
            }
            return null;
        };

        fixture.getTestPrompt = function (surveyID, promptID) {
            var prompt,
                survey = fixture.getTestSurvey(surveyID),
                prompts = survey.contentlist.prompt,
                i,
                numPrompts = prompts.length;
            for (i = 0; i < numPrompts; i += 1) {
                if (prompts[i].id === promptID) {
                    return prompts[i];
                }
            }

            return null;
        };

        fixture.getTestPromptModel = function (surveyID, promptID) {
            var testCampaign = mock({getURN : mockFunction()}),
                testSurvey = mock({getID : mockFunction()});

            when(testCampaign).getURN().thenReturn("test-campaign-urn");
            when(testSurvey).getID().thenReturn("test-survey-id");

            return PromptModel(fixture.getTestPrompt(surveyID, promptID), testSurvey, testCampaign);
        };
    },

    teardown: function () {
        "use strict";

        CustomPromptPropertyVault.deleteAllCustomProperties();

        delete fixture.getTestSurvey;
        delete fixture.getTestPrompt;
        delete fixture.getTestPromptModel;

    }
});

test("Test fixture: accessing surveys by ID.", function () {
    "use strict";
    ///
    var survey = fixture.getTestSurvey("multiChoiceCustomSurvey");
    ///
    strictEqual(survey.id, "multiChoiceCustomSurvey", "The accessed survey should have the same ID as specified");
});

test("Test fixture: accessing prompts by ID.", function () {
    "use strict";
    ///
    var prompt = fixture.getTestPrompt("multiChoiceCustomSurvey", "multiChoiceCustom1");
    ///
    strictEqual(prompt.id, "multiChoiceCustom1", "The accessed prompt should have the same ID as specified");
});

test("Test accessing prompt configuration values by named functions.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("multiChoiceCustomSurvey", "multiChoiceCustom1");

    ///
    var promptID = promptModel.getID(),
        promptType = promptModel.getType(),
        isSkippable = promptModel.isSkippable(),
        promptSkipLabel = promptModel.getSkipLabel(),
        promptText = promptModel.getText(),
        defaultValue = promptModel.getDefaultValue(),
        minValue = promptModel.getMinValue(),
        maxValue = promptModel.getMaxValue();
    ///

    strictEqual(promptID, "multiChoiceCustom1", "The accessed prompt should have the same ID as specified");
    strictEqual(promptType, "multi_choice_custom", "The accessed prompt type should be the same as in the test prompt data JSON.");
    strictEqual(isSkippable, true, "The prompt should be skippable as specified in the prompt data JSON.");
    strictEqual(promptSkipLabel, "Skip", "The accessed prompt skip label should be the same as in the test prompt data JSON.");
    strictEqual(promptText, "Add a choice:", "The accessed prompt text should be the same as in the test prompt data JSON.");
    strictEqual(defaultValue, null, "The default value should be null, since it's not defined for this example prompt.");
    strictEqual(minValue, null, "The min value should be null, since it's not defined for this example prompt.");
    strictEqual(maxValue, null, "The max value should be null, since it's not defined for this example prompt.");
});

test("Test accessing prompt properties.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("multiChoiceCustomSurvey", "multiChoiceCustom2");
    ///
    var key0 = promptModel.getProperty(0),
        key1 = promptModel.getProperty(1),
        key2 = promptModel.getProperty(2),
        invalidKeyValue = promptModel.getProperty(10000);
    ///

    strictEqual(key0, "The Beach", "Property with key 0 should be the same as specified.");
    strictEqual(key1, "The Desert", "Property with key 1 should be the same as specified.");
    strictEqual(key2, "The Mountains", "Property with key 2 should be the same as specified.");
    strictEqual(invalidKeyValue, null, "Property with invalid key should be null.");

});

test("Conditional statement &lt; and &lt; conversion to < and > test.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("numberSurvey", "numberZeroToTen");
    ///
    var condition = promptModel.getCondition();
    ///
    strictEqual(condition, "(numberNegTenToZero < 10 && and numberNegTenToZero > 0)", "HTML Entity symbols should be replaced with < and >.");
});

test("Test getting min, max, and default values for a prompt that specified these values.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("numberSurvey", "numberZeroToTen");
    ///
    var min = promptModel.getMinValue(),
        max = promptModel.getMaxValue(),
        defaultValue = promptModel.getDefaultValue();
    ///
    strictEqual(min, 0, "Minimum value accessed should be the same as defined in the JSON.");
    strictEqual(max, 10, "Maximum value accessed should be the same as defined in the JSON.");
    strictEqual(defaultValue, 0, "Default value accessed should be the same as defined in the JSON.");
});

test("Test adding a property with a duplicate label value.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("multiChoiceCustomSurvey", "multiChoiceCustom2");
    ///
    var addPropertyResult = promptModel.addProperty("The Beach");
    ///
    ok(!addPropertyResult, "Should not be able to add a duplicate label.");
});

test("Test adding a property with a unique label value but with existing key.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("multiChoiceCustomSurvey", "multiChoiceCustom2");
    ///
    var addPropertyResult = promptModel.addProperty("Unique Label", 0);
    ///
    ok(!addPropertyResult, "Should not be able to a property with an existing key.");
    strictEqual(promptModel.getTestCustomPromptPropertyVault().getCustomProperties()[0], undefined, "The invalid property should not be added to the custom property vault.");
});

test("Test adding a property with a unique label and key.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("multiChoiceCustomSurvey", "multiChoiceCustom2");
    ///
    var addPropertyResult = promptModel.addProperty("Unique Label", 3);
    ///
    ok(addPropertyResult, "Should be able to add a property with a unique label and key.");
    strictEqual(promptModel.getProperty(3), "Unique Label", "The access prompt should be the same as the one added.");
    strictEqual(promptModel.getTestCustomPromptPropertyVault().getCustomProperties()[3], "Unique Label", "The added property should also be added to the custom property vault.");
});

test("Test adding a property with a unique label, without defining key value.", function () {
    "use strict";
    var promptModel = fixture.getTestPromptModel("multiChoiceCustomSurvey", "multiChoiceCustom2");
    ///
    var addPropertyResult = promptModel.addProperty("Unique Label");
    ///
    ok(addPropertyResult, "Should be able to add a property with a unique label, without defining key.");
    strictEqual(promptModel.getProperty(3), "Unique Label", "The access prompt should be the same as the one added.");
    strictEqual(promptModel.getTestCustomPromptPropertyVault().getCustomProperties()[3], "Unique Label", "The added property should also be added to the custom property vault.");
});


