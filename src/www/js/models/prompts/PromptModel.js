/**
 * @author Zorayr Khalapyan
 * @version 4/11/13
 */
/**
 *
 * Represents an individual prompt. The class provides functionality for
 * interacting with prompt properties.
 */
var PromptModel = function (promptData, surveyModel, campaignModel) {
    "use strict";

    var that = {};

    /**
     * Stores custom prompt properties associated with the current prompt.
     * @type {CustomPromptPropertyVault}
     */
    var customPromptPropertyVault = null;

    /**
     * Stores current specified and custom properties as (key, value) pairs.
     */
    var properties = {};

    /**
     * Represents the number of properties associated with the current prompt.
     * Includes both specified and custom prompts.
     * @type {number}
     */
    var numProperties = 0;

    /**
     * Stores the conditional statement associated with the current prompt.
     * @type {string | null}
     */
    var condition = null;

    /**
     * Detects if the specified property is already in the property list of this
     * prompt. The method returns true if the property is a duplicate, false
     * otherwise.
     * @param {String} label The label to check for a duplicate match.
     * @returns {Boolean} True if the specified label is a duplicate.
     */
    var isDuplicatePropertyLabel = function (label) {
        var key;
        for (key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (properties[key] === label) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Returns all the properties for this prompt.
     * @returns {*}
     */
    that.getProperties = function () {
        return properties;
    };

    /**
     * Returns the property label stored under the key or null if the key is
     * invalid.
     * @param key {*} The key that mapped to the value that will be returned.
     * @returns {String|null}
     */
    that.getProperty = function (key) {
        return (properties[key] !== undefined) ? properties[key] : null;
    };

    /**
     * Returns minimum value allowed for the current prompt's response, or null
     * if the minimum value is undefined.
     * @return {Number|null} Minimum value allowed for the current prompt's
     * response, or null if undefined.
     */
    that.getMinValue = function () {
        return that.getProperty("min");
    };

    /**
     * Returns maximum value allowed for the current prompt's response, or null
     * if the maximum value is undefined.
     * @return {Number|null} Maximum value allowed for the current prompt's
     * response, or null if undefined.
     */
    that.getMaxValue = function () {
        return that.getProperty("max");
    };

    /**
     * Adds a new property to this prompt. If the property label already exists,
     * then the method will have no side effects and will return false. The
     * order of label and key seems unusual but is correct since mostly the
     * function will be called without the key value specified.
     */
    that.addProperty = function (label, key) {
        //By default, property key is the index of the array.
        key = (key !== undefined) ? key : numProperties;

        if (!isDuplicatePropertyLabel(label) && properties[key] === undefined) {
            properties[key] = label;
            customPromptPropertyVault.addCustomProperty(key, label);
            numProperties += 1;
            return true;
        }
        return false;
    };

    that.getCampaignURN = function () {
        return campaignModel.getURN();
    };

    that.getSurveyID = function () {
        return surveyModel.getID();
    };

    /**
     * Returns the ID of the current prompt.
     * @return The ID of the current prompt.
     */
    that.getID = function () {
        return promptData.id;
    };

    /**
     * Returns the conditional statement associated with the current prompt.
     */
    that.getCondition = function () {
        return condition;
    };

    /**
     * Returns the type of the current prompt.
     * @return the type of the current prompt.
     */
    that.getType = function () {
        return promptData.prompttype;
    };

    /**
     * Returns text related to this prompt. If prompt text is undefined, then an
     * empty string will be returned.
     */
    that.getText = function () {
        return promptData.prompttext || "";
    };

    /**
     * Returns true if the prompt may be skipped.
     * @return true if the prompt may be skipped.
     */
    that.isSkippable = function () {
        return promptData.skippable === "true";
    };

    /**
     * Returns the label that should be displayed inside the skip button.
     */
    that.getSkipLabel = function () {
        return promptData.skiplabel;
    };

    /**
     * Returns the default value for this prompt.
     * @return {Number|null} Default value for the current prompt's response, or
     * null if undefined.
     */
    that.getDefaultValue = function () {
        //Access the default value of the prompt with array accessing schema
        //in order to bypass JS keyword use 'default'.
        return (promptData.defaultvalue !== undefined) ? promptData.defaultvalue : null;
    };

    /**
     * Returns the current custom prompt property vault associated with the
     * current prompt.
     * @type {CustomPromptPropertyVault}
     */
    that.getTestCustomPromptPropertyVault = function () {
        return customPromptPropertyVault;
    };

    /*
     * Initialization: Populates the list of both specified and custom
     * properties.
     */
    (function () {

        //Initialize the custom prompt property vault so we can access the
        //custom properties associated with this prompt.
        if (customPromptPropertyVault === null) {
            customPromptPropertyVault = CustomPromptPropertyVault(that);
        }

        //Stores a temporary list of property objects to be mapped to an object.
        var propertyList = [],
            i,
            numSpecifiedProperties,
            customProperties,
            customProperty;

        //If the prompt doesn't have any properties, then set property list to
        //an empty list.
        if (!promptData.properties || !promptData.properties.property) {
            propertyList = [];

        //If there is only one property specified, then create an array with a
        //single property.
        } else if (!promptData.properties.property.length) {
            propertyList = [promptData.properties.property];

        //If the prompt contains several properties, just assign the list to the
        //properties list.
        } else {
            propertyList = promptData.properties.property;
        }

        //Add all the properties read from the JSON into an object that maps
        //keys to labels.
        numSpecifiedProperties = propertyList.length;
        for (i = 0; i < numSpecifiedProperties; i += 1) {
            properties[propertyList[i].key] = propertyList[i].label;
        }
        numProperties += numSpecifiedProperties;

        //Add the custom properties previously saved.
        customProperties = customPromptPropertyVault.getCustomProperties();
        for (customProperty in customProperties) {
            if (customProperties.hasOwnProperty(customProperty)) {
                properties[customProperty.key] = customProperty.label;
                numProperties += 1;
            }
        }

        //Since in XML we can't write '<' or '>', it's written as &lt; and &gt;
        //and since PEG.js expects the mathematical symbols, we need to do this
        //conversion here if a condition is specified for this survey.
        //See GitHub issue #141 for more details.
        if (promptData.condition !== undefined) {
            condition = promptData.condition;
            condition = condition.replace(/&gt;/g, ">");
            condition = condition.replace(/&lt;/g, "<");
        }

    }());

    return that;
};