/**
 * The class represents the responses gathered from the user for a particular
 * survey.
 *
 * @author Zorayr Khalapyan
 * @param id
 * @param uuid The unique identifier for this survey response.
 * @param urn The URN of the campaign associated with this survey.
 */
function SurveyResponseModel(id, uuid, urn){

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var self = {};

    /**
     * Working data of the survey response. Saving and restoring surveys from
     * local storage will only save and restore this data object.
     */
    self.data = {};

    /**
     * An optional variable that associates this survey response with the
     * surveys' comapaign. This value should be used to create a Survey object
     * from a SurveyResponseModel object.
     */
    self.data.campaign_urn = urn;

    /**
     * Initially, location status is set to unavailable. This should change
     * after invoking setLocation(..), or manuallySetLocation(..).
     */
    self.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;

    /**
     * A UUID unique to this survey response.
     */
    self.data.survey_key = uuid;

    /**
     * A string defining a survey in the campaign's associated configuration
     * file at the XPath /surveys/survey/id.
     */
    self.data.survey_id = id;

    /**
     * A string representing a standard time zone.
     */
    self.data.timezone = jstz.determine_timezone().name();

    /**
     * An int specifying the number of milliseconds since the epoch.
     * This value will be set on survey response submission.
     */
    self.data.time = null;

    /**
     * An array composed of prompt responses and/or repeatable sets. By default
     * user has no responses. This object is not to be confused with the
     * responses object that will be submited to the server.
     */
    self.data._responses = {};

    /**
     * An object with variable properties that describes the survey's launch
     * context. See the trigger framework page for a description of the object's
     * contents. The object must contain the property launch_time.
     */
    self.data.survey_launch_context = {
        launch_time     : new Date().getTime(),
        launch_timezone : jstz.determine_timezone().name(),
        active_triggers : []
    };

    /**
     * An object for housing location data.
     */
    self.data.location = null;

    /**
     * Returns true if the location has been set.
     *
     * @return true if the location for this survey response has been set.
     */
    self.isLocationAvailable = function(){
        return self.data.location != null;
    };

    self.manuallySetLocation = function(location){
        self.data.location_status = SurveyResponseModel.LocationStatus.VALID;
        self.data.location = location;
    }

    /**
     * Invokes the geolocation API in order to get the current GPS location for
     * this survey response. Callback will be invoked on either error or success
     * with a single boolean parameter success/true, error/false.
     */
    self.setLocation = function(callback){

        self.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;
        self.data.location = null;
        
        mwf.touch.geolocation.getPosition(

            function(pos){

                //Create a new location object to house
                //the location data.
                self.data.location = {};

                //Currently, there is no way of determining the geolocation
                //provider but it's almost always going to be from the GPS
                //device.
                self.data.location.provider = 'GPS';

                self.data.location.latitude  = pos.latitude;
                self.data.location.longitude = pos.longitude;
                self.data.location.accuracy  = pos.accuracy;

                //A string describing location status. Must be one of:
                //unavailable, valid, inaccurate, stale.
                self.data.location_status = SurveyResponseModel.LocationStatus.VALID;

                //A long value representing the milliseconds since the epoch at
                //hich time this location value was collected.
                self.data.location.time = new Date().getTime();

                //The timezone ID for the timezone of the device when this
                //location value was collected.
                self.data.location.timezone = jstz.determine_timezone().name();

                self.save();

                if(callback){
                    callback(true);
                }
            },

            //On error, delete the location object if any and also set an
            //appropriate location status.
            function(message){

                self.data.location = null;
                self.data.location_status = SurveyResponseModel.LocationStatus.UNAVAILABLE;

                self.save();

                if(callback){
                    callback(false);
                }

            }
        );
    };

    /**
     * Adds a response to the current response list.
     */
    self.respond = function(promptID, value, isImage){
        self.data._responses[promptID] = {"value": value, "isImage": isImage};
        self.save();
    };

    /**
     * Marks the specified prompt as skipped.
     */
    self.promptSkipped = function(promptID){
        self.respond(promptID, SurveyResponseModel.SKIPPED_PROMPT_VALUE, false);
    };
    
    /**
     * Marks the specified prompt as not displayed.
     */
    self.promptNotDisplayed = function(promptID){
        self.respond(promptID, SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE, false);
    };

    self.submit = function(callback){
        //Save the submit time.
        self.data.time = new Date().getTime();

        //Save the survey in the pool.
        self.save();

        if(typeof(callback) !== "undefined"){
            callback();
        }
    };

    /**
     * Returns UUIDs of all images associated with this response.
     * @return Array of UUIDs.
     */
    self.getImageIds = function(){
        var images = [];
        for (var promptID in self.data._responses) {
            var response = self.data._responses[promptID];
            if(response.isImage){
                images.push(response.value);
            }
        }
        return images;
    };

    /**
     * Returns data that can be uploaded to the surver as response data.
     */
    self.getUploadData = function(){

        //The idea here is that during response collection, responses is treated
        //as an object out of the idea that JavaScript does not support
        //associative arrays and in order to search through a list of objects,
        //it would have taken O(n) time. Instead, we use an object which has
        //key-value pair access time of O(1), but needs some extra conversion
        //before getting uploaded to the surver.
        var responses = [];

        var images = {};

        for (var promptID in self.data._responses) {
            var response = self.data._responses[promptID];
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
            survey_key           : self.data.survey_key,
            time                 : self.data.time,
            timezone             : self.data.timezone,
            location_status      : self.data.location_status,
            survey_id            : self.data.survey_id,
            survey_launch_context: self.data.survey_launch_context,

            //UPDATE: Seems like they removed this from the Wiki docs.
            //Single Prompt Response is a JSON object and not an array. Not sure
            //why so, but its noted by the documentation.
            //responses: (responses.length == 1)? responses[0]:responses

            responses: responses
        }

        //Only set location, if available.
        if(self.data.location !== null){
            surveyResponse.location = self.data.location;
        }

        return {"responses" : surveyResponse, "images": images};
    };

    /**
     * Replaces the current working data. This is used for restoring a survey
     * response from an external storage.
     */
    self.setData = function(data){
        self.data = data;
    };

    /**
     * Returns the currently gathered user responses in a map form
     * i.e. {prompt_id : prompt_value}. This method is used as the data source
     * for conditional prompt evaluation.
     */
    self.getResponses = function(){
        var data = {};
        for(var promptID in self.data._responses){
            data[promptID] = self.data._responses[promptID].value;
        }
        return data;
    };

    /**
     * Saves the current response in the response pool.
     */
    self.save = function(){
        SurveyResponseModel.saveSurveyResponse(self);
    };


    /**
     * Returns the recorded response value for the given prompt,
     * or null if not specified.
     */
    self.getResponse = function(promptID){
        return (self.data._responses[promptID])? self.data._responses[promptID].value : null;
    };

    /**
     * Returns the current working data. The returned object contains all
     * response identifiying information including campaign URN, location,
     * location status, responses, survey_id, survey_key, survey launch context,
     * time, and timezone.
     */
    self.getData = function(){
        return self.data;
    };
    
    self.getLocationStatus = function(){
        return self.data.location_status;
    };
    
    self.getLocation = function(){
        return self.data.location;
    };
    
    self.getSurveyID = function(){
      return self.data.survey_id;
    };

    self.getSurveyKey = function(){
        return self.data.survey_key;
    };

    self.isSubmitted = function(){
        return (self.data.time === null)? false : true;
    };
    
    self.getSubmitDateString = function(){
        return self.getSubmitDate().toString().substr(0, 24);
    };
    
    self.getSubmitDate = function(){
        return new Date(self.data.time);
    };

    self.getCampaignURN = function(){
        return self.data.campaign_urn;
    };
    
    return self;
}


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
SurveyResponseModel.restoreSurveyResponse = function(survey_key){
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
SurveyResponseModel.deleteSurveyResponse = function(surveyResponseModel){

    //Delete response images.
    var images = surveyResponseModel.getImageIds();
    for(var i = 0; i < images.length; i++){
        SurveyResponseModel.deleteImage(images[i]);
    }

    //Delete the response from the local storage map.
    SurveyResponseModel.responses.release(surveyResponseModel.getSurveyKey());
};


/**
 * Saves the provided image URI and returns a UUID that mapps to that image's
 * URI.
 */
SurveyResponseModel.saveImage = function(imageURI)
{
    var images = SurveyResponseModel.getImages();
    var uuid = UUIDGen.generate();

    images[uuid] = imageURI;

    SurveyResponseModel.setImages(images);

    return uuid;
};

SurveyResponseModel.getImage = function(uuid){
    return SurveyResponseModel.getImages()[uuid];
};

SurveyResponseModel.deleteImage = function(uuid){
    var images = SurveyResponseModel.getImages();
    if(images[uuid])
        delete images[uuid];
    SurveyResponseModel.setImages(images);
};

SurveyResponseModel.setImages = function(images){
    localStorage.images = JSON.stringify(images);
};

SurveyResponseModel.getImages = function(){
    return (localStorage.images)? JSON.parse(localStorage.images) : {};
};

/**
 * Returns all pending survey responses.
 */
SurveyResponseModel.getPendingResponses = function(){
    var pendingResponses = {};
    for(var uuid in SurveyResponseModel.responses.getMap()){
        var response = SurveyResponseModel.restoreSurveyResponse(uuid);
        //Skip survey responses that were not completed.
        if(!response.isSubmitted()){
            continue;
        }
        var campaign = new Campaign(response.getCampaignURN());
        var survey = campaign.getSurvey(response.getSurveyID());
        pendingResponses[uuid] = {'survey': survey, 'response': response};
    }
    return pendingResponses;
}

/**
 * Returns the number of survey responses that have not been submitted.
 */
SurveyResponseModel.getUploadQueueSize = function(){
    var size = 0;
    for(var uuid in SurveyResponseModel.responses.getMap()){
        var response = SurveyResponseModel.restoreSurveyResponse(uuid);
        if(response.isSubmitted()){
            size++;
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
