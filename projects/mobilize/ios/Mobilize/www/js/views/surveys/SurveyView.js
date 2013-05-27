var SurveyView = function( surveyModel ) {
    
    var that = {};
    
    that.startSurveyButtonHandler = function() {};
    
    that.renderSummary = function() {
        var content = mwf.decorator.Content();
        content.setTitle( surveyModel.getTitle() );
        content.addTextBlock( surveyModel.getDescription() );
        return content;
    };
    
    that.render = function() {
        var container = document.createElement('div');
        container.appendChild( that.renderSummary() );
        container.appendChild( mwf.decorator.SingleClickButton( "Start Survey", that.startSurveyButtonHandler ) );
        return container;
    };
    
    return that;
};