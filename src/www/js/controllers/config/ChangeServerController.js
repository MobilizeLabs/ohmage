
var ChangeServerController = function () {
    "use strict";
    var that = {};

    var changeServerView = null;

    var log = Logger("ChangeServerController");

    var saveButtonCallback = function () {
        var serverEndpoint = changeServerView.getSelectedServer();
        log.info("New server endpoint was entered: [$1].", ConfigManager.getServerEndpoint());
        if (!/^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/.test(serverEndpoint)) {
            MessageDialogController.showMessage("Please enter a valid server name.");

        } else {
            ConfigManager.setServerEndpoint(serverEndpoint);
            log.info("Saved a new server endpoint [$1].", ConfigManager.getServerEndpoint());
            MessageDialogController.showMessage("Your selection has been saved.", PageController.openDashboard);
        }
    };

    that.getView = function () {
        if (changeServerView === null) {
            changeServerView = ChangeServerView(ConfigManager.getServers());
        }
        changeServerView.saveButtonHandler = saveButtonCallback;
        return changeServerView;
    };

    return that;
};