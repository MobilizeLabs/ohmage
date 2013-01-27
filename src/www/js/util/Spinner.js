/*
 * The conscucted HTML will have the following structure:
 *
 *  <div class = "spinner-background" id = "spinner-background"></div>
 *
 *  <div class = "spinner-container">
 *    <div class = "spinner">
 *          <img src = "img/spinner_standard.gif" class = "spinner-img"/>
 *          <a href = "cancel_redirect_url" class = "cancel-link">
 *            Cancel Loading...
 *          </a>
 *    </div>
 *  </div>
 *
 */
var Spinner = (function () {

    var that = {};

    /**
     * Preload spinner image.
     */
    var spinnerImage = $('<img>')
                           .attr('src', 'img/spinner.gif' + '?' + new Date().getTime())
                           .addClass('spinner-img')
                           .attr('id','spinner-img');
    var isLoading = false;

    var container = $("<div>");
    container.attr("class", "spinner-container");
    container.attr("id"   , "spinner-container");

    var spinner = $("<div>");
    spinner.attr("class", "spinner");
    spinner.attr("id"   , "spinner");


    var cancelLink = $("<a>");
    cancelLink.attr("href" , null);
    cancelLink.attr("class", "cancel_link");
    cancelLink.text("Cancel Loading...");
    cancelLink.hide();

    spinner.append(spinnerImage);
    spinner.append(cancelLink);
    container.append(spinner);

    /**
     * Dislpays a loading spinner with a cancel link on a transparent background
     * that completely covers the document.
     *
     * To hide the displayed spinner, use hide_spinner().

     */
    that.show = function(cancelCallback){

        if(isLoading){
            console.log("Spinner: show() canceled because spinner is already active.");
            return;
        }else{
            isLoading = true;
        }
        console.log("Spinner: Showing spinner.");

        //Force to reload the GIF - otherwise, the user will notice glitches.
        $("#spinner-img").attr('src','')
                         .attr('src', 'img/spinner.gif' + "?" + new Date().getTime());
        $("#spinner-img").show();
        //Display the transparent background.
        showBackground();


        if(cancelCallback){
            cancelLink.show();
            cancelLink.onClick = function(){
                cancelCallback();
            };

        }

        $(document.body).append(container);

        //Calculate the left and top positions for the spinner div. Take into
        //account the fact that the user might have scrolled the window up or down
        //and even in that case, the div should be displayed about at the center of
        //the page.
        var spinnerTop = 140 + $(window).scrollTop() + "px";

        var spinnerLeft = $(window).scrollLeft() +
                          ($(window).width() - spinner.outerWidth()) / 2 + "px";


        //Set the top and left values for the spinner div.
        spinner.css("top" , spinnerTop);
        spinner.css("left", spinnerLeft);

    };

    var timer = null;
    var currentOrientation = null;
    var docWidth, docHeight;

    /**
     * The method resizes the translucent background image when the orientation of
     * the device changes.
     */
    var detectOrientation = function () {

        if (!window.orientation || !isLoading) {
            return;
        }


        //This is some crazy magic that I never want to visit again.
        if (currentOrientation === null || currentOrientation !== window.orientation) {
            var width, height, topOffset;

            if(isPortrait()){
                topOffset = 140;
                width = Math.min(docWidth, docHeight);
                height = Math.max(docWidth, docHeight);

            }else if(isLandscape()){
                topOffset = 80;
                width = Math.max(docWidth, docHeight) + 50;
                height = Math.min(docWidth, docHeight);
            }

            $("#spinner-background").width("0px").width(width + "px");
            $("#spinner-background").height("0px").height(height + "px");

            currentOrientation = window.orientation;

            var spinnerTop =  $(window).scrollTop() + topOffset + "px";
            var spinnerLeft = $(window).scrollLeft() + (width - $("#spinner").outerWidth()) / 2 + "px";

            //Set the top and left values for the spinner div.
            $("#spinner").css("top" , spinnerTop);
            $("#spinner").css("left", spinnerLeft);
        }
    };

    //Create a div tag to represent the transparent spinner background.
    var background = $(document.createElement("div"));

    background.attr("class", "spinner-background");
    background.attr("id"   , "spinner-background");

    /**
     * The method displays the spinner's transparent background. A div that covers
     * the entire document's area will be added to the document's body with the ID
     * of spinner_background.
     */
    var showBackground = function(){

        //Append the created background to the body of the
        $(document.body).append(background);

        docWidth  = $(document).width();
        docHeight = $(document).height();

        //Set the backgrounds width and height to equal to the width and height of
        //the current document.
        $("#spinner-background").width(docWidth + "px");
        $("#spinner-background").height(docHeight + "px");

        timer = setInterval(function(){
            detectOrientation();
        }, 15);

    };


    /**
     * Removes the spinner transparent background and also the loading sign with the
     * cancel link.
     */
    that.hide = function(callback){

        if(!isLoading){
            console.log("Spinner: hide() canceled because spinner is already inactive.");
            if(callback){
                callback();
                return;
            }
        }else{
            isLoading = false;
        }

        console.log("Spinner: Hiding spinner.");

        var fadeOutCallback = function(){
          $("#spinner-background,#spinner-container").remove();
            if(callback){
                callback();
            }
        };

        cancelLink.hide();

        if($("#spinner-container").is(":visible") === false){
            $("#spinner-background").hide();
            $("#spinner-container").hide();

            fadeOutCallback();
        }else{
            $("#spinner-background").fadeOut(25);
            $("#spinner-container").fadeOut(25, fadeOutCallback());
        }

        //Cancel orientation detection timer.
        if (timer) {
            clearInterval(timer);
        }
    };

    function isLandscape(){
        return ( window.orientation === 90 || window.orientation === -90 );
    }

    function isPortrait(){
        return ( window.orientation === 0 || window.orientation === 180 );
    }

    return that;
}());