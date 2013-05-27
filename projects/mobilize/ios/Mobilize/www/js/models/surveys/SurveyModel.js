var SurveyModel = function( surveyData, campaign ) {

    /**
     * This variable utilizes JavaScript's closure paradigm to allow private
     * methods to invoke public methods.
     */
    var that = {};

    /**
     * Returns the title of the current survey.
     * @return Current survey's title, or empty string if undefined.
     */
    that.getTitle = function() {
        return surveyData.title || "";
    };

    /**
     * Returns the description of the current survey.
     * @return Current survey's description, or emptry string if undefined.
     */
    that.getDescription = function() {
        return surveyData.description || "";
    };

    /**
     * Returns the ID of the current survey.
     * @return Current survey's ID.
     */
    that.getID = function() {
        return surveyData.id;
    };

    /**
     * Returns a reference to this survey's campaign.
     * @return Reference to this survey's campaign.
     */
    that.getCampaign = function() {
        return campaign;
    };

    /**
     * Returns an array of prompt objects associated with this survey.
     */
    that.getPrompts = function(){
        var promptList = surveyData.contentlist.prompt;
        var prompts = new Array();
        if(promptList.length){    
            for(var i = 0; i < promptList.length; i++){
                prompts[i] = new Prompt( promptList[i], that, campaign );
            }
        } else {
            prompts.push( new Prompt(promptList, that, campaign) );
        }
        return prompts;
    };

    /**
     * Returns a prompt, given a prompt ID.
     * @param id ID of the prompt to return.
     * @return Prompt object or null.
     */
    that.getPrompt = function( id ) {
        var prompts = that.getPrompts();
        for( var i = 0; i < prompts.length; i++ ) {
            if( prompts[ i ].getID() == id ) {
                return prompts[ i ];
            }
        }
        return null;
    };
    
    return that;
}
