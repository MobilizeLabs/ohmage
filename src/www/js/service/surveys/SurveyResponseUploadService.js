/**
 * SurveyResponseUploadController is responsible for the actual upload of the response
 * data.
 */
var SurveyResponseUploadService = function (surveyModel, surveyResponse) {
    "use strict";
    var that = {};

    /**
     * Compiles and returns an upload package with the current values set in the
     * survey response. In this case, no extra check of validity or availability
     * of GPS location will be done - what you see, is what you get.
     */
    var getResponseData = function () {

        var responseData = surveyResponse.getUploadData();

        var data = {
            campaign_urn               : surveyResponse.getCampaignURN(),
            campaign_creation_timestamp: surveyModel.getCampaign().getCreationTimestamp(),
            surveys                    : JSON.stringify([responseData.responses]),
            images                     : JSON.stringify(responseData.images)
        };

        return data;

    };

    /**
     * Recursively tries to acquire the user's current geolocation until GPS
     * location is successfully acquired or the user chooses to quit trying.
     *
     * @param callback At base case, callback will be invoked with a single
     * boolean parameter indicating the success or failure of acquiring the GPS
     * location i.e. false == user quit or unable to get GPS location.
     */
    var setResponseLocation = function (callback) {

        //Show the spinner while trying to acquire user's GPS location.
        Spinner.show();

        //Start the Geolocation process.
        surveyResponse.acquireLocation(function (success) {

            //On response, hide the spinner.
            Spinner.hide();

            //If the GPS location was successfully set, then invoke the
            //callback and exit.
            if (success) {
                callback(true);


            //In case the geolocation process timed out or was unsuccessful,
            //then ask the user if he/she would like to retry the process.
            } else {

                var errorMessage = "Geolocation failed. Would you like to try again?";

                MessageDialogController.showConfirm(errorMessage, function (yes) {

                    //In case the user chooses to try the geolocation process
                    //again, then recursively call this function.
                    if (yes) {
                        setResponseLocation(callback);

                    //If the user is tired of trying and quits, invoke the
                    //callback indicating failure.
                    } else {
                        callback(false);
                    }
                }, "Yes,No");


            }
        });

    };

    var getFinalizedUploadResponse = function (callback, requireLocation) {

        var returnResponseData = function () {
            callback(getResponseData());
        };

        //If the survey response does not have a valid location and the location
        //parameter is required, then ask the user if he/she wants to try to
        //get the GPS location for the survey.
        if (!surveyResponse.isLocationAvailable() && requireLocation) {

            var message = "Survey '" + surveyModel.getTitle() + "' does not have a valid GPS location. Would you like to try set it?";

            var confirmCallback = function (yes) {

                //If the user wants to get the current GPS location, then try
                //to acquire the current GPS location.
                if (yes) {

                    setResponseLocation(function () {
                        returnResponseData();
                    });

                } else {
                    returnResponseData();
                }
            };

            MessageDialogController.showConfirm(message, confirmCallback, "Yes,No");

        //If validity of survey response location is not required or is
        //correctly set, then invoke the callback with the upload response data.
        } else {
            returnResponseData();
        }
    };

    /**
     * Uploads a single survey response object.
     * @param onSuccess Success response callback from API call.
     * @param onError Error response callback from API call.
     * @param requireLocation If set to true, the user will be asked to try to
     *        set the GPS location if the survey is lacking one.
     */
    that.upload = function (onSuccess, onError, requireLocation) {

        if (requireLocation === undefined || new Date().getTime() - surveyResponse.getSubmitDate().getTime() > 120000) {
            requireLocation = false;
        }

        getFinalizedUploadResponse(function (data) {

            var _onError = function (error) {
                Spinner.hide(function () {
                    if (onError) {
                        onError(error);
                    }
                });
            };

            var _onSuccess = function (response) {
                console.log("SurveyResponseUploadController: Successfully returned from single survey response upload script.");
                Spinner.hide(function () {
                    if (onSuccess) {
                        onSuccess(response);
                    }
                });
            };

            Spinner.show();

            console.log(data);
            ServiceController.serviceCall(
                "POST",
                ConfigManager.getSurveyUploadUrl(),
                data,
                "JSON",
                _onSuccess,
                _onError
            );

        }, requireLocation);

    };

    return that;

};

/**
 * Given an object of pending responses with key == uuid of the response,
 * recursively tries to upload the surveys and invokes the callback with the
 * final number of successfully uploaded surveys.
 */
SurveyResponseUploadService.uploadAll = function (pendingResponses, uploadCompletedCallback, requireLocation) {
    "use strict";
    //Counts the number of successful uploads.
    var count = 0;

    //Construct an array of IDs. This allows much easier access with an index
    //inside the recursive call.
    var responseUUIDList = [],
        responseUUID;
    for (responseUUID in pendingResponses) {
        if (pendingResponses.hasOwnProperty(responseUUID)) {
            responseUUIDList.push(responseUUID);
        }
    }

    var upload = function (i) {

        if (i >= responseUUIDList.length) {
            Spinner.hide(function () {
                if (uploadCompletedCallback !== undefined) {
                    uploadCompletedCallback(count);
                }
            });

        } else {

            //Get the current survey and surveyResponse object to upload.
            var surveyModel = pendingResponses[responseUUIDList[i]].survey,
                surveyResponseModel = pendingResponses[responseUUIDList[i]].response,
                uploadNextSurveyResponse = function () {
                    upload(i += 1);

                },
                onSuccess = function (response) {
                    count += 1;
                    SurveyResponseStoreModel.deleteSurveyResponse(surveyResponseModel);
                    uploadNextSurveyResponse();
                },
                onError = function (error) {
                    uploadNextSurveyResponse();
                };

            SurveyResponseUploadService(surveyModel, surveyResponseModel).upload(onSuccess, onError, requireLocation);

        }

    };

    Spinner.show();
    upload(0);
};