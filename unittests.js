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

describe("A Public IDENTIFIERs Detection", function() {
    "use strict";

    require("numarkupchecker");

    function getTestName(doctype, validness, i, length) {
        var valid = validness ? " valid " : " invalid ";
        var as = validness ? " as " : " not as ";
        return "can detect" + valid + "DOCTYPE" + as + doctype + " " + (++i) + "/" + length;
    }

    /* XHTML 1.0 Stict */
    var XHTML1_STRICT_OK = [
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\">",
        // This is illegal though
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\">",
        "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'>",
        "<!DOCTYPE html \r\n     PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\r\n     \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">"
    ];

    XHTML1_STRICT_OK.forEach(function(str, i) {
        it(getTestName("XHTML 1.0 Strict", true, i, XHTML1_STRICT_OK.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier.preset).toBe(NuMarkupChecker._PRESET.STRICT);
            expect(identifier.parser).toBe(NuMarkupChecker._PARSER.XMLDTD);
        });
    });

    var XHTML1_STRICT_FAIL = [
        // This is illegal
        "<!DOCTYPE html SYSTEM \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
    ];
    XHTML1_STRICT_FAIL.forEach(function(str, i) {
        it(getTestName("XHTML 1.0 Strict", false, i, XHTML1_STRICT_FAIL.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier).toBe(null);
        });
    });

    var XHTML1_TRANSITIONAL_OK = [
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">",
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\">",
        "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN'>",
        // This is illegal though
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\">",
        "<!DOCTYPE html \r\n     PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\r\n     \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">"
    ];

    XHTML1_TRANSITIONAL_OK.forEach(function(str, i) {
        it(getTestName("XHTML 1.0 Transitional", true, i, XHTML1_TRANSITIONAL_OK.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier.preset).toBe(NuMarkupChecker._PRESET.TRANSITIONAL);
            expect(identifier.parser).toBe(NuMarkupChecker._PARSER.XMLDTD);
        });
    });

    var XHTML1_TRANSITIONAL_FAIL = [
        // This is illegal
        "<!DOCTYPE html SYSTEM \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">",
    ];

    XHTML1_TRANSITIONAL_FAIL.forEach(function(str, i) {
        it(getTestName("XHTML 1.0 Transitional", false, i, XHTML1_TRANSITIONAL_FAIL.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier).toBe(null);
        });
    });

    var HTML4_STRICT_OK = [
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">",
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\">",
        "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN'>",
        "<!DOCTYPE HTML \r\n     PUBLIC \"-//W3C//DTD HTML 4.01//EN\"\r\n     \"http://www.w3.org/TR/html4/strict.dtd\">",
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">",
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0//EN\">",
        "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0//EN'>",
        "<!DOCTYPE HTML \r\n     PUBLIC \"-//W3C//DTD HTML 4.0//EN\"\r\n     \"http://www.w3.org/TR/html4/strict.dtd\">"
    ];
    HTML4_STRICT_OK.forEach(function(str, i) {
        it(getTestName("HTML4 Strict", true, i, HTML4_STRICT_OK.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier.preset).toBe(NuMarkupChecker._PRESET.STRICT);
            expect(identifier.parser).toBe(NuMarkupChecker._PARSER.AUTO);
        });
    });

    var HTML4_STRICT_FAIL = [
            // This is illegal
            "<!DOCTYPE HTML SYSTEM \"http://www.w3.org/TR/html4/strict.dtd\">",
    ];
    HTML4_STRICT_FAIL.forEach(function(str, i) {
        it(getTestName("HTML4 Strict", false, i, HTML4_STRICT_FAIL.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier).toBe(null);
        });
    });

    var HTML4_TRANSITIONAL_OK = [
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">",
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">",
        "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN'>",
        "<!DOCTYPE HTML \r\n     PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"\r\n     \"http://www.w3.org/TR/html4/loose.dtd\">",
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">",
        "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">",
        "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN'>",
        "<!DOCTYPE HTML \r\n     PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\"\r\n     \"http://www.w3.org/TR/html4/loose.dtd\">"
    ];
    HTML4_TRANSITIONAL_OK.forEach(function(str, i) {
        it(getTestName("HTML 4 Transitional", true, i, HTML4_TRANSITIONAL_OK.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier.preset).toBe(NuMarkupChecker._PRESET.TRANSITIONAL);
            expect(identifier.parser).toBe(NuMarkupChecker._PARSER.AUTO);
        });
    });

    var HTML4_TRANSITIONAL_FAIL = [
        // This is illegal
        "<!DOCTYPE html SYSTEM \"http://www.w3.org/TR/html4/loose.dtd\">",
    ];
    HTML4_TRANSITIONAL_FAIL.forEach(function(str, i) {
        it(getTestName("HTML 4 Transitional", false, i, HTML4_TRANSITIONAL_FAIL.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier).toBe(null);
        });
    });

    var HTML5 = [
        "<!DOCTYPE html>",
        "<!DOCTYPE html SYSTEM \"about:legacy-compat\">",
        "<!DOCTYPE html SYSTEM 'about:legacy-compat'>",
        "<!DOCTYPE \r\n html>"
    ];
    HTML5.forEach(function(str, i) {
        it(getTestName("HTML5", true, i, HTML5.length), function() {
            var identifier = NuMarkupChecker._getIdentifier(str);
            expect(identifier).toBe(null);
        });
    });
});