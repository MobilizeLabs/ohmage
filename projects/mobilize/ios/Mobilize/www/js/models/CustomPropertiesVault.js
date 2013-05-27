var CustomPropertiesVault = function(prompt){
   var self = {};
   
   var vault = new LocalMap(CustomPropertiesVault.VAULT_LOCAL_MAP_NAME);
   
   var campaignURN = prompt.getCampaignURN();
   var surveyID    = prompt.getSurveyID();
   var promptID    = prompt.getID();
      
   var campaignProperties, surveyProperties, promptProperties;
   
   var read = function(){
       campaignProperties = vault.get(campaignURN) || {};
       surveyProperties   = campaignProperties[surveyID] || {};
       promptProperties   = surveyProperties[promptID]   || [];    
   };
   
   var write = function(){
       surveyProperties[promptID] = promptProperties;
       campaignProperties[surveyID] = surveyProperties;
       vault.set(campaignURN, campaignProperties);
   };
   
   self.addCustomProperty = function(customChoice){
       read();
       promptProperties.push(customChoice);
       write();
   };
   
   self.getCustomProperties = function(){
       read();
       return promptProperties;
   };
   
   self.deleteCustomProperties = function(){
       read();
       promptProperties = [];
       write();
   };
   
   return self;
};

CustomPropertiesVault.VAULT_LOCAL_MAP_NAME = 'custom-properties-vault';

CustomPropertiesVault.deleteAllCustomProperties = function(){
    (new LocalMap(CustomPropertiesVault.VAULT_LOCAL_MAP_NAME)).erase(); 
};