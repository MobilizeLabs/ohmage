invokeOnReady(function(){
    $('#help-container').append((new HelpController()).renderHelpMenu());
});