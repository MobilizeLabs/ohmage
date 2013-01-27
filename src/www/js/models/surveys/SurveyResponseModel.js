/**
 * The class represents the responses gathered from the user for a particular
 * survey.
 *
 * @author Zorayr Khalapyan
 * @param id
 * @param uuid The unique identifier for this survey response.
 * @param urn The URN of the campaign associated with this survey.
 */
var SurveyResponseModel = function (id, uuid, urn){

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var that = {};

    /**
     * Working data of the survey response. Saving and restoring surveys from
     * local storage will only save and restore this data object.
     */
    that.data = {};

    /**
     * An optional variable that associates this survey response with the
     * surveys' comapaign. This value should be used to create a Survey object
     * from a SurveyResponseModel object.
     */
    that.data.campaign_urn = urn;

    /**
     * Initially, location status is set to unavailable. This should change
     * after invoking setLocation(..), or manuallySetLocation(..).
     */
    that.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;

    /**
     * A UUID unique to this survey response.
     */
    that.data.survey_key = uuid;

    /**
     * A string defining a survey in the campaign's associated configuration
     * file at the XPath /surveys/survey/id.
     */
    that.data.survey_id = id;

    /**
     * A string representing a standard time zone.
     */
    that.data.timezone = jstz.determine_timezone().name();

    /**
     * An int specifying the number of milliseconds since the epoch.
     * This value will be set on survey response submission.
     */
    that.data.time = null;

    /**
     * An array composed of prompt responses and/or repeatable sets. By default
     * user has no responses. This object is not to be confused with the
     * responses object that will be submited to the server.
     */
    that.data._responses = {};

    /**
     * An object with variable properties that describes the survey's launch
     * context. See the trigger framework page for a description of the object's
     * contents. The object must contain the property launch_time.
     */
    that.data.survey_launch_context = {
        launch_time     : new Date().getTime(),
        launch_timezone : jstz.determine_timezone().name(),
        active_triggers : []
    };

    /**
     * An object for housing location data.
     */
    that.data.location = null;

    /**
     * Returns true if the location has been set.
     *
     * @return true if the location for this survey response has been set.
     */
    that.isLocationAvailable = function () {
        return that.data.location !== null;
    };

    that.manuallySetLocation = function (location) {
        that.data.location_status = SurveyResponseModel.LocationStatus.VALID;
        that.data.location = location;
    };

    /**
     * Invokes the geolocation API in order to get the current GPS location for
     * this survey response. Callback will be invoked on either error or success
     * with a single boolean parameter success/true, error/false.
     */
    that.setLocation = function (callback) {

        that.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;
        that.data.location = null;

        mwf.touch.geolocation.getPosition(

            function (pos) {

                //Create a new location object to house
                //the location data.
                that.data.location = {};

                //Currently, there is no way of determining the geolocation
                //provider but it's almost always going to be from the GPS
                //device.
                that.data.location.provider = 'GPS';

                that.data.location.latitude  = pos.latitude;
                that.data.location.longitude = pos.longitude;
                that.data.location.accuracy  = pos.accuracy;

                //A string describing location status. Must be one of:
                //unavailable, valid, inaccurate, stale.
                that.data.location_status = SurveyResponseModel.LocationStatus.VALID;

                //A long value representing the milliseconds since the epoch at
                //hich time this location value was collected.
                that.data.location.time = new Date().getTime();

                //The timezone ID for the timezone of the device when this
                //location value was collected.
                that.data.location.timezone = jstz.determine_timezone().name();

                that.save();

                if(callback){
                    callback(true);
                }
            },

            //On error, delete the location object if any and also set an
            //appropriate location status.
            function(message) {

                that.data.location = null;
                that.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;

                that.save();

                if (callback) {
                    callback(false);
                }

            }
        );
    };

    /**
     * Adds a response to the current response list.
     */
    that.respond = function (promptID, value, isImage) {
        that.data._responses[promptID] = {"value": value, "isImage": isImage};
        that.save();
    };

    /**
     * Marks the specified prompt as skipped.
     */
    that.promptSkipped = function (promptID) {
        that.respond(promptID, SurveyResponseModel.SKIPPED_PROMPT_VALUE, false);
    };

    /**
     * Marks the specified prompt as not displayed.
     */
    that.promptNotDisplayed = function (promptID) {
        that.respond(promptID, SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE, false);
    };

    that.submit = function (callback) {
        //Save the submit time.
        that.data.time = new Date().getTime();

        //Save the survey in the pool.
        that.save();

        if(typeof(callback) !== "undefined"){
            callback();
        }
    };

    /**
     * Returns UUIDs of all images associated with this response.
     * @return Array of UUIDs.
     */
    that.getImageIds = function () {
        var images = [], promptID, response;
        for (promptID in that.data._responses) {
            response = that.data._responses[promptID];
            if (response.isImage) {
                images.push(response.value);
            }
        }
        return images;
    };

    /**
     * Returns data that can be uploaded to the surver as response data.
     */
    that.getUploadData = function () {

        //The idea here is that during response collection, responses is treated
        //as an object out of the idea that JavaScript does not support
        //associative arrays and in order to search through a list of objects,
        //it would have taken O(n) time. Instead, we use an object which has
        //key-value pair access time of O(1), but needs some extra conversion
        //before getting uploaded to the surver.
        var responses = [];

        var images = {}, promptID, response;

        for (promptID in that.data._responses) {
            response = that.data._responses[promptID];
            responses.push({
                prompt_id: promptID,
                value: response.value
            });
            if(response.isImage){
                var base64Image = SurveyResponseModel.getImage(response.value);
                images[response.value] = base64Image.substring(base64Image.indexOf(',') + 1);
            }
        }

        var surveyResponse = {
            survey_key           : that.data.survey_key,
            time                 : that.data.time,
            timezone             : that.data.timezone,
            location_status      : that.data.location_status,
            survey_id            : that.data.survey_id,
            survey_launch_context: that.data.survey_launch_context,

            //UPDATE: Seems like they removed this from the Wiki docs.
            //Single Prompt Response is a JSON object and not an array. Not sure
            //why so, but its noted by the documentation.
            //responses: (responses.length == 1)? responses[0]:responses

            responses: responses
        };

        //Only set location, if available.
        if(that.data.location !== null){
            surveyResponse.location = that.data.location;
        }

        return {"responses" : surveyResponse, "images": images};
    };

    /**
     * Replaces the current working data. This is used for restoring a survey
     * response from an external storage.
     */
    that.setData = function (data) {
        that.data = data;
    };

    /**
     * Returns the currently gathered user responses in a map form
     * i.e. {prompt_id : prompt_value}. This method is used as the data source
     * for conditional prompt evaluation.
     */
    that.getResponses = function () {
        var data = {}, promptID;
        for (promptID in that.data._responses) {
            data[promptID] = that.data._responses[promptID].value;
        }
        return data;
    };

    /**
     * Saves the current response in the response pool.
     */
    that.save = function () {
        SurveyResponseModel.saveSurveyResponse(that);
    };


    /**
     * Returns the recorded response value for the given prompt,
     * or null if not specified.
     */
    that.getResponse = function (promptID) {
        return (that.data._responses[promptID])? that.data._responses[promptID].value : null;
    };

    /**
     * Returns the current working data. The returned object contains all
     * response identifiying information including campaign URN, location,
     * location status, responses, survey_id, survey_key, survey launch context,
     * time, and timezone.
     */
    that.getData = function () {
        return that.data;
    };

    that.getLocationStatus = function () {
        return that.data.location_status;
    };

    that.getLocation = function () {
        return that.data.location;
    };

    that.getSurveyID = function () {
      return that.data.survey_id;
    };

    that.getSurveyKey = function () {
        return that.data.survey_key;
    };

    that.isSubmitted = function () {
        return (that.data.time === null)? false : true;
    };

    that.getSubmitDateString = function () {
        return that.getSubmitDate().toString().substr(0, 24);
    };

    that.getSubmitDate = function () {
        return new Date(that.data.time);
    };

    that.getCampaignURN = function () {
        return that.data.campaign_urn;
    };

    return that;
};


