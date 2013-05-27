var Survey = function(surveyData, campaign){

    /**
     * Namespace abbreviation for Mobile Web Framework JS Decorators library.
     */
    var mwfd = mwf.decorator;

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var self = this;

    /**
     * If set to true, the user will be asked to either upload after submitting
     * or wait and upload manually. This functionality is mostly useful for 
     * debugging upload queue.
     */
    var CONFIRM_TO_UPLOAD_ON_SUBMIT = true;
    
    /**
     * Renders the current survey within the provided container. This method can
     * be used to both display a summary of the survey, like in the upload queue
     * and display a starting page of the survey. In order to disable the start
     * button, set the second paramter to false.
     *
     * @param container The container to store the survey rendering.
     * @param startButton Boolean value indicating if a survey can be started.
     */
    this.render = function(container, startButton){

        //By default, start button will be displayed.
        if(startButton === undefined){
            startButton = true;
        }

        var content = mwfd.Content();

        content.setTitle(this.getTitle());
        content.addTextBlock(this.getDescription());

        container.appendChild(content);

        //Optionally, display a start button that will initiate the survey.
        if(startButton){

            var startSurvey = mwfd.SingleClickButton('Start Survey', function() {
                self.start(container);
            });

            container.appendChild(startSurvey);
        }


    };

    /**
     * If the survey is currently rendered, this stores the navigation object
     * used to iterate through different prompts.
     */
    this.currentNavigation = null;

    /**
     * Starts a new navigation object with the current survey. This method
     * should be used to start off the survey. The prompts will be displayed one
     * by one, user response will be gathered in a SurveyResponse, etc.
     */
    this.start = function(container){

        //Callback for when the user completes the survey.
        var onSurveyComplete = function(surveyResponse){
            
            ReminderModel.supressSurveyReminders(self.getID());
            
            var afterSurveyComplete = function(){
                //PageNavigation.openCampaignView(self.getCampaign().getURN());
                PageNavigation.goBack();
            };
            
            //Confirmation box related properties.
            var title = 'ohmage';
            var buttonLabels = 'Yes,No';
            var message = "Would you like to upload your response?";
            var callback = function(yes){

                //Yes upload my response now. 
                if(yes){
                    
                    var uploader = new SurveyResponseUploader(self, surveyResponse);
                    
                    var onSuccess = function(response){
                        showMessage("Successfully uploaded your survey response.", function(){
                        SurveyResponseModel.deleteSurveyResponse(surveyResponse);
                            afterSurveyComplete();
                        });
                        
                    };
                    
                    var onError = function(error){
                        showMessage("Unable to upload your survey response at this time.", afterSurveyComplete);
                    };
                    
                    uploader.upload(onSuccess, onError);

                }else{
                    afterSurveyComplete();
                }
            }

            if(CONFIRM_TO_UPLOAD_ON_SUBMIT){
                showConfirm(message, callback, buttonLabels, title);
            }else{
                callback(true);
            }
            
        };

        //Start the actual survey.
        this.currentNavigation = new Navigation(this, container);
        this.currentNavigation.start(onSurveyComplete);
        
        return this.currentNavigation;
    };

    /**
     * Returns the title of the current survey.
     * @return Current survey's title, or empty string if undefined.
     */
    this.getTitle = function(){
        return surveyData.title || "";
    }

    /**
     * Returns the description of the current survey.
     * @return Current survey's description, or emptry string if undefined.
     */
    this.getDescription = function(){
        return surveyData.description || "";
    }

    /**
     * Returns the ID of the current survey.
     * @return Current survey's ID.
     */
    this.getID = function(){
        return surveyData.id;
    }

    /**
     * Returns a reference to this survey's campaign.
     * @return Reference to this survey's campaign.
     */
    this.getCampaign = function(){
        return campaign;
    }

    /**
     * Returns an array of prompt objects associated with this survey.
     */
    this.getPrompts = function(){
        var promptList = surveyData.contentlist.prompt;
        var prompts = new Array();
        if(promptList.length){    
            for(var i = 0; i < promptList.length; i++){
                prompts[i] = new Prompt(promptList[i], self, campaign);
            }
        } else {
            prompts.push(new Prompt(promptList, self, campaign));
        }
        return prompts;
    };

    /**
     * Returns a prompt, given a prompt ID.
     * @param id ID of the prompt to return.
     * @return Prompt object or null.
     */
    this.getPrompt = function(id){
        var prompts = this.getPrompts();
        for(var i = 0; i < prompts.length; i++){
            if(prompts[i].getID() == id){
                return prompts[i];
            }
        }
        return null;
    };
}
