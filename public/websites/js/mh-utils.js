/*
Add this function in your script and call it with the script url

    var loadScript = function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    }

    loadScript("https://d8b97b58.ngrok.io/js/utils/mh-utils.min.js",
    );

    var logger = new MhLogger(true, "[APP_TEST]");
    logger.info("test");

    var utils = new MhUtils(logger);

    Examples of the MHUtils class in the documentation

    Example:

        var logger;
        var utils;
        var mh = {
            config: {
                debug: true,
                app: {
                    name: "[EXAMPLE]"
                }
            }
        };

        mh.app = new function() {
            this.init = function(callback) {
                this.loadScript("https://d8b97b58.ngrok.io/js/utils/mh-utils.js", function() {
                    logger = new MhLogger(mh.config.debug, mh.config.app.name);
                    utils  = new MhUtils(logger);
                    callback();
                });
            };
            this.loadScript = function(url, callback) {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.onreadystatechange = callback;
                script.onload = callback;
                head.appendChild(script);
            };
        }

        mh.app.init(function() {
            logger.info("Script loaded XD");
        });

Minified with uglifyjs
Run this command and paste the result into the min file

>>> uglifyjs mh-utils.js -c -m --mangle-props reserved=[getUrlParam,isUndefined,setEventByClassName,encodeBase64,decodeBase64,isCookieEnable,getJsonAsObject,getObjectAsJson,getObjectAsJsonEncoded,getJsonEncodedAsObject,saveCookieData,getCookieData,requestGet,requestPost,redirectTo]

*/

/**
 * @constructor
 * @param {Boolean} debug    Is a flag to enable the logger
 * @param {String} appName   Name of the application
 */
var MhLogger = function (debug, appName) {

    this._debug = debug;
    this._appName = appName;

    this._log = function (message, color) {
        if (this._debug) console.log("%c " + this._appName + " " + message, "color: " + color + ";");
    }
    this.info = function (message) {
        this._log(message, "green");
    };
    this.error = function (message) {
        this._log(message, "red");
    };
    this.warn = function (message) {
        this._log(message, "#ff9966");
    };
};

/**
 * This utils class contains all basic functions about cookie, encriptation and request
 *
 * @constructor
 * @param {MhLogger} logger       Is a class used for debug the application
 * @param {String} [keyStr]       Salt used in the encode and decode in base 64
 * @param {String} [cookieTest]   Cookie configuration used for check if the cookies is enabled
 */
