/*
* Copyright (c) 2014 Takeshi Kurosawa. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*
*/

var NuMarkupChecker = (function() {
    "use strict";

    return {
        _getMultipartFormData : function(boundary, params) {
            var payload = [];
            for (var key in params) {
                if (!params.hasOwnProperty(key)) {
                    continue;
                }
                payload.push("--" + boundary);
                payload.push("Content-Disposition: form-data; name=\"" + key + "\"");
                payload.push("");
                payload.push(params[key]);
            }
            payload.push("--" + boundary + "--");
            return payload.join("\r\n");
        },

        // https://github.com/validator/nu-validator-site/blob/master/presets.txt
        _PRESET : {
            TRANSITIONAL : "http://s.validator.nu/xhtml10/xhtml-transitional.rnc http://s.validator.nu/html4/assertions.sch http://c.validator.nu/all-html4/",
            STRICT : "http://s.validator.nu/xhtml10/xhtml-strict.rnc http://s.validator.nu/html4/assertions.sch http://c.validator.nu/all-html4/",
        },

        // https://github.com/validator/validator/blob/master/src/nu/validator/servlet/VerifierServletTransaction.java
        _PARSER : {
            XMLDTD : "xmldtd",
            HTML : "html"
        },
        
        _SNIFFDOCTYPE : {
            YES : "yes",
            NO : "no"
        },

        // https://github.com/validator/validator/blob/master/src/nu/validator/servlet/VerifierServletTransaction.java
        sIDENTIFIERS : null,
        _IDENTIFIERS : function() {
            if (this.sIDENTIFIERS === null) {
                this.sIDENTIFIERS = {
                    "-//W3C//DTD XHTML 1\\.0 Transitional//EN" : {
                        preset : this._PRESET.TRANSITIONAL,
                        parser : this._PARSER.XMLDTD,
                        sniffdoctype : this._SNIFFDOCTYPE.NO
                    },
                    "-//W3C//DTD HTML 4\\.01 Transitional//EN" : {
                        preset : this._PRESET.TRANSITIONAL,
                        parser : this._PARSER.HTML,
                        sniffdoctype : this._SNIFFDOCTYPE.YES
                    },
                    "-//W3C//DTD HTML 4\\.0 Transitional//EN" : {
                        preset : this._PRESET.TRANSITIONAL,
                        parser : this._PARSER.HTML,
                        sniffdoctype : this._SNIFFDOCTYPE.YES
                    },
                    "-//W3C//DTD XHTML 1\\.0 Strict//EN" : {
                        preset : this._PRESET.STRICT,
                        parser : this._PARSER.XMLDTD,
                        sniffdoctype : this._SNIFFDOCTYPE.NO
                    },
                    "-//W3C//DTD HTML 4\\.01//EN" : {
                        preset : this._PRESET.STRICT,
                        parser : this._PARSER.HTML,
                        sniffdoctype : this._SNIFFDOCTYPE.YES
                    },
                    "-//W3C//DTD HTML 4\\.0//EN" : {
                        preset : this._PRESET.STRICT,
                        parser : this._PARSER.HTML,
                        sniffdoctype : this._SNIFFDOCTYPE.YES
                    }
                };
            }
            return this.sIDENTIFIERS;
        },

        _getIdentifier : function(text) {
            var identifiers = this._IDENTIFIERS();
            for (var identifier in identifiers) {
                if (!identifiers.hasOwnProperty(identifier)) {
                    continue;
                }
                // XML Declaration is not supported
                var re = new RegExp("^\\s*<!DOCTYPE\\s+html\\s+PUBLIC\\s+['\"]" + identifier + "['\"][\\s>]", "i");
                if (re.test(text)) {
                    return identifiers[identifier];
                }
            }
            return null;
        },

        check : function(text, options) {
            // parameters
            var params = { "out" : "json" };
            if (options.supportHTML4andXHTML1) {
                var identifier = this._getIdentifier(text);
                if (identifier) {
                    if (identifier.sniffdoctype === this._SNIFFDOCTYPE.YES) {
                        params.sniffdoctype = identifier.sniffdoctype;
                    } else {
                        params.preset = identifier.preset;
                        params.parser = identifier.parser;
                    }
                }
            }
            params.content = text;
            var boundary = "numarkupchecker";
            return $.ajax(options.url, {
                type : "POST",
                dataType : "json",
                contentType : "multipart/form-data; boundary=" + boundary,
                data: this._getMultipartFormData(boundary, params),
            });
        }
    };
})();