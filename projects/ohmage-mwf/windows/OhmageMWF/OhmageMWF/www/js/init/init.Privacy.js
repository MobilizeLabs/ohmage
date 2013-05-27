invokeOnReady(function(){

    (function(){

        var label = (auth.isUserAuthenticated()) ? "Dashboard" : "Login";
        var goBack = function(){

            if(auth.isUserAuthenticated()){
                PageNavigation.openDashboard();
            }else{
                PageNavigation.openAuthenticationPage();
            }

        };

        mwf.decorator.TopButton(label, null, goBack, true);

        $("#go-back-button").append(mwf.decorator.SingleClickButton(label, goBack));

    })();

});