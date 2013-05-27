var Profile = new function(){

    this.render = function(){

        var container = document.createElement('div');

        var menu = mwf.decorator.Menu(auth.getUsername());

        var changePasswordMenuItem = menu.addMenuLinkItem('Change Password', null, 'Easily change your password.');
        TouchEnabledItemModel.bindTouchEvent(changePasswordMenuItem, changePasswordMenuItem, PageNavigation.openChangePasswordPage, "menu-highlight");
        
        var clearCustomChoicesMenuItem = menu.addMenuLinkItem('Clear Customized Choices', null, "Erase any saved custom choices.");
        var clearCustomChoicesCallback  = function(){
            var confirmMessage = "Are you sure you would like to clear all your custom choices?";
            var confirmButtonLabels = "Yes,No";
            var confirmCallback = function(confirmed){
                if(confirmed){
                    CustomPropertiesVault.deleteAllCustomProperties();
                    showMessage("All custom choices have been cleared.");
                }
            };
            showConfirm(confirmMessage, confirmCallback, confirmButtonLabels);
        };
        TouchEnabledItemModel.bindTouchEvent(clearCustomChoicesMenuItem, clearCustomChoicesMenuItem, clearCustomChoicesCallback, "menu-highlight");
        
        var logoutCallback = function(){
            if(auth.logout()){
                PageNavigation.openAuthenticationPage();
            }
        };   
        var logoutMenuItem = menu.addMenuLinkItem('Logout and Clear Data', null, "When you logout, all the data stored on the phone will be completely erased.");
        TouchEnabledItemModel.bindTouchEvent(logoutMenuItem, logoutMenuItem, logoutCallback, "menu-highlight");
     

        var dashboard = mwf.decorator.SingleClickButton("Dashboard", function(){
           PageNavigation.openDashboard();
        });

        container.appendChild(menu);
        container.appendChild(dashboard);

        return container;
    };
};