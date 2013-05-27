var HelpController = function(){
    var self = {};
    
    var helpModel  = new HelpModel();
    
    self.renderHelpMenu = function(){
        var helpMenuView = new HelpMenuView(helpModel.getAllSections());
        return helpMenuView.render();
    };
    
    self.renderHelpSection = function(index){
        var helpSectionView = new HelpSectionView(helpModel.getHelpSection(index));
        return helpSectionView.render();
    };
    
    return self;  
};