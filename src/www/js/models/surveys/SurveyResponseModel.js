/**
 * The class represents the responses gathered from the user for a particular
 * survey. Below are the primary responsibilities of this object:
 *
 * (1) Recorder user responses in the form of promptID -> user response.
 * (2) Output response object in the format that can be accepted by the ohmage
 * server.
 * (3) The object should be able to completely be saved in local storage and
 * then restored from a stored object. This will enable users to save the
 * response until they have Internet connection to upload their response.
 *
 * @author Zorayr Khalapyan
 * @param {String} surveyID The ID of the survey that is associated with this
 * response.
 * @param {String} uuid The unique identifier for this survey response.
 * @param {String} campaignURN The URN of the campaign associated with
 * this survey.
 * @constructor
 */
var SurveyResponseModel = (function () {
    "use strict";

    /**
     * Enumeration object that describes location status.
     */
    var LOCATION_STATUS = {
        UNAVAILABLE : "unavailable",
        VALID       : "valid",
        INACCURATE  : 'inaccurate',
        STALE       : 'stale'
    };

    /**
     * Value tag that indicates skipped prompt response value.
     */
    var SKIPPED_PROMPT_VALUE = "SKIPPED";

    /**
     * Value tag that indicates not displayed prompt response value.
     */
    var NOT_DISPLAYED_PROMPT_VALUE = "NOT_DISPLAYED";

    return function (surveyID, campaignURN, surveyResponseUUID) {
        var that = {};

        /**
         * Working data of the survey response. Saving and restoring surveys
         * from local storage will only save and restore this data object.
         */
        var data = {};

        /**
         * An optional variable that associates this survey response with the
         * surveys' campaign. This value should be used to create a Survey
         * object from a SurveyResponseModel object.
         */
        data.campaign_urn = campaignURN;

        /**
         * Initially, location status is set to unavailable. This should change
         * after invoking acquireLocation(..), or setLocation(..).
         */
        data.location_status = LOCATION_STATUS.UNAVAILABLE;

        /**
         * A UUID unique to this survey response.
         */
        data.survey_key = surveyResponseUUID || UUIDGen.generate();

        /**
         * A string defining a survey in the campaign's associated configuration
         * file at the XPath /surveys/survey/id.
         */
        data.survey_id = surveyID;

        /**
         * A string representing a standard time zone.
         */
        data.timezone = jstz.determine_timezone().name();

        /**
         * An int specifying the number of milliseconds since the epoch.
         * This value will be set on survey response submission.
         */
        data.time = null;

        /**
         * An array composed of prompt responses and/or repeatable sets. By default
         * user has no responses. This object is not to be confused with the
         * responses object that will be submitted to the server.
         */
        data.recordedUserResponses = {};

        data.photoPrompt = {};

        /**
         * An object with variable properties that describes the survey's launch
         * context. See the trigger framework page for a description of the object's
         * contents. The object must contain the property launch_time.
         */
        data.survey_launch_context = {
            launch_time     : new Date().getTime(),
            launch_timezone : jstz.determine_timezone().name(),
            active_triggers : []
        };

        /**
         * An object for housing location data.
         */
        data.location = null;

        /**
         * Returns true if the location has been set.
         *
         * @returns {Boolean} true if the location for this survey response has
         * been set; false, otherwise.
         */
        that.isLocationAvailable = function () {
            return data.location !== null;
        };

        that.setLocation = function (location) {
            data.location_status = LOCATION_STATUS.VALID;
            data.location = location;
        };

        /**
         * Invokes the geolocation API in order to get the current GPS location for
         * this survey response. Callback will be invoked on either error or success
         * with a single boolean parameter success/true, error/false.
         */
        that.acquireLocation = function (onGPSAcquiredCallback) {

            data.location_status = LOCATION_STATUS.UNAVAILABLE;
            data.location = null;

            mwf.touch.geolocation.getPosition(

                function (pos) {

                    //Create a new location object to house the location data.
                    data.location = {};

                    //Currently, there is no way of determining the geolocation
                    //provider but it's almost always going to be from the GPS
                    //device.
                    data.location.provider = 'GPS';

                    data.location.latitude  = pos.latitude;
                    data.location.longitude = pos.longitude;
                    data.location.accuracy  = pos.accuracy;

                    //A string describing location status. Must be one of:
                    //unavailable, valid, inaccurate, stale.
                    data.location_status = LOCATION_STATUS.VALID;

                    //A long value representing the milliseconds since the epoch
                    //at which time this location value was collected.
                    data.location.time = new Date().getTime();

                    //The timezone ID for the timezone of the device when this
                    //location value was collected.
                    data.location.timezone = jstz.determine_timezone().name();

                    if (onGPSAcquiredCallback) {
                        onGPSAcquiredCallback(true);
                    }
                },

                //On error, delete the location object if any and also set an
                //appropriate location status.
                function (message) {

                    data.location = null;
                    data.location_status = LOCATION_STATUS.UNAVAILABLE;

                    that.save();

                    if (onGPSAcquiredCallback) {
                        onGPSAcquiredCallback(false);
                    }

                }
            );
        };

        /**
         * Adds a response to the current response list.
         *
         * @param promptID {String} The ID of the prompt associated with the
         * prompt.
         * @param responseValue {String} The response gathered from the user.
         * @param isImageResponse {Boolean} If true, the response will be
         * treated as a recorded image UUID.
         */
        that.recordUserResponse = function (promptID, responseValue, isImageResponse) {
            data.recordedUserResponses[promptID] = responseValue;
            if (isImageResponse) {
                data.photoPrompt[promptID] = true;
            }
        };

        /**
         * Marks the specified prompt as skipped.
         */
        that.setPromptSkipped = function (promptID) {
            that.recordUserResponse(promptID, SKIPPED_PROMPT_VALUE, false);
        };

        /**
         * Marks the specified prompt as not displayed.
         */
        that.setPromptNotDisplayed = function (promptID) {
            that.recordUserResponse(promptID, NOT_DISPLAYED_PROMPT_VALUE, false);
        };

        that.submit = function () {
            data.time = new Date().getTime();
            SurveyResponseStoreModel.saveSurveyResponse(that);
        };

        that.getPhotoResponses = function () {
            return data.photoPrompt;
        };

        /**
         * Returns data that can be uploaded to the survey as response data.
         *
         * The idea here is that during response collection, responses is
         * treated as an object out of the idea that JavaScript does not support
         * associative arrays and in order to search through a list of objects,
         * it would have taken O(n) time. Instead, we use an object which has
         * key-value pair access time of O(1), but needs some extra conversion
         * before getting uploaded to the survey.
         */
        that.getUploadData = function () {

            var promptResponses = [],
                images = {},
                promptID,
                base64Image,
                userResponse;

            for (promptID in data.recordedUserResponses) {
                if (data.recordedUserResponses.hasOwnProperty(promptID)) {
                    userResponse = data.recordedUserResponses[promptID];

                    promptResponses.push({
                        prompt_id : promptID,
                        value     : userResponse
                    });

                    if (data.photoPrompt[promptID]) {
                        base64Image = ImageStoreModel.getImage(userResponse);
                        images[userResponse] = base64Image.substring(base64Image.indexOf(',') + 1);
                    }
                }
            }

            var surveyResponse = {
                survey_key           : data.survey_key,
                time                 : data.time,
                timezone             : data.timezone,
                location_status      : data.location_status,
                survey_id            : data.survey_id,
                survey_launch_context: data.survey_launch_context,

                //UPDATE: Seems like they removed this from the Wiki docs.
                //Single Prompt Response is a JSON object and not an array.
                //Not sure why so, but its noted by the documentation.
                //responses: (responses.length == 1)? responses[0]:responses
                responses: promptResponses
            };

            if (data.location !== null) {
                surveyResponse.location = data.location;
            }

            return {"responses" : surveyResponse, "images": images};
        };

        /**
         * Returns the currently gathered user responses in a map form
         * i.e. {prompt_id : prompt_value}. This method is used as the data
         * source for conditional prompt evaluation.
         */
        that.getResponses = function () {
            return data.recordedUserResponses;
        };

        /**
         * Returns the recorded response value for the given prompt,
         * or null if not specified.
         */
        that.getResponse = function (promptID) {
            return data.recordedUserResponses[promptID] || null;
        };

        /**
         * Returns the current working data. The returned object contains all
         * response identifying information including campaign URN, location,
         * location status, responses, survey_id, survey_key, survey launch
         * context, time, and timezone. This is the object that should be saved
         * in localStorage to later restore the current survey response object.
         */
        that.getData = function () {
            return data;
        };

        /**
         * Replaces the current working data. This is used for restoring a
         * survey response from an external storage.
         */
        that.setData = function (newData) {
            data = newData;
        };

        that.getLocationStatus = function () {
            return data.location_status;
        };

        that.getLocation = function () {
            return data.location;
        };

        that.getSurveyID = function () {
            return data.survey_id;
        };

        that.getSurveyKey = function () {
            return data.survey_key;
        };

        that.isSubmitted = function () {
            return (data.time === null) ? false : true;
        };

        that.getSubmitDateString = function () {
            return that.getSubmitDate().toString().substr(0, 24);
        };

        /**
         * Returns the date when the survey response was submitted.
         * @returns {Date}
         */
        that.getSubmitDate = function () {
            return new Date(data.time);
        };

        that.getCampaignURN = function () {
            return campaignURN;
        };

        that.getSkippedPromptValue = function () {
            return SKIPPED_PROMPT_VALUE;
        };

        that.getNotDisplayedPromptValue = function () {
            return NOT_DISPLAYED_PROMPT_VALUE;
        };

        return that;
    };

}());