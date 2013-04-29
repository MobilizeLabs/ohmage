Init.invokeOnReady(function() {

    var isInputValid = function(){

        if($('#current-password').val().length == 0){
            MessageDialogController.showMessage('Please enter your current password.');
            $('#current-password').focus();

            return false;
        }

        if($('#new-password').val().length == 0){
            MessageDialogController.showMessage('Please enter your new password.');
            $('#new-password').focus();
            return false;
        }


        if($('#confirm-password').val().length == 0){
            MessageDialogController.showMessage('Please confirm your password.');
            $('#confirm-password').focus();
            return false;
        }

        if($('#new-password').val() != $('#confirm-password').val()){
            MessageDialogController.showMessage('New password and password confirmation do not match.');
            $('#confirm-password').focus();
            return false;
        }

        if(!auth.isPasswordValid($('#new-password').val())){
            MessageDialogController.showMessage(auth.getPasswordRequirements());
            $('#new-password').focus();
            return false;
        }

        return true;

    };

    $("#change-password").click(function(){

        if(!isInputValid())
            return;

        var currentPassword = $("#current-password").val();
        var newPassword     = $("#new-password").val();

        var onSuccess = function() {
            Spinner.hide(function(){
                auth.setAuthErrorState(true);
                MessageDialogController.showMessage('Your password has been successfully changed. Please login to continue.');
                PageNavigation.openAuthenticationPage();
            });


        };

        var onError = function(response){
            Spinner.hide(function(){
                if(response){
                    MessageDialogController.showMessage(response.errors[0].text);
                }else{
                    MessageDialogController.showMessage('Network error occured. Please try again.');
                }

                $('#current-password').focus();
            });



        };

        Spinner.show();

        ServiceController.serviceCall(
             "POST",
             ConfigManager.getPasswordChangeUrl(),
             {
                 auth_token:   auth.getHashedPassword(),
                 client:       ConfigManager.getClientName(),
                 user:         auth.getUsername(),
                 password:     currentPassword,
                 new_password: newPassword

             },
             "JSON",
             onSuccess,
             onError,
             false
        );

   });

});