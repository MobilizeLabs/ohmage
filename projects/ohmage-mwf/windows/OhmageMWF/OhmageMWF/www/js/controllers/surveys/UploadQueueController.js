var UploadQueueController = function(){
    var self = {};
    
    var pendingResponses = SurveyResponseModel.getPendingResponses();
    
    var refreshView = function(){
        PageNavigation.openUploadQueueView();
    };
    
    self.deleteAllCallback = function(){
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
        showConfirm(message, confirmationCallback, buttonLabels);
    };
    
    self.uploadAllCallback = function(){
        var uploadAllDoneCallback = function(successfulUploadCount){
            var message;
            if(successfulUploadCount === 0){
                message = "Unable to upload any surveys at this time.";
            }else{
                message = "Successfully uploaded " + successfulUploadCount + " survey(s).";
            }  
            showMessage(message, function(){
                refreshView();
            });
        };
        SurveyResponseUploader.uploadAll(pendingResponses, uploadAllDoneCallback);
    };
    
    self.getPendingResponses = function(){
        return pendingResponses;
    };
    
    self.render = function(){
        var uploadQueueView = new UploadQueueView(self);
        return uploadQueueView.render();
    };
    
    return self;
};