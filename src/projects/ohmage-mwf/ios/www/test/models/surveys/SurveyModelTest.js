/**
 * @author Zorayr Khalapyan
 * @version 4/9/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.surveys.SurveyModel", {
    setup: function () {
        "use strict";

        //Example campaigns metadata for testing.
        fixture.testCampaignsMetadata = {
            "urn:campaign:ca:ucla:Demo:Snack": {
                "user_roles": ["participant", "supervisor"],
                "description": "Snack campaign as of 080111 (final version).",
                "name": "Demo Snack",
                "privacy_state": "shared",
                "creation_timestamp": "2011-08-30 21:51:06",
                "running_state": "running"
            }
        };

        fixture.testCampaignConfiguration = {
            "campaignurn": "urn:campaign:ca:ucla:Demo:Snack",
            "campaignname": "Demo Snack",
            "serverurl": "https://dev.mobilizingcs.org/",
            "surveys": {
                "survey": {
                    "id": "Snack",
                    "title": "Snack",
                    "description": "observe and sample snack events.",
                    "submittext": "Snack",
                    "showsummary": "true",
                    "editsummary": "false",
                    "summarytext": "Observe and collect forms of advertising media in the community",
                    "anytime": "true",
                    "contentlist": {
                        "prompt": [{
                            "id": "SnackPeriod",
                            "displaytype": "event",
                            "displaylabel": "Last snack time period",
                            "unit": "Time",
                            "prompttext": "When did you eat your last snack?",
                            "abbreviatedtext": "When did you eat your last snack?",
                            "prompttype": "single_choice",
                            "properties": {
                                "property": [{
                                    "key": 0,
                                    "label": "Mid-morning"
                                }, {
                                    "key": 1,
                                    "label": "Mid-afternoon"
                                }, {
                                    "key": 2,
                                    "label": "Evening"
                                }, {
                                    "key": 3,
                                    "label": "Late night"
                                }, {
                                    "key": 4,
                                    "label": "None"
                                }, {
                                    "key": 5,
                                    "label": "Already reported"
                                }
                                    ]
                            },
                            "skippable": "false"
                        }, {
                            "id": "SnackLocation",
                            "displaytype": "category",
                            "displaylabel": "Snack Location",
                            "unit": "Location",
                            "prompttext": "Where did you eat?",
                            "abbreviatedtext": "Snack Location",
                            "prompttype": "single_choice",
                            "properties": {
                                "property": [{
                                    "key": 0,
                                    "label": "Home"
                                }, {
                                    "key": 1,
                                    "label": "School"
                                }, {
                                    "key": 2,
                                    "label": "Work"
                                }, {
                                    "key": 3,
                                    "label": "Restaurant"
                                }, {
                                    "key": 4,
                                    "label": "Friends' houses"
                                }, {
                                    "key": 5,
                                    "label": "Vehicle"
                                }, {
                                    "key": 6,
                                    "label": "Party"
                                }, {
                                    "key": 7,
                                    "label": "Other"
                                }
                                    ]
                            },
                            "skippable": "false",
                            "condition": "(SnackPeriod != 4 and SnackPeriod != 5)"
                        }, {
                            "id": "SnackImage",
                            "displaytype": "metadata",
                            "displaylabel": "Snack Image",
                            "unit": "Unit",
                            "prompttext": "Take a picture?",
                            "abbreviatedtext": "Snack Image",
                            "prompttype": "photo",
                            "properties": {
                                "property": {
                                    "key": "res",
                                    "label": 720
                                }
                            },
                            "skippable": "true",
                            "skiplabel": "Skip",
                            "condition": "(SnackPeriod != 4 and SnackPeriod != 5)"
                        }
                            ]
                    }
                }
            }
        };

        /**
         * Installs a campaign configuration and the campaign metadata.
         */
        fixture.setTestCampaign = function () {
            CampaignsMetadataService.setCampaignsMetadata(fixture.testCampaignsMetadata);
            CampaignsModel.installCampaign("urn:campaign:ca:ucla:Demo:Snack", fixture.testCampaignConfiguration);
        };

        fixture.eraseTestCampaign = function () {
            CampaignsMetadataService.setCampaignsMetadata({});
        };

        fixture.getTestSurvey = function () {
            return CampaignModel("urn:campaign:ca:ucla:Demo:Snack").getSurvey("Snack");
        };

        fixture.setTestCampaign();
    },

    teardown: function () {
        "use strict";

        CampaignsModel.uninstallAllCampaigns();

        fixture.eraseTestCampaign();

        delete fixture.testCampaignsMetadata;
        delete fixture.setCampaignsMetadata;
        delete fixture.eraseCampaignsMetadata;
        delete fixture.getTestSurvey;

    }
});

test("Test accessing SurveyModel properties.", function () {
    "use strict";
    var surveyModel = fixture.getTestSurvey();
    ///
    var surveyTitle = surveyModel.getTitle(),
        surveyDescription = surveyModel.getDescription(),
        surveyID = surveyModel.getID();
    ///
    strictEqual(surveyTitle, "Snack", "The survey title accessed from the model should be the same as specified in the JSON object.");
    strictEqual(surveyDescription, "observe and sample snack events.", "The survey description accessed from the model should be the same as specified in the JSON object.");
    strictEqual(surveyID, "Snack", "The survey ID accessed from the model should be the same as specified in the JSON object.");
});


test("Test accessing list of all items in the survey.", function () {
    "use strict";
    var surveyModel = fixture.getTestSurvey();
    ///
    var itemsList = surveyModel.getItems();
    ///
    strictEqual(itemsList.length, 3, "The number of items retrieved should be 9.");
    strictEqual(itemsList[0].getID(), "SnackPeriod", "The ID of the first element in the list should match the ID of the first survey element in the JSON.");
    strictEqual(itemsList[2].getID(), "SnackImage", "The ID of the last element in the list should match the ID of the last survey element in the JSON.");
});

test("Test accessing items from the survey by ID.", function () {
    "use strict";
    var surveyModel = fixture.getTestSurvey();
    ///
    var snackPeriodItem = surveyModel.getItem("SnackPeriod"),
        snackImageItem = surveyModel.getItem("SnackImage"),
        unknownIDItem = surveyModel.getItem("ItemWithWrongID");
    ///
    strictEqual(snackPeriodItem.getID(), "SnackPeriod", "The ID of the accessed element in the list should match the ID that was specified.");
    strictEqual(snackImageItem.getID(), "SnackImage", "The ID of the accessed element in the list should match the ID that was specified.");
    strictEqual(unknownIDItem, null, "If the specified ID does not exist, then null should be returned.");
});