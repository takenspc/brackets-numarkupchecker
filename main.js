/*
* Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
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

define(function (require, exports, module) {
    "use strict";

    var LINT_NAME = "Nu Markup Checker";

    var AppInit = brackets.getModule("utils/AppInit");
    var CodeInspection = brackets.getModule("language/CodeInspection");
    var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    var _ = brackets.getModule("thirdparty/lodash");

    require("numarkupchecker");


    var DEFAULT_OPTIONS = {
        "url" : "http://validator.w3.org/nu/",
        "supportHTML4andXHTML1" : true
    };
    var prefs = PreferencesManager.getExtensionPrefs("numarkupchecker");
    var _lastRunOptions;
    prefs.definePreference("url", "string", DEFAULT_OPTIONS.url);
    prefs.definePreference("supportHTML4andXHTML1", "boolean", DEFAULT_OPTIONS.supportHTML4andXHTML1);
    prefs.on("change", function(e, data) {
        var options = getOptions();
        if (!_.isEqual(options, _lastRunOptions)) {
            CodeInspection.requestRun(LINT_NAME);
        }
    });

    function getOptions() {
        var options = {};
        for (var key in DEFAULT_OPTIONS) {
            if (DEFAULT_OPTIONS.hasOwnProperty(key)) {
                options[key] = prefs.get(key);
            }
        }
        return options;
    }

    function checkByNuMarkupChecker(text, fullPath) {
        var results = { errors : [] };
        var deferred = new $.Deferred();
        var options = getOptions();
        _lastRunOptions = _.clone(options);

        options = $.extend({}, DEFAULT_OPTIONS, options);
        var jqXHR = NuMarkupChecker.check(text, options);
        jqXHR.done(function(data) {
            if (data && "messages" in data) {
                data.messages.forEach(function(message) {
                    var type = CodeInspection.Type.ERROR;
                    if (message.type === "info") {
                        if ("subType" in message && message.subType === "warning") {
                            type = CodeInspection.Type.WARNING;
                        } else {
                            // ignore "info"
                            return;
                        }
                    }
                    results.errors.push({
                        type : type,
                        pos : {
                            line : message.lastLine - 1,
                            ch : message.lastColumn - 1,
                        },
                        message : message.message
                    });
                });
            }
            deferred.resolve(results);
        }).fail(function() {
            deferred.reject(null);
        });

        return deferred.promise();
    }

    AppInit.appReady(function() {
        CodeInspection.register("html", {
            name: LINT_NAME,
            scanFileAsync: checkByNuMarkupChecker
        });
    });
});
