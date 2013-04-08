var ProfileView = function () {
    "use strict";
    var that = AbstractView();

    that.changePasswordHandler = function () {};
    that.clearCustomizedChoicesHandler = function () {};
    that.enableGpsHandler = function () {};
    that.disableGpsHandler = function () {};
    that.logoutAndClearDataHandler = function () {};

    that.render = function () {
        var menu = mwf.decorator.Menu(auth.getUsername());

        if (DeviceDetection.isNativeApplication()) {
            var changePasswordMenuItem = menu.addMenuLinkItem('Change Password', null, 'Easily change your password.');
            TouchEnabledItemModel.bindTouchEvent(changePasswordMenuItem, changePasswordMenuItem, that.changePasswordHandler, "menu-highlight");
        }

        var clearCustomChoicesMenuItem = menu.addMenuLinkItem('Clear Customized Choices', null, "Erase any saved custom choices.");
        TouchEnabledItemModel.bindTouchEvent(clearCustomChoicesMenuItem, clearCustomChoicesMenuItem, that.clearCustomizedChoicesHandler, "menu-highlight");

        if (!ConfigManager.getGpsEnabled()) {
            var enableGpsMenuItem = menu.addMenuLinkItem('Enable GPS Acquisition', null, "By enabling GPS acquisition, all uploaded surveys will be geotaged with your current location.");
            TouchEnabledItemModel.bindTouchEvent(enableGpsMenuItem, enableGpsMenuItem, that.enableGpsHandler, "menu-highlight");
        } else {
            var disableGpsMenuItem = menu.addMenuLinkItem('Disable GPS Acquisition', null, "By disabling GPS acquisition, uploaded surveys will not include GPS location.");
            TouchEnabledItemModel.bindTouchEvent(disableGpsMenuItem, disableGpsMenuItem, that.disableGpsHandler, "menu-highlight");
        }

        var logoutMenuItem = menu.addMenuLinkItem('Logout and Clear Data', null, "When you logout, all the data stored on the phone will be completely erased.");
        TouchEnabledItemModel.bindTouchEvent(logoutMenuItem, logoutMenuItem, that.logoutAndClearDataHandler, "menu-highlight");
        return menu;
    };

    return that;
};