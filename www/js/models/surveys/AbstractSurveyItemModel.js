/**
 * @author Zorayr Khalapyan
 * @version 4/12/13
 * @constructor
 */
var AbstractSurveyItemModel = function (itemData, surveyModel, campaignModel) {
    "use strict";
    var that = {};

    /**
     * Stores the conditional statement associated with the current prompt.
     * @type {String | null}
     */
    var condition = null;

    that.getID = function () {
        return itemData.id;
    };

    that.getSurveyID = function () {
        return surveyModel.getID();
    };

    that.getCampaignURN = function () {
        return campaignModel.getURN();
    };

    /**
     * Returns the conditional statement associated with the current survey
     * item.
     * @returns {String} Conditional statement for the survey item.
     */
    that.getCondition = function () {
        return condition;
    };

    //Since in XML we can't write '<' or '>', it's written as &lt; and &gt;
    //and since PEG.js expects the mathematical symbols, we need to do this
    //conversion here if a condition is specified for this survey item.
    //See GitHub issue #141 for more details.
    if (itemData.condition !== undefined) {
        condition = itemData.condition;
        condition = condition.replace(/&gt;/g, ">");
        condition = condition.replace(/&lt;/g, "<");
    }

    return that;
};
