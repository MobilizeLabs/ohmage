var MessageDialogController = (function () {
    
    var that = {};
    
    /**
     * Invokes the method 'fun' if it is a valid function. In case the function
     * method is null, or undefined then the error will be silently ignored.
     *
     * @param fun  the name of the function to be invoked.
     * @param args the arguments to pass to the callback function.
     */
    var invoke = function( fun, args ) {
        if( fun && typeof fun === 'function' ) {
            fun( args );
        }
    };
    
    that.showMessage = function( message, callback, title, buttonName ) {

        title = title || "ohmage";
        buttonName = buttonName || 'OK';

        if( navigator.notification && navigator.notification.alert ) {

            navigator.notification.alert(
                message,    // message
                callback,   // callback
                title,      // title
                buttonName  // buttonName
            );

        } else {

            alert( message );
            invoke( callback );
        }

    };

    that.showConfirm = function( message, callback, buttonLabels, title ) {

        //Set default values if not specified by the user.
        buttonLabels = buttonLabels || 'OK,Cancel';
        var buttonList = buttonLabels.split(',');

        title = title || "ohmage";

        //Use Cordova version of the confirm box if possible.
        if(navigator.notification && navigator.notification.confirm){

                var _callback = function(index){
                    if( callback ) {

                        if(DeviceDetection.isDeviceiOS())
                            index = buttonList.length - index;

                        callback( index == 1 );
                    }
                };

                navigator.notification.confirm(
                    message,      // message
                    _callback,    // callback
                    title,        // title
                    buttonLabels  // buttonName
                );

        //Default to the usual JS confirm method.
        } else {
            invoke( callback, confirm( message ) );
        }
        
    };

    return that;
    
})();