var Campaign = function( urn ) {

    var that = {};

    var metadata = (new LocalMap("all-campaigns").get(urn));
    var campaign = (new LocalMap("campaign-configurations")).get(urn);



    /**
     * Returns surveys associated with this campaign.
     */
    that.getSurveys = function(){

        //Get the list of surveys from the campaign.
        var surveys  = campaign.surveys.survey;

        //If survey is returned as a single item, then go ahead and place
        //it in an array. This is a kind of a dirty fix, if you have any
        //better ideas of approaching the situation - please be my guest.
        return (!surveys.length)? [surveys] : surveys;
    };

    that.isRunning = function(){
        return metadata.running_state === 'running';
    };

    /**
    * Returns a survey associated with the provided survey ID. If the campaign,
    * doesn't contain a survey with the provided ID, a null value will be
    * returned.
    */
    that.getSurvey = function(id){

       //Get a list of all the possible surveys.
       var surveys = that.getSurveys();

       //Iterate through the list of retrieved surveys. If a ID match is found,
       //return the survey.
       for(var i = 0; i < surveys.length; i++){
          if(surveys[i].id == id){
              return SurveyModel( surveys[i], that );
          }
       }

       //If no match was found, return null.
       return null;
    };

    /**
     * Returns the name of the current campaign.
     */
    that.getName = function(){
        return metadata.name;
    };

    /**
     * Returns the URN for this campaign.
     */
    that.getURN = function(){
        return urn;
    };

    /**
     * Return's the campaign's creation timestamp.
     */
    that.getCreationTimestamp = function(){
        return metadata.creation_timestamp;
    };

    /**
     * Returns the description for this campaign.
     */
    that.getDescription = function(){
        return metadata.description;
    };

    return that;
};

/**
 *
 *
 */
Campaign.install = function(urn, onSuccess, onError){

    Spinner.show();

    var _onError = function(response){

        Spinner.hide(function(){
            if(onError){
                onError(response);
            }
        });
    };

    var _onSuccess = function(response) {

        Spinner.hide(function(){

            if(response.result === "success"){

                var installedCampaigns = new LocalMap("installed-campaigns");
                installedCampaigns.set(urn, Math.round(new Date().getTime() / 1000));

                var campaignConfigurations = new LocalMap("campaign-configurations");
                campaignConfigurations.set(urn, Campaign.parse(response.data[urn].xml));

                if(onSuccess){
                    onSuccess();
                }
            }
        });



    };

    ServiceController.serviceCall(
         "POST",
         ConfigManager.getCampaignReadUrl(),
         {
             user:            auth.getUsername(),
             password:        auth.getHashedPassword(),
             client:          ConfigManager.getClientName(),
             campaign_urn_list: urn,
             output_format:   'long'
         },
         "JSON",
         _onSuccess,
         _onError
    );

}

Campaign.parse = function(campaignXML){

    /*
     * There is apparently a very weird problem running JavaScript within
     * PhoneGap – the engine is so restrictive that when encountering the word
     * ‘default’, used within the prompt’s XML configuration file as a property
     * storing the default value, it interprets it as a keyword crushing the
     * system. This renders the XML2JSON conversion impossible. The only
     * solution I currently found was to replace all ‘default’  parameters within
     * the XML string to ‘def’ prior to converting to JSON. I am assuming the
     * problem is from the XML2JSON plugin’s use of the dot operator instead of
     * the array-access syntax to do the parsing, but debugging the plugin is
     * not working – there are only two xml->json parsers and I have tested
     * both. Everything works fine on the desktop side, but once placed within
     * PhoneGap the bug comes up.
     */
    var cleanXML = campaignXML.replace(/<default>/g, "<defaultValue>")
                              .replace(/<\/default>/g, "</defaultValue>")
                              .replace(/<default\/>/g, "<defaultValue/>");

    //Convert the XML configuration to a JSON representation.
    var json = $.xml2json.parser(cleanXML);

    return json.campaign;

}

