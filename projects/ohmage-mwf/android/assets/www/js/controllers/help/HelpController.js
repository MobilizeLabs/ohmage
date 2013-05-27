var HelpController = function () {
    "use strict";
    var that = {};

    var helpModel = HelpModel();

    that.getHelpMenuView = function () {
        var helpMenuView = HelpMenuView(helpModel.getAllSections());
        helpMenuView.helpSectionClickedCallback = function (helpSectionIndex) {
            PageController.openHelpSection({helpSectionIndex : helpSectionIndex});
        };
        return helpMenuView;
    };

    that.getHelpSectionView = function (helpSectionIndex) {
        return HelpSectionView(helpModel.getHelpSection(helpSectionIndex));
    };

    return that;
};