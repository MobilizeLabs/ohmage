/**
 * @author Zorayr Khalapyan
 */
var ConfigManager = (function () {
    "use strict";

    var that = {};

    var configMap = LocalMap("config");

    /**
     * If set to true, will use test server for deployment.
     */
    var TEST_MODE = true;

    /**
     * List of available servers.
     */
    var SERVERS = [

        //Test server.
        "https://test.ohmage.org",

        //Prod server.
        "https://lausd.mobilizingcs.org",

        //List additional servers below.
        "https://pilots.mobilizelabs.org"
    ];

    /**
     * Log output for the ConfigManager.
     * @type {Logger}
     */
    var log = Logger("ConfigManager");

    /**
     * Configuration blueprint. To add new configuration value, add a new
     * property to this object and an accessor function will be generated. The
     * actual working values will be saved in a localStorage object.
     */
    var config = {

        /**
         * Server endpoint.
         */
        SERVER_ENDPOINT : SERVERS[TEST_MODE ? 0 : 1],

        /**
         * URL for reading campaigns.
         */
        CAMPAIGN_READ_URL : '/app/campaign/read',

        /**
         * URL for uploading surveys.
         */
        SURVEY_UPLOAD_URL : '/app/survey/upload',

        /**
         * Allows users to change their passwords.
         */
        PASSWORD_CHANGE_URL : '/app/user/change_password',

        /**
         * Enables GPS acquisition.
         */
        GPS_ENABLED : true,

        /**
         * If set to true, the user will be asked to either upload after submitting
         * or wait and upload manually. This functionality is mostly useful for
         * debugging upload queue.
         */
        CONFIRM_TO_UPLOAD_ON_SUBMIT : true,

        /**
         * Client property sent with AJAX requests.
         */
        CLIENT_NAME : "ohmage-mwf",

        /**
         * A list of pages that don't require the user to be authenticated.
         */
        OPEN_PAGES : ['auth', 'changeServer']
    };

    /**
     * Returns true if the specified page is an open page.
     * @param pageName
     * @returns {boolean} True if the pageName is open.
     */
    that.isOpenPage = function (pageName) {
        var openPageList = config.OPEN_PAGES,
            numOpenPages = openPageList.length,
            i;
        for (i = 0; i < numOpenPages; i += 1) {
            if (openPageList[i] === pageName) {
                return true;
            }
        }
        return false;
    };

    /**
     * Returns true if the current configuration is set up for testing environment.
     * @returns {boolean}
     */
    that.isInTestMode = function () {
        return TEST_MODE;
    };

    that.reset = function () {
        configMap.importMap(config);
    };

    /**
     * Generic method for accessing any available property.
     */
    that.getProperty = function (propertyName) {
        return configMap.get(propertyName);
    };

    /**
     * Returns a list of available servers.
     */
    that.getServers = function () {
        return SERVERS;
    };

    that.updateLocalCopy = function () {
        var configChecksum = ChecksumGen.getChecksum(config),
            localConfigChecksum = configMap.get("SAVED_CONFIG_CHECKSUM"),
            key;

        //Save the new config checksum if it has changed.
        if (configChecksum !== localConfigChecksum) {
            configMap.set("SAVED_CONFIG_CHECKSUM", configChecksum);
            log.info("Remote configuration has changed - updating local copy.");
        }

        //Transfer any values in config that have not been saved in localStorage.
        for (key in config) {
            if (config.hasOwnProperty(key)) {
                if (!configMap.isSet(key) || configChecksum !== localConfigChecksum) {
                    configMap.set(key, config[key]);
                }
            }
        }
    };

    //Initialize the configuration manager in a local scope.
    (function () {
        var property,
            key,
            camelCaseGetterName,
            camelCaseSetterName;

        var toCamelCase = function (g) {
            return g[1].toUpperCase();
        };

        /**
         * Creates a closure function to return the specified value. This is used
         * to iterate through all the config properties and create accessor
         * functions to return the configuration's value.
         */
        var addPropertyGetter = function (propertyName) {
            return function () {
                return that.getProperty(propertyName);
            };
        };

        var addPropertySetter = function (propertyName) {
            return function (newConfigValue) {
                configMap.set(propertyName, newConfigValue);
            };
        };

        //Iterate through each configuration property and dynamically add getter
        //and setter functions to ConfigManager. This will allow users to call,
        //for example, ConfigManager.setGpsEnabled(true) to set GPS_ENABLED.
        for (property in config) {
            if (config.hasOwnProperty(property)) {
                //Convert CONSTANT_CASE to camelCase.
                camelCaseGetterName = ("get_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase);
                camelCaseSetterName = ("set_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase);

                //Create accessor functions to allow users to get and set config values.
                that[camelCaseGetterName] = addPropertyGetter(property);
                that[camelCaseSetterName] = addPropertySetter(property);
            }
        }

        that.updateLocalCopy();
    }());

    return that;
}());