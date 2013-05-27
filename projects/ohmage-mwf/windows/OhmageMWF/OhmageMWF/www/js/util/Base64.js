var Base64 = {

    /**
     * This implementation relies on Cordova 1.5 or above implementations.
     */
    getBase64ImageFromInput : function(input, callback) {

        var imageReader = new FileReader();

        imageReader.onloadend = function(evt) {
            if(callback)
                callback(evt.target.result);
        };

        imageReader.readAsDataURL(input);
    },
    
    formatImageSrcString : function(base64){
        return (base64.match(/(base64)/))? base64 : "data:image/jpeg;base64," + base64;
    }
       
}