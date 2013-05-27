var UploadQueueController = function(){
    var that = {};
    
    var pendingResponses = SurveyResponseModel.getPendingResponses();
    
    var refreshView = function(){
        PageNavigation.openUploadQueueView();
    };
    
    that.deleteAllCallback = function(){
        var message = "Are you sure you would like to delete all your responses?";
        var buttonLabels = 'Yes,No';
        var confirmationCallback = function(yes){
            if(yes){
                for(var uuid in pendingResponses){
                    SurveyResponseModel.deleteSurveyResponse(pendingResponses[uuid].response);
                }
                refreshView();
            }
        };
        MessageDialogController.showConfirm(message, confirmationCallback, buttonLabels);
    };
    
    that.uploadAllCallback = function(){
        var uploadAllDoneCallback = function(successfulUploadCount){
            var message;
            if(successfulUploadCount === 0){
                message = "Unable to upload any surveys at this time.";
            }else{
                message = "Successfully uploaded " + successfulUploadCount + " survey(s).";
            }  
            MessageDialogController.showMessage(message, function(){
                refreshView();
            });
        };
        SurveyResponseUploadController.uploadAll( pendingResponses, uploadAllDoneCallback, ConfigManager.getGpsEnabled() );
    };
    
    that.getPendingResponses = function() {
        return pendingResponses;
    };
    
    that.render = function() {
        var uploadQueueView = new UploadQueueView(that);
        return uploadQueueView.render();
    };
    
    return that;
};