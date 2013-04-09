/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */

var CampaignModel = function (campaignURN) {
    "use strict";
    var that = {};

    var metadata = LocalMap("all-campaigns").get(campaignURN);
    var campaign = LocalMap("campaign-configurations").get(campaignURN);
    var surveys = {};


    /**
     * Returns surveys associated with this campaign.
     * @return {*} An object that maps a survey ID to survey model.
     */
    that.getSurveys = function () {
        return surveys;
    };

    /**
     * Returns true if the current campaign is in running state.
     * @returns {Boolean} true if the current campaign is in running state; false, otherwise.
     */
    that.isRunning = function () {
        return metadata.running_state === 'running';
    };

    /**
     * Returns a survey associated with the provided survey ID. If the campaign,
     * doesn't contain a survey with the provided ID, a null value will be
     * returned.
     * @returns {SurveyModel} The survey associated with the current campaign model
     * with the specified ID.
     */
    that.getSurvey = function (id) {
        return surveys[id] || null;
    };

    /**
     * Returns the name of the current campaign.
     * @returns {String}
     */
    that.getName = function () {
        return metadata.name;
    };

    /**
     * Returns the URN for this campaign.
     * @returns {String}
     */
    that.getURN = function () {
        return campaignURN;
    };

    /**
     * Returns the campaign's creation timestamp.
     */
    that.getCreationTimestamp = function () {
        return metadata.creation_timestamp;
    };

    /**
     * Returns the description for this campaign.
     * @returns {string}
     */
    that.getDescription = function () {
        return metadata.description;
    };

    //Initializing the  model: extract the surveys from the campaign and map IDs
    //to survey model.
    (function () {

        //Get the list of surveys from the campaign JSON object.
        var surveysSpec  = campaign.surveys.survey;

        //If survey spec is returned as a single item, then go ahead and place
        //it in an array. This is a kind of a dirty fix, if you have any
        //better ideas of approaching the situation - please be my guest.
        var surveyList = (!surveysSpec.length) ? [surveysSpec] : surveysSpec;

        var i;

        //Iterate through the list of retrieved surveys. If a ID match is found,
        //return the survey.
        for (i = 0; i < surveyList.length; i += 1) {
            surveys[surveyList[i].id] = SurveyModel(surveyList[i], that);
        }

    }());

    return that;
};
