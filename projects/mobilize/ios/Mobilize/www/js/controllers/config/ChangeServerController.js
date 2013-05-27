
var ChangeServerController = function() {
  var that = {};
  that.renderChangeServerView = function() {
      var changeServerView = ChangeServerView( ConfigManager.getServers() );  
      changeServerView.saveButtonHandler = function() {
          ConfigManager.setServerEndpoint( changeServerView.getSelectedServer() );
          console.log( "ChangeServerController: Saved a new server endpoint [" + ConfigManager.getServerEndpoint() + "]." );
          MessageDialogController.showMessage( "Your selection has been saved.", PageNavigation.openAuthenticationPage );
      };
      return changeServerView.render();
  };
  return that;
};