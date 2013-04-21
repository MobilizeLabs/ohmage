module("config.ConfigManager", {
    setup: function () {
        "use strict";
        //No setup required.
    },
    teardown: function () {
        "use strict";
        ConfigManager.reset();
    }
});

test("Test ConfigManager.getProperty()", function () {
    "use strict";
    ///
    var serverEndpoint = ConfigManager.getProperty("SERVER_ENDPOINT");
    var campaignReadUrl = ConfigManager.getProperty("CAMPAIGN_READ_URL");
    var surveyUploadUrl = ConfigManager.getProperty("SURVEY_UPLOAD_URL");
    var passwordChangeUrl = ConfigManager.getProperty("PASSWORD_CHANGE_URL");
    ///

    ok(serverEndpoint !== undefined,    "Should be able to get SERVER_ENDPOINT property.");
    ok(campaignReadUrl !== undefined,   "Should be able to get CAMPAIGN_READ_URL property.");
    ok(surveyUploadUrl !== undefined,   "Should be able to get SURVEY_UPLOAD_URL property.");
    ok(passwordChangeUrl !== undefined, "Should be able to get PASSWORD_CHANGE_URL property.");
});

test("Test ConfigManager.getConfigProperty()", function () {
    "use strict";
    ///
    var serverEndpoint = ConfigManager.getServerEndpoint();
    var campaignReadUrl = ConfigManager.getCampaignReadUrl();
    var surveyUploadUrl = ConfigManager.getSurveyUploadUrl();
    var passwordChangeUrl = ConfigManager.getPasswordChangeUrl();
    ///

    ok(serverEndpoint !== undefined,    "Should be able to get SERVER_ENDPOINT property.");
    ok(campaignReadUrl !== undefined,   "Should be able to get CAMPAIGN_READ_URL property.");
    ok(surveyUploadUrl !== undefined,   "Should be able to get SURVEY_UPLOAD_URL property.");
    ok(passwordChangeUrl !== undefined, "Should be able to get PASSWORD_CHANGE_URL property.");
});

test("Test ConfigManager.getServers()", function () {
    "use strict";
    ///
    var servers = ConfigManager.getServers();
    ///
    ok(servers.length > 1, "There should be at least one server provided by the config manager.");
});

test("Test ConfigManager.setServerEndpoint()", function () {
    "use strict";
    var newServerEndpoint = "new-server-endpoint";
    ///
    ConfigManager.setServerEndpoint(newServerEndpoint);
    ///
    ok(ConfigManager.getServerEndpoint() === newServerEndpoint, "The server endpoint returned by the ConfigManager should match the new server endpoint.");
});

test("Test ConfigManager.reset()", function () {
    "use strict";
    var originalServerEndpoint = ConfigManager.getServerEndpoint();
    ConfigManager.setServerEndpoint("new-server-endpoint");
    ///
    ConfigManager.reset();
    ///
    ok(ConfigManager.getServerEndpoint() === originalServerEndpoint, "The server endpoint returned by the ConfigManager should match the new server endpoint.");
});

test("Test ConfigManager.setGpsEnabled(true)", function () {
    "use strict";
    ///
    ConfigManager.setGpsEnabled(true);
    ///
    ok(ConfigManager.getGpsEnabled() === true, "ConfigManager should enable GPS.");
});

test("Test ConfigManager.setGpsEnabled(false)", function () {
    "use strict";
    ///
    ConfigManager.setGpsEnabled(false);
    ///
    ok(ConfigManager.getGpsEnabled() === false, "ConfigManager should disable GPS.");
});

test("Test remote config change detection and local copy update mechanism when checksum has changed.", function () {
    "use strict";
    ConfigManager.setServerEndpoint("new-server-endpoint");
    //Fake the saved config checksum value to simulate remote config property
    //change. In other words, the calculated checksum of the local copy  will
    //not equal
    LocalMap("config").set("SAVED_CONFIG_CHECKSUM", 0);
    ///
    ConfigManager.updateLocalCopy();
    ///
    ok(ConfigManager.getServerEndpoint() !== "new-server-endpoint", "Since the saved checksum is not the same as the generated checksum of the set properties, local copy should be updated.");
});

test("Test remote config change detection and local copy update mechanism when the checksum has not been changed.", function () {
    "use strict";
    ConfigManager.setServerEndpoint("new-server-endpoint");
    ///
    ConfigManager.updateLocalCopy();
    ///
    ok(ConfigManager.getServerEndpoint() === "new-server-endpoint", "Local copy should not be updated if the checksum has not changed.");
});
