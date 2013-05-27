var Strings = (function(){

    //Locale, initialized to the default.
    this.locale = 'EN_US';

    this.get = function(key){
        return Strings[this.locale][key];
    };

    this.getLocale = function(){
        return this.locale;
    }

    this.setLocale = function(locale){
        this.locale = locale;
    }
});

Strings.EN_US =
{

};