
function Navigation(survey, container){

    var self = this;
    
    /**
     * Namespace abbreviation for Mobile Web Framework JS Decorators library.
     */
    var mwfd = mwf.decorator;

    /**
     * An array of prompts associated with the current survey.
     */
    var prompts = survey.getPrompts();

    /**
     * The response object for the current survey.
     */
    var surveyResponse = SurveyResponseModel.init(survey.getID(), survey.getCampaign().getURN());

    /**
    * Stores the index of the currently displayed prompt. Initialized to the
    * first prompt.
    */
    var currentPromptIndex = 0;

    /**
     * Callback for survey completed event. The actual response will not be
     * submitted but will be passed as a reference object to this callback.
     */
    var surveyDoneCallback = null;
    
    /**
     * If running on an Android device, this method gets invoked when the user
     * hits the back button.
     */
    var androidBackButtonCallback = null;
    
    /**
     * Message displayed to the user when exiting the current survey without
     * submitting.
     */
    var confirmToLeaveMessage = "Data from your current survey response will be lost. Are you sure you would like to continue?";
    
        
    var androidBackButtonCallbackWrapper = function(){
       if(androidBackButtonCallback !== null){
           androidBackButtonCallback();
       }
    };
    
    var overrideBackButtonFunctionality = function(){
        if(isDeviceAndroid()){
            invokeOnReady(function(){
               console.log("Overriding back button on Android devices for current survey navigation.");
               document.addEventListener("backbutton", androidBackButtonCallbackWrapper, true);
        });
      }
    };
    
    var resetBackButtonFunctionality = function(){
        if(isDeviceAndroid()){
            document.removeEventListener("backbutton", androidBackButtonCallbackWrapper, false);    
        }
    };

    /**
     * Returns currently displayed prompt. Returns null if current index is out
     * of bounds.
     *
     * @return Current prompt.
     */
    var getCurrentPrompt = function(){
        return prompts[currentPromptIndex] || null;
    };

    /**
     * Returns current prompt's condition.
     */
    var getCurrentCondition = function(){
        return getCurrentPrompt().getCondition();
    };
    
    /**
     * Boolean method that returns true if the current condition of the prompt
     * fails.
     */
    var failsCondition = function(){
        var currentCondition = getCurrentCondition();
        var currentResponse  = surveyResponse.getResponses();
        return currentCondition && 
               !ConditionalParser.parse(currentCondition, currentResponse);
    };
    
    /**
     * Buffer that stores currently displayed/rendered prompts. This approach
     * is used for storing user entered data when the user goes to the previous
     * prompt.
     */
    var promptBuffer = {};

    /**
     * Method invoked when the user completes the survey and clicks submit.
     */
    var done = function(){
        resetBackButtonFunctionality();
        surveyResponse.submit();
        surveyDoneCallback(surveyResponse);
    };

    var processResponse = function(skipped){
        var prompt = getCurrentPrompt();
        if(skipped){
            if(!prompt.isSkippable()){
                return false;
            }
            surveyResponse.promptSkipped(prompt.getID());
            return true;
        }

        //Handle invalid responses.
        if(!prompt.isValid()){
            showMessage(prompt.getErrorMessage());
            return false;
        }

        //Save the response.
        surveyResponse.respond(prompt.getID(), prompt.getResponse(), prompt.getType() == 'photo');

        return true;
    };

    var nextPrompt = function(skipped){
        if(processResponse(skipped)){
            currentPromptIndex++;
            while(currentPromptIndex < prompts.length && failsCondition()){
                surveyResponse.promptNotDisplayed(getCurrentPrompt().getID());
                currentPromptIndex++;
            }
            render();
        }
    };

    var previousPrompt = function(){
        if(currentPromptIndex > 0){
            currentPromptIndex--;
        }

        //Skip all prompts that fail the condition.
        while(currentPromptIndex > 0 && failsCondition()){
            currentPromptIndex--;
        }

        render();

    };
    
    /**
     * Enables or disables next, previous, submit, and skip buttons.
     */
    var getControlButtons = function (submitPage) {
        var panel = document.createElement('div');

        //If the prompt is skippable, then enable the skip button.
        if(!submitPage && getCurrentPrompt().isSkippable()){
            panel.appendChild(mwfd.SingleClickButton(getCurrentPrompt().getSkipLabel(), function(){
                nextPrompt(true);
            }));
        }

        androidBackButtonCallback = previousPrompt;
        
        //Handle first prompt.
        if(currentPromptIndex == 0){
            panel.appendChild(mwfd.SingleClickButton("Next Prompt", function(){
                nextPrompt(false);
            }));
            
            androidBackButtonCallback = function(){
                self.confirmSurveyExit(function(){
                    PageNavigation.goBack();
                });  
            };

        //Handle submit page.
        } else if(submitPage){
           panel.appendChild(mwfd.DoubleClickButton("Previous", previousPrompt, "Submit", done));
           
        //Handle prompts in the middle.
        } else{
            panel.appendChild(mwfd.DoubleClickButton("Previous", previousPrompt, "Next", function(){
                nextPrompt(false);
            }));
        }
        
        return panel;
    };
   
    var render = function(){

        //Clear the current contents of the main container.
        container.innerHTML = "";

        var controlButtons;
        
        //Render prompt if not at the last prompt.
        if(currentPromptIndex < prompts.length) {

            //Dislpayed buffered prompts if possible, else render the prompt and
            //save the rendered content.
            if(!promptBuffer[getCurrentPrompt().getID()]){
                container.appendChild(promptBuffer[getCurrentPrompt().getID()] = getCurrentPrompt().render());
            }else{
                container.appendChild(promptBuffer[getCurrentPrompt().getID()]);
            }

            controlButtons = getControlButtons(false);
            

        //Render submit page if at the last prompt.
        } else {

            var menu = mwfd.Menu('Survey Completed');
            menu.addMenuTextItem('Done with ' + survey.getTitle());
            container.appendChild(menu);

            controlButtons = getControlButtons(true);
        }
        
        container.appendChild(controlButtons);
        
    };

    /**
     * Fetches the current location and renders the first prompt.
     *
     * @param callback Function that will be invoked when the survey has been
     *                 completed.
     */
    self.start = function(callback){
        //Update survey response geolocation information.
        surveyResponse.setLocation();

        //Render the initial prompt.
        render();

        //Save the callback to be invoked when the survey has been completed.
        surveyDoneCallback = callback;
        
        overrideBackButtonFunctionality();

    };

    /**
     * Aborts the current survey participation and deletes the users responses.
     * This method should be called to do the clean up before the user navigates
     * to another page without completing the survey. 
     */
    self.abort = function(){
        resetBackButtonFunctionality();
        if(surveyResponse !== null && !surveyResponse.isSubmitted()){
            SurveyResponseModel.deleteSurveyResponse(surveyResponse);
        }
    };

    /**
     * Method used for getting user's confirmation before exiting an incomplete 
     * survey. In case of a positive confirmation, the current survey response 
     * will be aborted (resonse get's deleted from localStorage) and the 
     * specified callback is invoked. 
     * 
     * @param positiveConfirmationCallback A callback invoked when the user 
     *        confirms the current action.
     */
    self.confirmSurveyExit = function(positiveConfirmationCallback){
        showConfirm(confirmToLeaveMessage, function(isResponseYes){
            if( isResponseYes ){ 
                self.abort(); 
                if( typeof(positiveConfirmationCallback) === "function" ){ 
                    positiveConfirmationCallback(); 
                }
            }
        }, "Yes,No");
    };
    
    return self;
}





