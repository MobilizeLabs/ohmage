module( "config.ConfigManager", {
  setup: function() {
    //No setup required.
  },
  teardown: function() {
    ConfigManager.reset();
  }
});

test( "Test ConfigManager.getProperty()", function() {

    ///
    var serverEndpoint = ConfigManager.getProperty( "SERVER_ENDPOINT" );
    var campaignReadUrl = ConfigManager.getProperty( "CAMPAIGN_READ_URL" );
    var surveyUploadUrl = ConfigManager.getProperty( "SURVEY_UPLOAD_URL" );
    var passwordChangeUrl = ConfigManager.getProperty( "PASSWORD_CHANGE_URL" );
    ///

    ok( ( typeof( serverEndpoint ) !== "undefined" ),    "Should be able to get SERVER_ENDPOINT property." );
    ok( ( typeof( campaignReadUrl ) !== "undefined" ),   "Should be able to get CAMPAIGN_READ_URL property." );
    ok( ( typeof( surveyUploadUrl ) !== "undefined" ),   "Should be able to get SURVEY_UPLOAD_URL property." );
    ok( ( typeof( passwordChangeUrl ) !== "undefined" ), "Should be able to get PASSWORD_CHANGE_URL property." );
});

test( "Test ConfigManager.getConfigProperty()", function() {

    ///
    var serverEndpoint = ConfigManager.getServerEndpoint();
    var campaignReadUrl = ConfigManager.getCampaignReadUrl();
    var surveyUploadUrl = ConfigManager.getSurveyUploadUrl();
    var passwordChangeUrl = ConfigManager.getPasswordChangeUrl();
    ///

    ok( ( typeof( serverEndpoint ) !== "undefined" ),    "Should be able to get SERVER_ENDPOINT property." );
    ok( ( typeof( campaignReadUrl ) !== "undefined" ),   "Should be able to get CAMPAIGN_READ_URL property." );
    ok( ( typeof( surveyUploadUrl ) !== "undefined" ),   "Should be able to get SURVEY_UPLOAD_URL property." );
    ok( ( typeof( passwordChangeUrl ) !== "undefined" ), "Should be able to get PASSWORD_CHANGE_URL property." );
});

test( "Test ConfigManager.getServers()", function() {
    ///
    var servers = ConfigManager.getServers();
    ///
    ok( servers.length > 1 ,    "There should be at least one server provided by the config manager." );
});

test( "Test ConfigManager.setServerEndpoint()", function() {
    var newServerEndpoint = "new-server-endpoint";
    ///
    ConfigManager.setServerEndpoint( newServerEndpoint );
    ///
    ok( ConfigManager.getServerEndpoint() === newServerEndpoint, "The server endpoint returned by the ConfigManager should match the new server endpoint." ); 
});

test( "Test ConfigManager.reset()", function() {
    var originalServerEndpoint = ConfigManager.getServerEndpoint();
    ConfigManager.setServerEndpoint( "new-server-endpoint" );
    ///
    ConfigManager.reset();
    ///
    ok( ConfigManager.getServerEndpoint() === originalServerEndpoint, "The server endpoint returned by the ConfigManager should match the new server endpoint." ); 
});

test( "Test ConfigManager.setGpsEnabled( true )", function() {
    ///
    ConfigManager.setGpsEnabled( true );
    ///
    ok( ConfigManager.getGpsEnabled() === true, "ConfigManager should enable GPS." ); 
});

test( "Test ConfigManager.setGpsEnabled( false )", function() {
    ///
    ConfigManager.setGpsEnabled( false );
    ///
    ok( ConfigManager.getGpsEnabled() === false, "ConfigManager should disable GPS." ); 
});