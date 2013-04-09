var SurveyModel = function (surveyData, campaign) {
    "use strict";

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var that = {};

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
     * Returns a reference to this survey's campaign.
     * @returns {CampaignModel} Reference to this survey's campaign.
     */
    that.getCampaign = function () {
        return campaign;
    };

    /**
     * Returns an array of prompt objects associated with this survey.
     * @returns {Array}
     */
    that.getPrompts = function () {
        var promptList = surveyData.contentlist.prompt,
            prompts = [],
            i;
        if (promptList.length) {
            for (i = 0; i < promptList.length; i += 1) {
                prompts[i] = new Prompt(promptList[i], that, campaign);
            }
        } else {
            prompts.push(new Prompt(promptList, that, campaign));
        }
        return prompts;
    };

    /**
     * Returns a prompt, given a prompt ID.
     * @param id ID of the prompt to return.
     * @returns Prompt object or null.
     */
    that.getPrompt = function (id) {
        var prompts = that.getPrompts(),
            i;
        for (i = 0; i < prompts.length; i += 1) {
            if (prompts[i].getID() === id) {
                return prompts[i];
            }
        }
        return null;
    };

    return that;
}
