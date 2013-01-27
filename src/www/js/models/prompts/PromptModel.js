
/**
 * Represents an individual prompts.
 * @author Zorayr Khalapyan
 */
var PromptModel = function (promptData, survey, campaign) {

    var that = {};

    /**
     * Stores error message in case validation fails.
     */
    var errorMsg = null;

    /**
     * Default handler for the current prompt. The handler knows how to display
     * the prompt and analyze the response.
     */
    var handler = {};//new PromptHandler(that);

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
    var setProperties = function () {
        var customProperties, i;
        if (!promptData.properties || !promptData.properties.property) {
            properties = [];
        } else if (!promptData.properties.property.length) {
            properties = [promptData.properties.property];
        } else {
            properties = promptData.properties.property;
        }
        customProperties = customPropertiesVault.getCustomProperties();
        for (i = 0; i < customProperties.length; i+= 1) {
            properties.push(customProperties[i]);
        }
    };

    /**
     * Detects if the specified property is already in the property list of this
     * prompt. The method returns true if the property is a duplicate, false
     * otherwise.
     */
    var isDuplicatePropertyLabel = function (property) {
        var i;
        for (i = 0; i < properties.length; i+=1) {
            if (properties[i].label === property.label) {
                return true;
            }
        }
        return false;
    };

    that.summarizeResponse = function(responseValue){
        var summary = "";

        if(responseValue === SurveyResponseModel.NOT_DISPLAYED_PROMPT_VALUE ||
           responseValue === SurveyResponseModel.SKIPPED_PROMPT_VALUE ) {
            return responseValue;
        }

        switch(that.getType()){

            case 'photo':
                if(responseValue !== SurveyResponseModel.SKIPPED_PROMPT_VALUE){
                    var base64 = Base64.formatImageSrcString(SurveyResponseModel.getImage(responseValue));
                    summary = "<center><img src='" + base64 + "' width='100%' /></center>";
                }else{
                    summary = responseValue;
                }

                break;

            case 'single_choice':
                summary = that.getProperty(responseValue[0]).label;

                break;

            case 'multi_choice':
                var keys = responseValue.toString().split(',');
                var labels = [], key;
                for (key in keys) {
                    labels.push(that.getProperty(key).label);
                }
                summary = labels.join(", ");

                break;

            default:
                summary = responseValue;
        }

        return summary;
    };

    that.render = function(){
        return handler.render();
    };

    /**
    * Default validator for this prompt. Each individual prompt type should
    * override this method. By default, every response is valid.
    *
    * @return True.
    *
    */
    that.isValid = function(){
        return true;
    };

    /**
     * Returns validation error message or false if none. If this method is
     * called without calling isValid on the current prompt, then isValid will
     * be automatically called before retreiving the error message.
     */
    that.getErrorMessage = function(){
        if(errorMsg === null){
            that.isValid();
        }

        return errorMsg || false;
    };

    /**
     * Set an error message for the current prompt.
     * @param message The new error message.
     */
    that.setErrorMessage = function(message){
        errorMsg = message;
    };

    /**
     * Returns the default response for this prompt. Each individual prompt type
     * should override this method in order to return the correct response.
     */
    that.getResponse = function() {
        return that.getDefaultValue();
    };

   /**
    * Returns a list of properties for this prompt.
    */
    that.getProperties = function(){
        return properties;
    };

    that.getProperty = function(key){
        var properties = that.getProperties(), i;
        for (i = 0; i < properties.length; i+=1) {
            if (properties[i].key === key) {
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
    that.getMinValue = function () {
        var minProperty = that.getProperty("min");
        return minProperty !== null ? minProperty.label : null;
    };

    /**
     * Returns maximum value allowed for the current prompt's response, or null
     * if the maximum value is undefined.
     * @return maximum value allowed for the current prompt's response, or null
     *        if undefined.
     */
    that.getMaxValue = function () {
        var maxProperty = that.getProperty("max");
        return maxProperty !== null ? maxProperty.label : null;
    };

   /**
    * Adds a new property to this prompt. If the property label already exists,
    * then the method will have no side effects and will return false.
    */
   that.addProperty = function (label, key) {
        //By default, property key is the index of the array.
        var property = { key:key || properties.length, label:label };
        if (!isDuplicatePropertyLabel(property)) {
            properties.push(property);
            customPropertiesVault.addCustomProperty(property);
            return property;
        } else {
            return false;
        }
    };

    that.getCampaignURN = function(){
        return campaign.getURN();
    };

    that.getSurveyID = function(){
        return survey.getID();
    };

    /**
     * Returns the ID of the current prompt.
     * @return The ID of the current prompt.
     */
    that.getID = function(){
        return promptData.id;
    };

    /**
     * Returns the conditional statement associated with the current prompt.
     */
    that.getCondition = function(){
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
    that.getType = function(){
        return promptData.prompttype;
    };

    /**
     * Returns text related to this prompt. If prompt text is undefined, then an
     * empty string will be returned.
     */
    that.getText = function(){
        return promptData.prompttext || "";
    };

    /**
     * Returns true if the prompt may be skipped.
     * @return true if the prompt may be skipped.
     */
    that.isSkippable = function(){
        return promptData.skippable === "true";
    };

    /**
     * Returns the label that should be displayed inside the skip button.
     */
    that.getSkipLabel = function(){
        return promptData.skiplabel;
    };

    /**
     * Returns the default value for this prompt.
     * @return Default value for this prompt.
     */
    that.getDefaultValue = function(){
        //Access the default value of the prompt with array accessing schema
        //in order to bypass JS keyword use 'default'.
        return (typeof(promptData.defaultvalue) !== 'undefined')? promptData.defaultvalue : null;
    };

    //Initialization.
    (function(){
       customPropertiesVault = new CustomPropertiesVault(that);
       setProperties();
    }());

    return that;
};