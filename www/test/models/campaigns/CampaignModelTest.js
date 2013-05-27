/**
 * @author Zorayr Khalapyan
 * @version 4/9/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.campaigns.CampaignModel", {
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

        //This is a full campaign configuration for the Demo Snack survey
        //although this module only concentrates on testing campaign model -
        //so prompts, survey models are not tested here.
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
                            "id": "WhatSnack",
                            "displaytype": "event",
                            "displaylabel": "What did you eat?",
                            "unit": "Snack",
                            "prompttext": "What did you eat?",
                            "abbreviatedtext": "What did you eat?",
                            "prompttype": "text",
                            "properties": {
                                "property": [{
                                    "key": "min",
                                    "label": 1
                                }, {
                                    "key": "max",
                                    "label": 256
                                }
                                    ]
                            },
                            "condition": "(SnackPeriod != 4 and SnackPeriod != 5)",
                            "skippable": "false"
                        }, {
                            "id": "HealthyLevel",
                            "displaytype": "measurement",
                            "displaylabel": "Healthy Level",
                            "unit": "Level",
                            "prompttext": "How healthy was the snack? (1 very unhealthy, 5 very healthy) ",
                            "abbreviatedtext": "How healthy?",
                            "prompttype": "number",
                            "properties": {
                                "property": [{
                                    "key": "min",
                                    "label": 1
                                }, {
                                    "key": "max",
                                    "label": 5
                                }
                                    ]
                            },
                            "defaultvalue": 3,
                            "condition": "(SnackPeriod != 4 and SnackPeriod != 5)",
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
                            "id": "WhoYouSnackWith",
                            "displaytype": "category",
                            "displaylabel": "People you had snack with",
                            "unit": "Unit",
                            "prompttext": "Who were you with?",
                            "abbreviatedtext": "People you had snack with",
                            "prompttype": "single_choice",
                            "properties": {
                                "property": [{
                                    "key": 0,
                                    "label": "Alone"
                                }, {
                                    "key": 1,
                                    "label": "Family"
                                }, {
                                    "key": 2,
                                    "label": "Friends"
                                }, {
                                    "key": 3,
                                    "label": "Classmates"
                                }, {
                                    "key": 4,
                                    "label": "Co-workers"
                                }, {
                                    "key": 5,
                                    "label": "Other"
                                }
                                    ]
                            },
                            "skippable": "false",
                            "condition": "(SnackPeriod != 4 and SnackPeriod != 5)"
                        }, {
                            "id": "WhySnack",
                            "displaytype": "event",
                            "displaylabel": "Reasons for snacking",
                            "unit": "Unit",
                            "prompttext": "Why did you eat?",
                            "abbreviatedtext": "Reasons for snacking",
                            "prompttype": "text",
                            "properties": {
                                "property": [{
                                    "key": "min",
                                    "label": 1
                                }, {
                                    "key": "max",
                                    "label": 256
                                }
                                    ]
                            },
                            "skippable": "false",
                            "condition": "(SnackPeriod != 4 and SnackPeriod != 5)"
                        }, {
                            "id": "SnackCost",
                            "displaytype": "category",
                            "displaylabel": "Cost of snack",
                            "unit": "Dollar",
                            "prompttext": "Approximate snack cost",
                            "abbreviatedtext": "Cost of snack",
                            "prompttype": "single_choice",
                            "properties": {
                                "property": [{
                                    "key": 0,
                                    "label": "Less than $1.00",
                                    "value": 0.5
                                }, {
                                    "key": 1,
                                    "label": "$1.00-$3.00",
                                    "value": 2
                                }, {
                                    "key": 2,
                                    "label": "$3.00-$5.00",
                                    "value": 4
                                }, {
                                    "key": 3,
                                    "label": "$5.00-$7.00",
                                    "value": 6
                                }, {
                                    "key": 4,
                                    "label": "$7.00-$10.00",
                                    "value": 8.5
                                }, {
                                    "key": 5,
                                    "label": "More than $10.00",
                                    "value": 10
                                }
                                    ]
                            },
                            "skippable": "false",
                            "condition": "(SnackPeriod != 4 and SnackPeriod != 5)"
                        }, {
                            "id": "NumberOfSnacksMissing",
                            "displaytype": "event",
                            "displaylabel": "Reasons for snacking",
                            "unit": "Unit",
                            "prompttext": "How many snacks have you missed reporting since your last entry? ",
                            "abbreviatedtext": "Number of missing snacks?",
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
                            "skippable": "false",
                            "defaultvalue": 0,
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

        fixture.setTestCampaign = function () {
            CampaignsMetadataService.setCampaignsMetadata(fixture.testCampaignsMetadata);
            CampaignsModel.installCampaign("urn:campaign:ca:ucla:Demo:Snack", fixture.testCampaignConfiguration);
        };

        fixture.eraseTestCampaign = function () {
            CampaignsMetadataService.setCampaignsMetadata({});
        };
    },

    teardown: function () {
        "use strict";

        CampaignsModel.uninstallAllCampaigns();

        fixture.eraseTestCampaign();

        delete fixture.testCampaignsMetadata;
        delete fixture.setCampaignsMetadata;
        delete fixture.eraseCampaignsMetadata;

    }
});

test("Test creating CampaignModel instance.", function () {
    "use strict";
    fixture.setTestCampaign();
    ///
    var campaignModel = CampaignModel("urn:campaign:ca:ucla:Demo:Snack");
    ///
    strictEqual(campaignModel.getURN(), "urn:campaign:ca:ucla:Demo:Snack", "Returned URN should match the URN that was used to create the campaign model.");

});

test("Test accessing CampaignModel properties.", function () {
    "use strict";
    fixture.setTestCampaign();
    var campaignModel = CampaignModel("urn:campaign:ca:ucla:Demo:Snack");
    ///
    var campaignName = campaignModel.getName(),
        campaignCreationTimestamp = campaignModel.getCreationTimestamp(),
        campaignDescription = campaignModel.getDescription();
    ///
    strictEqual(campaignName, "Demo Snack", "The campaign name accessed from the model should be the same as specified in the JSON object.");
    strictEqual(campaignCreationTimestamp, "2011-08-30 21:51:06", "The campaign creation timestamp accessed from the model should be the same as specified in the JSON object.");
    strictEqual(campaignDescription, "Snack campaign as of 080111 (final version).", "The campaign description accessed from the model should be the same as specified in the JSON object.");

});

test("Test running state of the campaign.", function () {
    "use strict";
    fixture.setTestCampaign();
    var campaignModel = CampaignModel("urn:campaign:ca:ucla:Demo:Snack");
    ///
    var isRunning = campaignModel.isRunning();
    ///
    ok(isRunning, "The created state should be running because the JSON defines it as running.");
});

test("Test accessing all surveys from the campaign.", function () {
    "use strict";
    fixture.setTestCampaign();
    var campaignModel = CampaignModel("urn:campaign:ca:ucla:Demo:Snack");
    ///
    var surveys = campaignModel.getSurveys();
    ///
    strictEqual(surveys["Snack"].getID(), "Snack", "The first element of the surveys array should be the first element specified in the JSON object.");
});

test("Test accessing a specific survey with ID from the campaign.", function () {
    "use strict";
    fixture.setTestCampaign();
    var campaignModel = CampaignModel("urn:campaign:ca:ucla:Demo:Snack");
    ///
    var survey = campaignModel.getSurvey("Snack");
    ///
    strictEqual(survey.getID(), "Snack", "The ID of the survey accessed from the model should match the ID of the survey specified in the JSON object.");
});

test("Test accessing a specific survey with ID is not associated with the campaign.", function () {
    "use strict";
    fixture.setTestCampaign();
    var campaignModel = CampaignModel("urn:campaign:ca:ucla:Demo:Snack");
    ///
    var survey = campaignModel.getSurvey("THIS_SURVEY_ID_DOES_NOT_EXIST");
    ///
    strictEqual(survey, null, "The survey accessed from the model with an unknown ID should be null.");
});


