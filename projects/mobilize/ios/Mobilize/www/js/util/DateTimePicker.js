
var DateTimePicker = function(){
    
    /**
     * Regular expression for validating the time component of a timestamp prompt.
     */
    var DATE_REGEX = "[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])";

    /**
     * Regular expression for validating the time component of a timestamp prompt.
     */
    var TIME_REGEX = "^(([0-9])|([0-1][0-9])|([2][0-3])):(([0-9])|([0-5][0-9]))$";

    //Left pads 'd' to '0d', if necessary.
    var leftPad = function(number){
        return ((String(number)).length === 1) ? "0" + number : number;
    };

    /**
     * Returns date formated as YYYY-MM-DD.
     */
    var getFullDate = function(date){
        return date.getFullYear() + "-" +
               leftPad(date.getMonth() + 1) + "-" +
               leftPad(date.getDate());
    };
    
    this.createDatePicker = function(date){
        date = date || new Date();

        var datePicker = document.createElement('input');
        datePicker.type = 'date';
        datePicker.value = getFullDate(date);

        //Handle browsers that don't support HTML5's input=date.
        //This is kind of a hack since Android browser engine sets the input
        //type to 'date' but doesn't really support it.
        if(datePicker.type === 'text' || navigator.userAgent.match(/(Android)/)){
            $(datePicker).scroller({dateFormat:'yyyy-mm-dd', dateOrder:'yymmdd'});
        }
        
        datePicker.isValid = function(){
            return datePicker.value.match(DATE_REGEX);
        };

        return datePicker;
    };

    this.createTimePicker = function(date){
        date = date || new Date();

        var timePicker = document.createElement('input');
        timePicker.type = 'time';
        timePicker.value = leftPad(date.getHours()) + ":" + leftPad(date.getMinutes());

        //Handle browsers that don't support HTML5's input=time.
        if(timePicker.type === 'text' || navigator.userAgent.match(/(Android)/)){
            $(timePicker).scroller({preset:'time', ampm: false, timeFormat:'HH:ii'});
        }
        
        timePicker.isValid = function(){
            return timePicker.value.match(TIME_REGEX);
        };
        
        timePicker.getInput = function(){
            return timePicker.value;
        };
        
        timePicker.getHours = function(){
            return parseInt(timePicker.getInput().split(":")[0], 10);
        };
        
        timePicker.getMinutes = function(){
            return parseInt(timePicker.getInput().split(":")[1], 10);
        };
        
        
        return timePicker;
    };

};

DateTimePicker.createDateTimeForm = function(title, datePicker, timePicker){
    
    var form = mwf.decorator.Form(title);

    form.addLabel("Select Date");
    form.addItem(datePicker);

    form.addLabel("Select Time");
    form.addItem(timePicker);

    return form;
};

/**
 * Returns HH:MM
 */
DateTimePicker.getPaddedTime = function(date){
    return date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "" ) + date.getMinutes();
};