SurveyResponseModel.responses = new LocalMap("suvey-responses");

SurveyResponseModel.init = function(id, urn){
    return new SurveyResponseModel(id, UUIDGen.generate(), urn);
};

SurveyResponseModel.saveSurveyResponse = function(surveyResponseModel){
    SurveyResponseModel.responses.set(surveyResponseModel.getSurveyKey(), surveyResponseModel.getData());
};

/**
 * Enumaration object that describes location status.
 */
SurveyResponseModel.LocationStatus = {
    UNAVAILABLE : "unavailable",
    VALID       : "valid",
    INACCURATE  : 'inaccurate',
    STALE       : 'stale'
};

/**
 * The function restores a stored SurveyResponseModel object.
 */
SurveyResponseModel.restoreSurveyResponse = function (survey_key) {
    var data = SurveyResponseModel.responses.get(survey_key);
    if(data === null){
        return false;
    }
    var surveyResponseModel = new SurveyResponseModel(data.id, data.survey_key, data.campaign_urn);
    surveyResponseModel.setData(data);
    return surveyResponseModel;
};

/**
 * Deletes the survey response with it associated images if any.
 */
SurveyResponseModel.deleteSurveyResponse = function (surveyResponseModel) {

    var images = surveyResponseModel.getImageIds(),
        i;
    for (i = 0; i < images.length; i += 1) {
        SurveyResponseModel.deleteImage(images[i]);
    }

    //Delete the response from the local storage map.
    SurveyResponseModel.responses.release(surveyResponseModel.getSurveyKey());
};


