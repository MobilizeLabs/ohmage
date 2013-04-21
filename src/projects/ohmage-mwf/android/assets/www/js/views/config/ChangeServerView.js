var ChangeServerView = function (servers) {
    "use strict";
    var that = AbstractView();

    var TYPE_SERVER_NAME_OPTION = "Type Server Name:";

    /**
     * Handler for the save button. Should be implemented in the controller.
     */
    that.saveButtonHandler = function () {};

    that.render = function () {
        var form = mwf.decorator.Form("Available Servers");
        var select = document.createElement("select"),
            option,
            defaultServerSelected = false,
            i;

        for (i = 0; i < servers.length; i += 1) {
            option = document.createElement('option');
            option.value = servers[i];
            option.innerHTML = servers[i];
            select.appendChild(option);
            if (servers[i] === ConfigManager.getServerEndpoint()) {
                option.selected = "selected";
                defaultServerSelected = true;
            }
        }

        option = document.createElement('option');
        option.value = TYPE_SERVER_NAME_OPTION;
        option.innerHTML = TYPE_SERVER_NAME_OPTION;

        select.appendChild(option);

        form.addLabel("Server Endpoint");
        form.addItem(select);

        var customServerLabel =  document.createElement('label');
        customServerLabel.innerHTML = "Custom Server Endpoint";
        var customServerInput = document.createElement('input');

        form.addItem(customServerLabel);
        form.addItem(customServerInput);

        var hideCustomServerInput = function () {
            customServerLabel.style.display = 'none';
            customServerInput.style.display = 'none';
        };

        var showCustomServerInput = function () {
            customServerLabel.style.display = 'block';
            customServerInput.style.display = 'block';
        };

        var getSelectedServer = function () {
            return select.options[select.selectedIndex].value;
        };

        var getTypedServer = function () {
            return customServerInput.value;
        };

        select.onchange = function () {
            if (select.options[select.selectedIndex].value === TYPE_SERVER_NAME_OPTION) {
                showCustomServerInput();
                that.getSelectedServer = getTypedServer;
            } else {
                hideCustomServerInput();
                that.getSelectedServer = getSelectedServer;
            }
        };

        //If the selected server is 'custom', so previously the user has typed
        //a server name, we wanna display that server name in the input box.
        if (!defaultServerSelected) {
            option.selected = "selected";
            customServerInput.value = ConfigManager.getServerEndpoint();
        } else {
            hideCustomServerInput();
        }


        that.getSelectedServer = getSelectedServer;

        form.addInputButton("Save Selection", that.saveButtonHandler);
        form.setOnSubmitCallback(that.saveButtonHandler);

        return form;
    };

    return that;
};
