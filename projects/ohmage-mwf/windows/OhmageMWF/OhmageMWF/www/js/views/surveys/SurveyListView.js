var SurveyListView = function(surveys, title, onSurveyClickCallback){
    
    var self = {};
    
    var emptyListText = "No Surveys Found";
    var emptyListDetails = null;
    var emptyListClickCallback = null;
    
    self.setEmptyListViewParameters = function(listText, listDetails, listClickCallback){
        emptyListText = listText;
        emptyListDetails = listDetails;
        emptyListClickCallback = listClickCallback;
    };
    
    self.render = function(menu){
        
        menu = menu || mwf.decorator.Menu(title);
        var menuItem;
        if(surveys.length > 0) {
            var onSurveyClickCallbackClosure = function(survey){
                return function(){
                    PageNavigation.openSurveyView(survey.getCampaign().getURN(), survey.getID());
                };
            };

            for(var i = 0; i < surveys.length; i++){
                menuItem = menu.addMenuLinkItem(surveys[i].getTitle(), null, surveys[i].getDescription());
                TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, onSurveyClickCallbackClosure(surveys[i]), "menu-highlight");   
            }
        }else if (emptyListText !== null) {
            menuItem = menu.addMenuLinkItem(emptyListText, null, emptyListDetails);
            TouchEnabledItemModel.bindTouchEvent(menuItem, menuItem, emptyListClickCallback, "menu-highlight");
        }
        
        return menu;
    };
    
    return self;
};