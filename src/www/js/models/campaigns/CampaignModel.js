/**
 * @author Zorayr Khalapyan
 * @version 4/5/13
 */

var CampaignModel = function (campaignURN) {
    "use strict";
    var that = {};

    var metadata = (new LocalMap("all-campaigns").get(campaignURN));
    var campaign = (new LocalMap("campaign-configurations")).get(campaignURN);

    /**
     * Returns surveys associated with this campaign.
     */
    that.getSurveys = function () {

        //Get the list of surveys from the campaign.
        var surveys  = campaign.surveys.survey;

        //If survey is returned as a single item, then go ahead and place
        //it in an array. This is a kind of a dirty fix, if you have any
        //better ideas of approaching the situation - please be my guest.
        return (!surveys.length) ? [surveys] : surveys;
    };

    that.isRunning = function () {
        return metadata.running_state === 'running';
    };

    /**
     * Returns a survey associated with the provided survey ID. If the campaign,
     * doesn't contain a survey with the provided ID, a null value will be
     * returned.
     */
    that.getSurvey = function (id) {

        //Get a list of all the possible surveys.
        var surveys = that.getSurveys(), i;

        //Iterate through the list of retrieved surveys. If a ID match is found,
        //return the survey.
        for (i = 0; i < surveys.length; i += 1) {
            if (surveys[i].id === id) {
                return SurveyModel(surveys[i], that);
            }
        }

        //If no match was found, return null.
        return null;
    };

    /**
     * Returns the name of the current campaign.
     */
    that.getName = function () {
        return metadata.name;
    };

    /**
     * Returns the URN for this campaign.
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
     */
    that.getDescription = function () {
        return metadata.description;
    };

    return that;
};