var MhUtils = function (logger, keyStr, cookieTest) {

    this._keyStr = (keyStr == null || a == "undefined") ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" : keyStr;

    this._cookieTest = (cookieTest == null || a == "undefined") ? {
        name: "__t",
        duration: 1
    } : cookieTest;

    this._logger = logger;

    this._messages = {
        ok: {
            getUserDataFromCookie: "[GET_USER_COOKIE] User data getted successfully",
            setEventByClass: "[SET_EVENT] Event setted successfully. Class name: "
        },
        error: {
            getUserDataFromCookie: "[GET_USER_COOKIE] Error getting the user cookie",
            setEventByClass: "[SET_EVENT] Error setting the event. Class name: "
        }
    };

    this._utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };

    this._utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };

    this._initRequest = function (type, url, async, headers, withCredentials = false) {
        headers = (this.isUndefined(headers)) ? [{
            key: 'Access-Control-Allow-Headers',
            value: '*'
        },
        {
            key: 'Access-Control-Allow-Origin',
            value: '*'
        },
        {
            key: 'Content-type',
            value: 'application/json; charset=utf-8'
        },
        ] : headers;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(type, url, async);
        xmlhttp.withCredentials = withCredentials;
        for (var i = 0; i < headers.length; i++) {
            xmlhttp.setRequestHeader(headers[i].key, headers[i].value);
        }
        return xmlhttp;
    };

    /**
     * Get the param url
     *
     * @example
     *
     * URL => https://example.com/test?paramName=pepe
     *
     * var result = utils.getUrlParam(paramName);
     * console.log(result);     "pepe"
     *
     * @param {String} paramName Name of the param
     * @returns {any} Param value
     */
    this.getUrlParam = function (paramName) {
        var url = location.href;
        paramName = paramName.toString().replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + paramName + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    };

    /**
     * Redirect the page to url
     *
     * @param {String} url Page url
     */
    this.redirectTo = function (url) {
        window.location.href = url;
    };

    /**
     * Set a function to all element in the page who contains the class name. When the event is triggered call the function
     *
     * @example
     *
     * var test = { name: "example" };
     * var result = utils.isUndefined(test);
     * console.log(result);     false
     *
     * @param {Object} a
     * @returns {Boolean}
     */
    this.isUndefined = function (a) {
        return (a == null || a == "undefined");
    };

    /**
     * Set a function to all element in the page who contains the class name. When the event is triggered call the function
     *
     * @example
     *
     * utils.setEventByClassName("example", "click", function(){ console.log("hello") });
     *
     * @param {String} name - Class name
     * @param {String} event - Event type ( https://developer.mozilla.org/en-US/docs/Web/Events )
     * @param {Function} callback
     * @returns {String} String content encoded
     */
    this.setEventByClassName = function (name, event, callback) {
        var x = document.getElementsByClassName(name);
        var i;
        if (x && x.length > 0) {
            for (i = 0; i < x.length; i++) {
                x[i].addEventListener(event, function () {
                    callback();
                });
            }
            this._logger.info(this._messages.ok.setEventByClass + name);
        } else {
            this._logger.warn(this._messages.error.setEventByClass + name);
        }
    };

    /**
     * Set a function to a element in the page who contains the id name. When the event is triggered call the function
     *
     * @example
     *
     * utils.setEventById("example", "click", function(){ console.log("hello") });
     *
     * @param {String} name - Class name
     * @param {String} event - Event type ( https://developer.mozilla.org/en-US/docs/Web/Events )
     * @param {Function} callback
     * @returns {String} String content encoded
     */
    this.setEventById = function (name, event, callback) {
        var x = document.getElementById(name);
        if (x) {
            x.addEventListener(event, function () {
                callback();
            });
            this._logger.info(this._messages.ok.setEventByClass + name);
        } else {
            this._logger.warn(this._messages.error.setEventByClass + name);
        }
    };

    /**
     * Remove a function to a element in the page who contains the id name.
     *
     * @example
     *
     * utils.unSetEventById("example", "click", function(){ console.log("hello") });
     *
     * @param {String} name - Class name
     * @param {String} event - Event type ( https://developer.mozilla.org/en-US/docs/Web/Events )
     * @param {Function} callback
     * @returns {String} String content encoded
     */
    this.unSetEventById = function (name, event, callback) {
        var x = document.getElementById(name);
        if (x) {
            x.removeEventListener(event, function () {
                callback();
            });
            this._logger.info(this._messages.ok.setEventByClass + name);
        } else {
            this._logger.warn(this._messages.error.setEventByClass + name);
        }
    };

    /**
     * Get string encoded in base 64
     *
     * @example
     *
     * var result = utils.decodeBase64("{ 'name' : 'test' }");
     * console.log(result);     "eyAibmFtZSIgOiAidGVzdCIgfQ=="
     *
     * @param {String} input - String to encode
     * @returns {String} String content encoded
     */
    this.encodeBase64 = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    };

    /**
     * Get string decoded from a string encoded in base 64
     *
     * @example
     *
     * var result = utils.decodeBase64("eyAibmFtZSIgOiAidGVzdCIgfQ==");
     * console.log(result);     "{ 'name' : 'test' }"
     *
     * @param {String} input - String encoded
     * @returns {String} String content decoded
     */
    this.decodeBase64 = function (input) {
        if (input === undefined) return input;

        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    };

    /**
     * Get data from a cookie stored in the navigator
     *
     * @example
     *
     * utils.getCookie("test");
     *
     * @param {String} name - The name of the cookie.
     * @returns {String} The cookie content
     */
    this.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    };

    this.hasCookie = function (cname) {
        return (!this.isUndefined(this.getCookie(cname)));
    };

    this.getCookieDomain = function() {
        var domain = window.location.host;
        var result = domain.split(".");
        if (result.length >= 2) {
            return " path=/; domain=." + result[result.length - 2] + "." + result[result.length - 1] + ";";
        }
        return "";
    }

    /**
     * Set a cookie in the navigator
     *
     * @example
     *
     * utils.setCookie("test", "example", 1);
     *
     * @param {String} name - The name of the cookie.
     * @param {String} value - String with all data to persist in the cookie.
     * @param {Number} days - The duration of the cookie in days.
     */
    this.setCookie = function (name, value, days, location) {
        var extraParam = this.getCookieDomain();
        if (!this.isUndefined(location)) {
            extraParam = location;
        }

        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + ";" + extraParam;
    };

    /**
     * Will save the cookie as a list of comma-separated values. Will only save 
     * the value if it doesn't exist
     *
     * @example
     *
     * utils.setListCookie("test", "example", 1);
     *
     * @param {String} name - The name of the cookie.
     * @param {String} value - String with all data to persist in the cookie.
     * @param {Number} days - The duration of the cookie in days.
     */
    this.setListCookie = function (name, value, days, location) {
        var extraParam = this.getCookieDomain();
        if (!this.isUndefined(location)) {
            extraParam = location;
        }
        var expires;
        var newValue = value;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }

        if (this.hasCookie(name)) {
            var oldValue = this.getCookie(name);
            if (!this._cookieValueExist(oldValue, value)) {
                newValue = `${oldValue},${value}`;
            } else {
                newValue = oldValue;
            }
        }

        document.cookie = `${name}=${newValue}${expires};${extraParam}`;
    };

    /**
     * Checks a comma-separated string for value passed as parameter. 
     *
     * @example
     *
     * utils._cookieValueExist("asd@asd.com,dsa@dsa.com", "asd@asd.com");
     *
     * @param {String} cookieValue - The cookie value.
     * @param {String} valueToCheck - The value to check with the old cookie value.
     * 
     * @returns {Boolean} True if exists, false otherwise
     */
    this._cookieValueExist = function(cookieValue, valueToCheck) {
        var result = false;
        var values = cookieValue.split(",");

        values.forEach(value => {
            if (value === valueToCheck) {
                result = true;
            }
        });

        return result;
    };

    /**
     * Return if the cookie storage is enabled in the navigator
     *
     * @example
     *
     * var result = utils.isCookieEnable();
     * console.log(result);     true
     * @returns {Boolean}
     */
    this.isCookieEnable = function () {
        if (!mh.utils.isUndefined(navigator.cookieEnabled)) {
            this.set(this._cookieTest.name, "1", this._cookieTest.duration);
            return ("1" === this.get(this._cookieTest.name)) ? true : false;
        } else {
            return false;
        }
    };

    /**
     * Get json as string
     *
     * @example
     * var data = { name : 'test' };
     *
     * var result = utils.getObjectAsJson(data);
     * console.log(result);     "{ 'name' : 'test' }"
     *
     * @param {Object} object - String that contains a encoded json in base 64
     * @returns {String} Object generated from a json string
     */
    this.getObjectAsJson = function (object) {
        return JSON.stringify(object);
    };

    /**
     * Get json as object
     *
     * @example
     * var data = "{ 'name' : 'test' }"
     *
     * var result = utils.getJsonAsObject(data);
     * console.log(result);     { name : 'test' }
     *
     * @param {String} json - String that contains a json
     * @returns {Object} Object generated from a json string
     */
    this.getJsonAsObject = function (json) {
        return JSON.parse(json);
    };

    /**
     * Get json encoded generated from a object
     *
     * @example
     * var data = { name : 'test' };
     *
     * var result = utils.getObjectAsJsonEncoded(data);
     * console.log(result);     "eyAibmFtZSIgOiAidGVzdCIgfQ=="
     *
     * @param {Object} object - Object with information
     * @returns {String} Json encoded generated from a object
     */
    this.getObjectAsJsonEncoded = function (object) {
        return this.encodeBase64(this.getObjectAsJson(object));
    };

    /**
     * Get object stored in a string encripted
     *
     * @example
     * var data = "eyAibmFtZSIgOiAidGVzdCIgfQ==";
     *
     * var result = utils.getDataDecodedAsJson(data);
     * console.log(result);     { "name" : "test" }
     *
     * @param {String} data - String that contains a encoded json in base 64
     * @returns {Object} Object generated from a json string
     */
    this.getJsonEncodedAsObject = function (data) {
        if (data === undefined) return data;
        return this.getJsonAsObject(this.decodeBase64(data));
    };

    /**
     * Save data in a cookie with or without encoding.
     *
     * @example
     * var cookieData = { name: "__example", duration: 1, data: { token: "example" } };
     *
     * utils.saveCookieData(cookieData); Without encoding
     * utils.saveCookieData(cookieData, true); With encoding
     *
     * @param {Object} cookieData - Object with name, data and duration of the cookie.
     * @param {String} cookieData.name - The name of the cookie.
     * @param {Number} cookieData.duration - The duration of the cookie in days.
     * @param {Object} cookieData.data - Object with all data to persist in the cookie.
     * @param {Boolean} [encoded=false] - Is a flag used for enabling the encoding.
     */
    this.saveCookieData = function (cookieData, encoded, location) {
        encoded = (this.isUndefined(encoded)) ? false : encoded;
        var data = (encoded) ? this.getObjectAsJsonEncoded(cookieData.data) : this.getObjectAsJson(cookieData.data);
        this.setCookie(cookieData.name, data, cookieData.duration, location);
    };

    /**
     * Save data in a cookie as a list with or without encoding
     *
     * @example
     * var cookieData = { name: "__example", duration: 1, data: { token: "example" } };
     *
     * utils.saveListCookieData(cookieData); Without encoding
     * utils.saveListCookieData(cookieData, true); With encoding
     *
     * @param {Object} cookieData - Object with name, data and duration of the cookie.
     * @param {String} cookieData.name - The name of the cookie.
     * @param {Number} cookieData.duration - The duration of the cookie in days.
     * @param {Object} cookieData.data - Object with all data to persist in the cookie; this will be used
     *                                   to append the new value to the old ones
     * @param {Boolean} [encoded=false] - Is a flag used for enabling the encoding.
     */
    this.saveListCookieData = function (cookieData, encoded) {
        //encoded = (this.isUndefined(encoded)) ? false : encoded;
        var data = /*(encoded) ? this.getObjectAsJsonEncoded(cookieData.data) :*/ this.getObjectAsJson(cookieData.data);
        this.setListCookie(cookieData.name, data, cookieData.duration);
    };

    /**
     * Delete cookie from the navigator
     *
     * @param {String} name - The name of the cookie
     */
    this.deleteCookieData = function (name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    /**
     * Get data stored in a cookie with or without encoding.
     *
     * @example
     * var cookieData = { name: "__example", duration: 1, data: { token: "example" } };
     *
     * var result = utils.getCookieData(cookieData.name); Without encoding
     * console.log(result);     { token: "example" }
     *
     * var result = utils.getCookieData(cookieData.name, true); With encoding
     * console.log(result);     { token: "example" }
     *
     * @param {String} name - The name of the cookie.
     * @param {Boolean} [encoded=false] - Is a flag used for enabling the encoding.
     */
    this.getCookieData = function (name, encoded) {
        encoded = (this.isUndefined(encoded)) ? false : encoded;
        var data = this.getCookie(name);
        return (encoded) ? this.getJsonEncodedAsObject(data) : this.getJsonAsObject(data);
    };

    this.replaceInnerTextById = function (id, value) {
        var field = document.getElementById(id);
        if (!utils.isUndefined(field)) {
            field.innerText = value;
        }
    }

    this.replaceValueById = function (id, value) {
        var field = document.getElementById(id);
        if (!utils.isUndefined(field)) {
            field.value = value;
        }
    }

    this.replaceActionById = function (id, value) {
        var field = document.getElementById(id);
        if (!utils.isUndefined(field)) {
            field.action = value;
        }
    }

    this.replaceInnerTextByIdAndTarget = function (id, replaceTarget, data) {
        var field = document.getElementById(id);
        if (!utils.isUndefined(field)) {
            field.innerText = field.innerText.replace(replaceTarget, data);
        }
    }

    /**
     * Method used to make get request
     *
     * @example
     * var headers = [{
     *        key: 'Access-Control-Allow-Headers',
     *        value: '*'
     *    },
     *    {
     *        key: 'Access-Control-Allow-Origin',
     *        value: '*'
     *    },
     *    {
     *        key: 'Content-type',
     *        value: 'application/json; charset=utf-8'
     *    },
     * ];
     *
     * utils.requestGet("https://example.com/status", headers,
     * function(result) {
     *      console.log(result);    "OK"
     * },
     * function(error) {
     *      console.log(error);     "error example"
     * });
     *
     * @param {String} url - Url of the api
     * @param {Function} resolve
     * @param {Function} reject
     * @param {Array} [headers] - Headers to send with the request
     */
    this.requestGet = function (url, resolve, reject, headers, withCredentials = false) {
        var xmlhttp = this._initRequest("GET", url, true, headers, withCredentials);
        xmlhttp.onload = function () {
            if (xmlhttp.status === 200) {
                try {
                    if (!(xmlhttp.responseText == null || xmlhttp.responseText == "undefined") && xmlhttp.responseText != "") {
                        var data = JSON.parse(xmlhttp.responseText);
                        resolve(data);
                    } else {
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(xmlhttp.responseText);
            }
        };
        xmlhttp.onerror = function () {
            reject(xmlhttp.responseText);
        };
        xmlhttp.send();
    };

    /**
     * Method used to make get request
     *
     * @example
     * var headers = [{
     *        key: 'Access-Control-Allow-Headers',
     *        value: '*'
     *    },
     *    {
     *        key: 'Access-Control-Allow-Origin',
     *        value: '*'
     *    },
     *    {
     *        key: 'Content-type',
     *        value: 'application/json; charset=utf-8'
     *    },
     * ];
     *
     * var car = {
     *      model: "example"
     * };
     *
     * var data = utils.getObjectAsJson(car);
     *
     * utils.requestGet("https://example.com/status", headers, data
     * function(result) {
     *      console.log(result);    "OK"
     * },
     * function(error) {
     *      console.log(error);     "error example"
     * });
     *
     * @param {String} url - Url of the api
     * @param {String} data - Json with all content to send
     * @param {Function} resolve
     * @param {Function} reject
     * @param {Array} [headers] - Headers to send with the request
     */
    this.requestPost = function (url, data, resolve, reject, headers, withCredentials = false) {
        var params = typeof data == 'string' ? data : Object.keys(data).map(
            function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
            }
        ).join('&');
        var xmlhttp = this._initRequest("POST", url, true, headers, withCredentials);
        xmlhttp.onload = function () {
            if (xmlhttp.status === 200) {
                try {
                    if (!(xmlhttp.responseText == null || xmlhttp.responseText == "undefined") && xmlhttp.responseText != "") {
                        var data = JSON.parse(xmlhttp.responseText);
                        resolve(data);
                    } else {
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            } else {
                reject(xmlhttp.responseText);
            }
        };
        xmlhttp.onerror = function () {
            reject(xmlhttp.responseText);
        };
        xmlhttp.send(params);
    };

    /**
     * Creates an object to hold Ad Info
     * @param id
     * @returns {{id: *, date: number}}
     */
    this.createAdIdCookieObject = function (id) {
        return id ? { "id": id, "date": Date.now()}: null;
    };

    /**
     * Fast UUID generator, RFC4122 version 4 compliant.
     * @author Jeff Ward (jcward.com).
     * @license MIT license
     * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
     **/
    this.UUID = (function() {
        var self = {};
        var lut = []; 
        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }

        self.generate = function() {
            var d0 = Math.random()*0xffffffff|0;
            var d1 = Math.random()*0xffffffff|0;
            var d2 = Math.random()*0xffffffff|0;
            var d3 = Math.random()*0xffffffff|0;

            return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
                lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
                lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
                lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
        }

        return self;
    })();


    this.requestSessionId = function (url, resolve, reject, headers, withCredentials = false) {
        var xmlhttp = this._initRequest("GET", url, true, headers, withCredentials);
        xmlhttp.onload = function () {
            if (xmlhttp.status === 200 || xmlhttp.status === 304) {
                try {
                    var sessionId = xmlhttp.getResponseHeader("Session-ID");
                    if (sessionId != null && sessionId !== "undefined" && sessionId !== "" && sessionId !== "null") {
                        resolve(sessionId);
                    } else {
                        reject(xmlhttp.responseText);
                    }
                } catch (e) {
                    reject(e);
                }
            } else {
                reject("http status: " + xmlhttp.status + " - " +  xmlhttp.responseText);
            }
        };
        xmlhttp.onerror = function () {
            reject(xmlhttp.responseText);
        };
        xmlhttp.send();
    };

    this.getSessionIdHeaders = function (sessionId) {
        return [{
                key: 'Access-Control-Allow-Headers',
                value: '*'
            },
            {
                key: 'Access-Control-Allow-Origin',
                value: '*'
            },
            {
                key: 'Content-type',
                value: 'application/json; charset=utf-8'
            },
            {
                key: "Session-ID",
                value: sessionId
            }];
    };
}
