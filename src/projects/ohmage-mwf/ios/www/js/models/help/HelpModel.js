/**
 * @author Zorayr Khalapyan
 * @returns {{}}
 * @constructor
 */
var HelpModel = function () {
    "use strict";
    var that = {};
    var helpSections = [
        {
            title : 'Using the Dashboard',
            text  : 'Dashboard is the main page of the application. It allows \n\
                    quick access to campaigns, surveys, the upload queue, help \n\
                    tutorials and also allows users to log out.',
            img   : 'img/screenshots/dashboard.png'
        },

        {
         title:'Installing Campaigns',
         text: 'To install a new campaign, navigate to the campaigns section\n\
                from the dashboard, and click on one of the campaigns listed \n\
                under the \'Available Campaigns\' menu. If there are currently\n\
                no campaigns installed on the phone, you will automatically be\n\
                redirected to the available campaigns section. ',
         img:  'img/screenshots/installing-campaigns.png'
        },

        {
         title:'Taking Surveys',
         text: 'Click on one of the surveys to answer survey related prompts.',
         img:  'img/screenshots/taking-surveys.png'
        },

        {
         title:'Uploading Responses',
         text: 'You can view responses that have not been uploaded in the upload\n\
                queue section. Here you have the option to delete all the pending\n\
                uploads, upload all responses, or upload/delete individual survey\n\
                responses.',
         img:  'img/screenshots/uploading-responses.png'
        },

        {
         title:'Changing Password',
         text: 'Enter your current password, a new password and a confirmation\n\
                of the new password to change your password. When your password\n\
                is successfully changed, you will be directed to the login page\n\
                where you can use your new password to login.',
         img:  'img/screenshots/changing-password.png'
        }

    ];

    that.getAllSections = function () {
        return helpSections;
    };

    that.getHelpSection = function (index) {
        return helpSections[index];
    };

    return that;

};