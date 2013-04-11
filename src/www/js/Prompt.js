/**
 *
 * Represents an individual prompt. The class provides functionality for getting
 * the prompt's
 */
var Prompt = function(promptData, survey, campaign){

   /**
    * This variable utilizes JavaScript's closure paradigm to allow private
    * methods to invoke public methods.
    */
    var self = this;

    /**
     * Stores error message in case validation fails.
     */
    var errorMsg = null;

    /**
     * Default handler for the current prompt. The handler knows how to display
     * the prompt and analyze the response.
     */
    var handler = new PromptHandler(self);

    var customPropertiesVault = null;

    /**
     * Stores a list of current specified and custom properties which are just
     * (key, value) pairs.
     */
    var properties = null;

    /**
     * The method initlization the list of both specified and custom properties.
     * This method should be invoked when this prompt is initialized.
     */
    var setProperties = function(){
        if(!promptData.properties || !promptData.properties.property){
            properties = [];
        } else if(!promptData.properties.property.length){
            properties = [promptData.properties.property];
        }else{
            properties = promptData.properties.property;
        }

        var customProperties = customPropertiesVault.getCustomProperties();
        for(var i = 0; i < customProperties.length; i++){
            properties.push(customProperties[i]);
        }
    };

    /**
     * Detects if the specified property is already in the property list of this
     * prompt. The method returns true if the property is a duplicate, false
     * otherwise.
     */
    var isDuplicatePropertyLabel = function(property){
        for(var i = 0; i < properties.length; i++){
            if(properties[i].label == property.label){
                return true;
            }
        }
        return false;
    };

    self.summarizeResponse = function(responseValue){
        var summary = "";

        if(responseValue === SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE ||
           responseValue === SurveyResponseModel.SKIPPED_PROMPT_VALUE ) {
            return responseValue;
        }

        switch(self.getType()){

            case 'photo':
                if(responseValue !== SurveyResponseModel.SKIPPED_PROMPT_VALUE){
                    var base64 = Base64.formatImageSrcString(SurveyResponseModel.getImage(responseValue));
                    summary = "<center><img src='" + base64 + "' width='100%' /></center>";
                }else{
                    summary = responseValue;
                }

                break;

            case 'single_choice':
                summary = self.getProperty(responseValue).label;

                break;

            case 'multi_choice':
                var keys = responseValue,
                    i;
                var labels = [];
                for (i = 0; i < keys.length; i += 1) {
                    labels.push(self.getProperty(keys[i]).label);
                }
                summary = labels.join(", ");

                break;

            default:
                summary = responseValue;
        }

        return summary;
    };

    self.render = function(){
        return handler.render();
    };

    /**
    * Default validator for this prompt. Each individual prompt type should
    * override this method. By default, every response is valid.
    *
    * @return True.
    *
    */
    self.isValid = function(){
        return true;
    };

    /**
     * Returns validation error message or false if none. If this method is
     * called without calling isValid on the current prompt, then isValid will
     * be automatically called before retreiving the error message.
     */
    self.getErrorMessage = function(){
        if(errorMsg === null){
            self.isValid();
        }

        return (errorMsg)? errorMsg : false;
    };

    /**
     * Set an error message for the current prompt.
     * @param message The new error message.
     */
    self.setErrorMessage = function(message){
        errorMsg = message;
    };

    /**
     * Returns the default response for this prompt. Each individual prompt type
     * should override this method in order to return the correct response.
     */
    self.getResponse = function() {
        return self.getDefaultValue();
    };

   /**
    * Returns a list of properties for this prompt.
    */
    self.getProperties = function(){
        return properties;
    };

    self.getProperty = function(key){
        var properties = self.getProperties();
        for(var i = 0; i < properties.length; i++){
            if(properties[i].key == key){
                return properties[i];
            }
        }
        return null;
    };

    /**
     * Returns minimum value allowed for the current prompt's response, or null
     * if the minimum value is undefined.
     * @return minimum value allowed for the current prompt's response, or null
     *         if undefined.
     */
    self.getMinValue = function(){
        var minProperty = self.getProperty("min");
        return minProperty !== null ? minProperty.label : null;
    };

    /**
     * Returns maximum value allowed for the current prompt's response, or null
     * if the maximum value is undefined.
     * @return maximum value allowed for the current prompt's response, or null
     *        if undefined.
     */
    self.getMaxValue = function(){
        var maxProperty = self.getProperty("max");
        return maxProperty !== null ? maxProperty.label : null;
    };

   /**
    * Adds a new property to this prompt. If the property label already exists,
    * then the method will have no side effects and will return false.
    */
   self.addProperty = function(label, key){
        //By default, property key is the index of the array.
        var property = { key:key || properties.length, label:label };
        if(!isDuplicatePropertyLabel(property)){
            properties.push(property);
            customPropertiesVault.addCustomProperty(property);
            return property;
        }else{
            return false
        }
    };

    self.getCampaignURN = function(){
        return campaign.getURN();
    };

    self.getSurveyID = function(){
        return survey.getID();
    };

    /**
     * Returns the ID of the current prompt.
     * @return The ID of the current prompt.
     */
    self.getID = function(){
        return promptData.id;
    };

    /**
     * Returns the conditional statement associated with the current prompt.
     */
    self.getCondition = function(){
        if( typeof(promptData.condition) !== "undefined" ) {
            var condition = promptData.condition;
            condition = condition.replace(/&gt;/g, ">");
            condition = condition.replace(/&lt;/g, "<");
            return condition;
        }
        return null;
    };

    /**
     * Returns the type of the current prompt.
     * @return the type of the current prompt.
     */
    self.getType = function(){
        return promptData.prompttype;
    };

    /**
     * Returns text related to this prompt. If prompt text is undefined, then an
     * empty string will be returned.
     */
    self.getText = function(){
        return promptData.prompttext || "";
    };

    /**
     * Returns true if the prompt may be skipped.
     * @return true if the prompt may be skipped.
     */
    self.isSkippable = function(){
        return promptData.skippable === "true";
    };

    /**
     * Returns the label that should be displayed inside the skip button.
     */
    self.getSkipLabel = function(){
        return promptData.skiplabel;
    };

    /**
     * Returns the default value for this prompt.
     * @return Default value for this prompt.
     */
    self.getDefaultValue = function(){
        //Access the default value of the prompt with array accessing schema
        //in order to bypass JS keyword use 'default'.
        return (typeof(promptData.defaultvalue) !== 'undefined')? promptData.defaultvalue : null;
    };

    //Initialization.
    (function(){
       customPropertiesVault = new CustomPromptPropertyVault(self);
       setProperties();
    }());

    return self;
};