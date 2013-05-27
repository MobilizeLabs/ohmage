Init.invokeOnReady( function() {
    var helpController = new HelpController();
    var sectionIndex = PageNavigation.getPageParameter('help-section-index');
    if(sectionIndex === null){ PageNavigation.goBack(); }
    $('#help-container').append(helpController.renderHelpSection(sectionIndex));
});