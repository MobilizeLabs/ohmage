/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */

if (!fixture) {
    var fixture = {};
}

module("models.campaigns.CampaignsModel", {
    setup: function () {
        "use strict";

        CampaignsModel.uninstallAllCampaigns();

        //Example campaigns metadata for testing.
        fixture.testCampaignsMetadata = {
            "urn:brent:students:long": {
                "user_roles": ["participant", "analyst"],
                "description": "Brent testing",
                "name": "StudentsLong",
                "privacy_state": "private",
                "creation_timestamp": "2012-07-28 22:34:06",
                "running_state": "running"
            },
            "urn:campaign:demo:scott2": {
                "user_roles": ["participant", "supervisor"],
                "description": "G men health behavior",
                "name": "G Men Peers Health Behaviors",
                "privacy_state": "private",
                "creation_timestamp": "2012-10-16 12:01:36",
                "running_state": "running"
            }
        };

        //This is a full campaign configuration for the Demo Snack survey
        //although this module only concentrates on testing campaign model -
        //so prompts, survey models are not tested here.
        fixture.testCampaignConfiguration = {
            "campaignurn": "urn:campaign:demo:scott2",
            "campaignname": "G Men Peers Health Behaviors",
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
                        "prompt": []
                    }
                }
            }
        };

        /**
         * Sets test campaigns metadata for testing.
         */
        fixture.setCampaignsMetadata = function () {
            CampaignsMetadataService.setCampaignsMetadata(fixture.testCampaignsMetadata);
        };

        fixture.installSurvey = function () {
            CampaignsModel.installCampaign("urn:campaign:demo:scott2", fixture.testCampaignConfiguration);
        };

        //Erases any downloaded or set campaigns metadata.
        fixture.eraseCampaignsMetadata = function () {
            CampaignsMetadataService.setCampaignsMetadata({});
        };

        CampaignsModel.uninstallAllCampaigns();
    },

    teardown: function () {
        "use strict";

        CampaignsModel.uninstallAllCampaigns();

        fixture.eraseCampaignsMetadata();

        delete fixture.testCampaignsMetadata;
        delete fixture.setCampaignsMetadata;
        delete fixture.eraseCampaignsMetadata;
        delete fixture.installSurvey;

    }
});

test("Test isEmpty() with empty campaigns metadata.", function () {
    "use strict";
    fixture.eraseCampaignsMetadata();
    ///
    var isEmpty = CampaignsModel.isEmpty();
    ///
    ok(isEmpty, "Without any campaign metadata, the campaigns model should be empty.");
});

test("Test isEmpty() after setting campaigns metadata.", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    ///
    var isEmpty = CampaignsModel.isEmpty();
    ///
    ok(!isEmpty, "With campaigns metadata set, the campaigns model should not be empty.");
});

test("Test getting all campaigns with CampaignsModel.getAllCampaigns().", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    var allCampaigns, campaignURN;
    ///
    allCampaigns = CampaignsModel.getAllCampaigns();
    ///
    for (campaignURN in fixture.testCampaignsMetadata) {
        if (fixture.testCampaignsMetadata.hasOwnProperty(campaignURN)) {
            notStrictEqual(allCampaigns[campaignURN], undefined,
                "All campaign URNs should be included in the response of CampaignsModel.getAllCampaigns().");
        }
    }
});

test("Test getting installed campaigns without any installed campaigns.", function () {
    "use strict";
    var installedCampaigns;
    fixture.setCampaignsMetadata();
    ///
    installedCampaigns = CampaignsModel.getInstalledCampaigns();
    ///
    strictEqual(installedCampaigns["urn:brent:students:long"], undefined, "Without installing any campaigns, the installed campaigns object should be empty.");
    strictEqual(installedCampaigns["urn:campaign:demo:scott2"], undefined, "Without installing any campaigns, the installed campaigns object should be empty.");
});

test("Test getting all available campaigns with CampaignsModel.getAvailableCampaigns() without any installed campaigns.", function () {
    "use strict";
    var availableCampaigns, campaignURN;
    fixture.setCampaignsMetadata();
    ///
    availableCampaigns = CampaignsModel.getAvailableCampaigns();
    ///
    for (campaignURN in fixture.testCampaignsMetadata) {
        if (fixture.testCampaignsMetadata.hasOwnProperty(campaignURN)) {
            notStrictEqual(availableCampaigns[campaignURN], undefined,
                "All campaign URNs should be included in the response of CampaignsModel.getAvailableCampaigns() since no campaign has been installed.");
        }
    }
});

