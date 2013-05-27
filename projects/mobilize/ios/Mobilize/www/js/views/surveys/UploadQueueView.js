var UploadQueueView = function(uploadQueueController){
    var self = {};
    
    var pendingResponses = uploadQueueController.getPendingResponses();
    
    var uploadQueueMenuTitle = "Pending Uploads";
    
    var renderEmptyUploadQueueView = function(){
        var emptyUploadQueueView = mwf.decorator.Content(uploadQueueMenuTitle);
        emptyUploadQueueView.addTextBlock('Upload queue is empty.');
        return emptyUploadQueueView;
    };
            
    self.render = function(){
        var queueMenu = mwf.decorator.Menu(uploadQueueMenuTitle);
        var onSurveyClickCallback = function(response){
            return function(){
                PageNavigation.openSurveyResponseView(response.getSurveyKey());
            };
        };
        var survey, response, details, menuItem;
        for(var uuid in pendingResponses){
            survey   = pendingResponses[uuid].survey;
            response = pendingResponses[uuid].response;
            details  = "Submitted on " + response.getSubmitDateString() + ".";
            menuItem = queueMenu.addMenuLinkItem(survey.getTitle(), null, details);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onSurveyClickCallback(response), "menu-highlight");   
        }

        var container = document.createElement('div');
        if(queueMenu.size() > 0){
            container.appendChild(queueMenu);
            container.appendChild(mwf.decorator.DoubleClickButton("Delete All", uploadQueueController.deleteAllCallback, 
                                                                  "Upload All", uploadQueueController.uploadAllCallback));
        } else {
            container.appendChild(renderEmptyUploadQueueView());
        }
        
        container.appendChild(mwf.decorator.SingleClickButton("Dashboard", PageNavigation.openDashboard));
        return container;
    };
    return self;
};