/**
 * Saves the provided image URI and returns a UUID that mapps to that image's
 * URI.
 */
SurveyResponseModel.saveImage = function (imageURI) {
    var images = SurveyResponseModel.getImages();
    var uuid = UUIDGen.generate();

    images[uuid] = imageURI;

    SurveyResponseModel.setImages(images);

    return uuid;
};

SurveyResponseModel.getImage = function (uuid) {
    return SurveyResponseModel.getImages()[uuid];
};

SurveyResponseModel.deleteImage = function (uuid) {
    var images = SurveyResponseModel.getImages();
    if (images[uuid]) {
        delete images[uuid];
    }
    SurveyResponseModel.setImages(images);
};

SurveyResponseModel.setImages = function (images) {
    window.localStorage.images = window.JSON.stringify(images);
};

SurveyResponseModel.getImages = function () {
    return (window.localStorage.images)? window.JSON.parse(window.localStorage.images) : {};
};

/**
 * Returns all pending survey responses.
 */
SurveyResponseModel.getPendingResponses = function () {
    var pendingResponses = {}, uuid, response;
    for (uuid in SurveyResponseModel.responses.getMap()) {
        response = SurveyResponseModel.restoreSurveyResponse(uuid);
        //Skip survey responses that were not completed.
        if (!response.isSubmitted()) {
            continue;
        }
        var campaign = CampaignsModel.getCampaign(response.getCampaignURN());
        var survey = campaign.getSurvey(response.getSurveyID());
        pendingResponses[uuid] = {'survey': survey, 'response': response};
    }
    return pendingResponses;
};

/**
 * Returns the number of survey responses that have not been submitted.
 */
SurveyResponseModel.getUploadQueueSize = function () {
    var size = 0, uuid, response;
    for (uuid in SurveyResponseModel.responses.getMap()) {
        response = SurveyResponseModel.restoreSurveyResponse(uuid);
        if (response.isSubmitted()) {
            size += 1;
        }
    }
    return size;
};

/**
 * Value tag that indicates skipped prompt response value.
 */
SurveyResponseModel.SKIPPED_PROMPT_VALUE = "SKIPPED";

/**
* Value tag that indicates not displayed prompt response value.
*/
SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE = "NOT_DISPLAYED";
