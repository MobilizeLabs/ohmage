
var HelpMenuView = function(sections){
    var self = {};
    self.render = function(){
        var menu = mwf.decorator.Menu('Help Menu'),
        menuItem, i;
        var openHelpSectionCallback = function(index){
            return function () {
                PageNavigation.openHelpSectionView(index);
            };
        };
        for (i = 0; i < sections.length; i+=1) {
            menuItem = menu.addMenuLinkItem(sections[i].title, null, null);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, openHelpSectionCallback(i), "menu-highlight");
        }
        return menu;
    };
    return self;
};