if (typeof window.console == "undefined") {
window.console = { log: function (str) { window.external.Notify(str); } };
}

console.log("api.js");

/**
 * ohmage server URL.
 */
var OG_SERVER = "https://test.ohmage.org";

/**
 * URL for reading campaigns.
 */
var CAMPAIGN_READ_URL = '/app/campaign/read';

/**
 * URL for uploading surveys.
 */
var SURVEY_UPLOAD_URL = '/app/survey/upload';

/**
 * Allows users to change their passwords.
 */
var PASSWORD_CHANGE_URL = '/app/user/change_password';

/**
 * The method is the primary point of interaction with the Ohmage API.
 *
 * On API call response, the method will analyze the contents of the response
 * and depending on the contents will either invoke onSuccess or onError
 * callbacks.
 *
 * URL argument is the relative path for the API URL. Ohmage server path will be
 * augmented prior to AJAX calls.
 *
 * @param type      The AJAX call type i.e. POST/GET/DELETE.
 * @param url       The API URL extension i.e. /app/survey/upload.
 * @param data      The data sent with the AJAX call.
 * @param dataType  The data type for the AJAX call i.e. XML, JSON, JSONP.
 * @param onSuccess The callback on API call success.
 * @param onError   The callback on API call error.
 * @param redirectOnAuthError
 */
function api(type, url, data, dataType, onSuccess, onError, redirectOnAuthError) {

    //By default, redirect the user to the login page on authentication error.
    redirectOnAuthError = (typeof(redirectOnAuthError) == 'undefined')? true : redirectOnAuthError;

    var _onSuccess = function(response) {

        console.log("Received response for URL (" + url + ") with the following response data: " + JSON.stringify(response));

        switch(response.result) {
            case 'success':
                invoke(onSuccess, response);
                break;

            case 'failure':{

                invoke(onError, response);

                //If the API request failed because of authentication related
                //error, then redirect the user to the authentication page.
                if(redirectOnAuthError){
                    for(var i = 0; i < response.errors.length; i++){
                        if(response.errors[i].code == '0200'){
                            auth.setAuthErrorState(true);
                            PageNavigation.openAuthenticationPage();
                            break;
                        }

                    }
                }

                break;
            }


            default:
                invoke(onSuccess, response);
                break;
        }
    };

    var _onError = function(){
        invoke(onError, false);
    };

    console.log("Initiating an API call for URL (" + url + ") with the following input data: " + JSON.stringify(data));

    $.ajax({
        type: type,
        url : OG_SERVER + url,
        data: data,
        dataType: dataType,
        success : _onSuccess,
        error : _onError
    });

}



/**
 * Invokes the method 'fun' if it is a valid function. In case the function
 * method is null, or undefined then the error will be silently ignored.
 *
 * @param fun  the name of the function to be invoked.
 * @param args the arguments to pass to the callback function.
 */
function invoke(fun, args){
    if(fun && typeof fun === 'function'){
        fun(args);
    }
}

/**
 * Returns true if the application is running on an actual mobile device.
 */
function isOnDevice(){
    return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
}

function isDeviceiOS(){
    return navigator.userAgent.match(/(iPhone)/);
}

function isDeviceAndroid(){
    return navigator.userAgent.match(/(Android)/);
}

/**
 * Method for invoking functions once the DOM and the device are ready. This is
 * a replacement function for the JQuery provided method i.e.
 * $(document).ready(...).
 */
function invokeOnReady(callback){
    $(document).ready(function(){
        if (isOnDevice()) {
            document.addEventListener("deviceready", callback, false);
        } else {
            invoke(callback);
        }
    });
}

function showMessage(message, callback, title, buttonName){

    title = title || "ohmage";
    buttonName = buttonName || 'OK';

    if(navigator.notification && navigator.notification.alert){

        navigator.notification.alert(
            message,    // message
            callback,   // callback
            title,      // title
            buttonName  // buttonName
        );

    }else{

        alert(message);
        invoke(callback)
    }

}

function showConfirm(message, callback, buttonLabels, title){

    //Set default values if not specified by the user.
    buttonLabels = buttonLabels || 'OK,Cancel';
    var buttonList = buttonLabels.split(',');

    title = title || "ohmage";

    //Use Cordova version of the confirm box if possible.
    if(navigator.notification && navigator.notification.confirm){

            var _callback = function(index){
                if(callback){


                    if(isDeviceiOS())
                        index = buttonList.length - index;

                    callback(index == 1);
                }
            };

            navigator.notification.confirm(
                message,      // message
                _callback,     // callback
                title,        // title
                buttonLabels  // buttonName
            );

    //Default to the usual JS confirm method.
    }else{
        invoke(callback, confirm(message));
    }
}
