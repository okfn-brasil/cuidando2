define(["base64"], function() {

    'use strict';


    function base64_url_decode(str) {
        var output = str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += "==";
            break;
        case 3:
            output += "=";
            break;
        default:
            throw "Illegal base64url string!";
        }

        var result = window.atob(output);

        try{
            return decodeURIComponent(escape(result));
        } catch (err) {
            return result;
        }
    }

    function json_parse(str) {
        var parsed;
        if (typeof JSON === 'object') {
            parsed = JSON.parse(str);
        } else {
            console.log("Warning: using 'eval'! Old browser?")
            parsed = eval('(' + str + ')');
        }
        return parsed;
    }

    return function(token) {
        if (!token) {
            throw new Error('Invalid token specified');
        }
        return json_parse(base64_url_decode(token.split('.')[1]));
    }

});
