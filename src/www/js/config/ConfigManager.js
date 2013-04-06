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
        CLIENT_NAME : "ohmage-mwf"

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

    var property, camelCaseGetterName, camelCaseSetterName;

    var toCamelCase = function (g) {
        return g[1].toUpperCase();
    };

    /**
     * Creates a closure function to return the specified value. This is used
     * to iterate through all the config properties and create accessor
     * functions to return the config's value.
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

    for (property in config ) {

        //Convert CONSTANT_CASE to camelCase.
        camelCaseGetterName = ("get_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase);
        camelCaseSetterName = ("set_" + property.toLowerCase()).replace(/_([a-z])/g, toCamelCase);

        //Create accessor functions to allow users to get and set config values.
        that[camelCaseGetterName] = addPropertyGetter(property);
        that[camelCaseSetterName] = addPropertySetter(property);
    }

    //Transfer any values in config that have not been saved in localStorage.
    for(var key in config ) {
        if ( !configMap.isSet( key ) ) {
            configMap.set( key, config[ key ] );
        }
    }

    return that;

})();