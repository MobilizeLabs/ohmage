/**
 *
 * @author Zorayr Khalapyan
 * @param surveyData The JSON survey data.
 * @param campaignModel Campaign model associated with the survey.
 * @returns {{}}
 * @constructor
 */
var SurveyModel = function (surveyData, campaignModel) {
    "use strict";

    var that = {};

    /**
     * Stores an array of items in the order that was defined by the JSON.
     * @type {Array}
     */
    var itemsList = null;

    /**
     * Stores a mapping between items IDs and item models. This object is for
     * fast access using the ID key as opposed to iterating through the array
     * to find a key match.
     * @type {*}
     */
    var itemsMap = null;

    /**
     * Adds an item  model to both the item list and the item mapping.
     * @param itemModel The JSON item specification (i.e. extracted object).
     */
    var addItemModel = function (itemModel) {
        //Store in both the array and the object. Remember there is only one
        //instance of the item model so we are not adding too much overhead.
        itemsList.push(itemModel);
        itemsMap[itemModel.getID()] = itemModel;
    };

    /**
     *
     * @param promptData
     */
    var addPromptItem = function (promptData) {
        addItemModel(PromptModel(promptData, that, campaignModel));
    };

    /**
     *
     * @param messageData
     */
    var addMessageItem = function (messageData) {
        addItemModel(MessageModel(messageData, that, campaignModel));
    };

    /**
     * Populates the items list and items map.
     */
    var initializeItems = function () {
        itemsList = [];
        itemsMap = {};

        var prompts = surveyData.contentlist.prompt,
            i;

        if (prompts.length) {
            for (i = 0; i < prompts.length; i += 1) {
                addPromptItem(prompts[i]);
            }
        } else {
            addPromptItem(prompts);
        }
    };

    /**
     * Returns the title of the current survey.
     * @returns {String} Current survey's title, or empty string if undefined.
     */
    that.getTitle = function () {
        return surveyData.title || "";
    };

    /**
     * Returns the description of the current survey.
     * @returns {String} Current survey's description, or empty string if undefined.
     */
    that.getDescription = function () {
        return surveyData.description || "";
    };

    /**
     * Returns the ID of the current survey.
     * @returns {String} Current survey's ID.
     */
    that.getID = function () {
        return surveyData.id;
    };

    /**
     * Returns a reference to this survey's campaign model.
     * @returns {CampaignModel} Reference to this survey's campaign.
     */
    that.getCampaign = function () {
        return campaignModel;
    };

    /**
     * Returns an array of item objects associated with this survey.
     * @returns {Array}
     */
    that.getItems = function () {
        //Lazy initialization.
        if (itemsList === null) {
            initializeItems();
        }
        return itemsList;
    };

    /**
     * Returns an item with the specified ID.
     * @param itemID ID of the item to return.
     * @returns {PromptModel|MessageModel|null} Survey item model or null.
     */
    that.getItem = function (itemID) {
        //Lazy initialization.
        if (itemsMap === null) {
            initializeItems();
        }
        return itemsMap[itemID] || null;
    };

    return that;
};