test("Test installing a campaign with CampaignsModel.installCampaign().", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    ///
    //Note that the second parameter is the campaign configuration object which
    //is left blank for testing purposes.
    CampaignsModel.installCampaign("urn:campaign:demo:scott2", {});
    ///
    strictEqual(CampaignsModel.getInstalledCampaignsCount(), 1, "The number of installed campaigns should equal to 1 since we only installed a single campaign.");
    notStrictEqual(CampaignsModel.getInstalledCampaigns()["urn:campaign:demo:scott2"], undefined, "The installed campaign should be included in the installed campaigns object.");
});

test("Test installing two campaigns with CampaignsModel.installCampaign().", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    ///
    //Note that the second parameter is the campaign configuration object which
    //is left blank for testing purposes.
    CampaignsModel.installCampaign("urn:brent:students:long", {});
    CampaignsModel.installCampaign("urn:campaign:demo:scott2", {});
    ///
    strictEqual(CampaignsModel.getInstalledCampaignsCount(), 2, "The number of installed campaigns should equal to 1 since we only installed a single campaign.");
    notStrictEqual(CampaignsModel.getInstalledCampaigns()["urn:brent:students:long"], undefined, "The installed campaign should be included in the installed campaigns object.");
    notStrictEqual(CampaignsModel.getInstalledCampaigns()["urn:campaign:demo:scott2"], undefined, "The installed campaign should be included in the installed campaigns object.");
});

test("Test getting all available campaigns with CampaignsModel.getAvailableCampaigns() with one installed campaigns.", function () {
    "use strict";
    var availableCampaigns, campaignURN;
    fixture.setCampaignsMetadata();
    CampaignsModel.installCampaign("urn:brent:students:long", {});
    ///
    availableCampaigns = CampaignsModel.getAvailableCampaigns();
    ///
    strictEqual(availableCampaigns["urn:brent:students:long"], undefined, "Installed campaign should not be included in available campaigns list.");
    notStrictEqual(availableCampaigns["urn:campaign:demo:scott2"], undefined, "Not-installed campaign should be included in available campaigns list.");
});

test("Test getting all campaigns with CampaignsModel.getAllCampaigns() with an installed campaign.", function () {
    "use strict";
    var allCampaigns, campaignURN;
    fixture.setCampaignsMetadata();
    CampaignsModel.installCampaign("urn:brent:students:long", {});
    ///
    allCampaigns = CampaignsModel.getAllCampaigns();
    ///
    for (campaignURN in fixture.testCampaignsMetadata) {
        if (fixture.testCampaignsMetadata.hasOwnProperty(campaignURN)) {
            notStrictEqual(allCampaigns[campaignURN], undefined,
                "All campaign URNs should be included in the response of CampaignsModel.getAllCampaigns() even though some campaigns may be installed.");
        }
    }
});

test("Test uninstalling a single installed campaign with CampaignsModel.uninstallCampaign().", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    CampaignsModel.installCampaign("urn:brent:students:long", {});
    ///
    CampaignsModel.uninstallCampaign("urn:brent:students:long");
    ///
    strictEqual(CampaignsModel.getInstalledCampaignsCount(), 0, "After installing and uninstalling a single campaign, there should be no installed campaigns.");
});

test("Test uninstalling several campaigns with CampaignsModel.uninstallAllCampaigns().", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    CampaignsModel.installCampaign("urn:brent:students:long", {});
    CampaignsModel.installCampaign("urn:campaign:demo:scott2", {});
    ///
    CampaignsModel.uninstallAllCampaigns();
    ///
    strictEqual(CampaignsModel.getInstalledCampaignsCount(), 0, "After installing and uninstalling a single campaign, there should be no installed campaigns.");
});

test("Test getting all the surveys from all the campaigns with a single available survey.", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    fixture.installSurvey();
    ///
    var surveys = CampaignsModel.getAllSurveys();
    ///
    strictEqual(surveys.length, 1, "Since only one survey included in the installed campaigns, the list should only consist of a single survey model.");
    strictEqual(surveys[0].getID(), "Snack", "The ID of the retrieved survey should match the installed survey.");
});

test("Test getting all the surveys from all the campaigns with no available surveys.", function () {
    "use strict";
    fixture.setCampaignsMetadata();
    ///
    var surveys = CampaignsModel.getAllSurveys();
    ///
    strictEqual(surveys.length, 0, "Since no survey was installed/available the list should be an empty array.");
});
