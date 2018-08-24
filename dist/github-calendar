"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }g.GitHubCalendar = f();
    }
})(function () {
    var define, module, exports;return function () {
        function r(e, n, t) {
            function o(i, f) {
                if (!n[i]) {
                    if (!e[i]) {
                        var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                    }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                        var n = e[i][1][r];return o(n || r);
                    }, p, p.exports, r, e, n, t);
                }return n[i].exports;
            }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
                o(t[i]);
            }return o;
        }return r;
    }()({ 1: [function (require, module, exports) {
            "use strict";

            var parse = require("github-calendar-parser"),
                $ = require("elly"),
                addSubtractDate = require("add-subtract-date"),
                formatoid = require("formatoid");

            var DATE_FORMAT1 = "MMM D, YYYY",
                DATE_FORMAT2 = "MMMM D";

            /**
             * GitHubCalendar
             * Brings the contributions calendar from GitHub (provided username) into your page.
             *
             * @name GitHubCalendar
             * @function
             * @param {String|HTMLElement} container The calendar container (query selector or the element itself).
             * @param {String} username The GitHub username.
             * @param {Object} options An object containing the following fields:
             *
             *  - `summary_text` (String): The text that appears under the calendar (defaults to: `"Summary of
             *    pull requests, issues opened, and commits made by <username>"`).
             *  - `proxy` (Function): A function that receives as argument an url (string) and should return the proxied url.
             *    The default is using [@izuzak](https://github.com/izuzak)'s [`urlreq`](https://github.com/izuzak/urlreq).
             *  - `global_stats` (Boolean): If `false`, the global stats (total, longest and current streaks) will not be calculated and displayed. By default this is enabled.
             *  - `responsive` (Boolean): If `true`, the graph is changed to scale with the container. Custom CSS should be applied to the element to scale it appropriately. By default this is disabled.
             *
             * @return {Promise} A promise returned by the `fetch()` call.
             */
            module.exports = function GitHubCalendar(container, username, options) {

                container = $(container);

                options = options || {};
                options.summary_text = options.summary_text || "Summary of pull requests, issues opened, and commits made by <a href=\"https://github.com/" + username + "\" target=\"blank\">@" + username + "</a>";

                if (options.global_stats === false) {
                    container.style.minHeight = "175px";
                }

                // We need a proxy for CORS
                // Thanks, @izuzak (https://github.com/izuzak/urlreq)
                options.proxy = options.proxy || function (url) {
                    return "https://urlreq.appspot.com/req?method=GET&url=" + url;
                };

                var fetchCalendar = function fetchCalendar() {
                    return fetch(options.proxy("https://github.com/" + username)).then(function (response) {
                        return response.text();
                    }).then(function (body) {
                        var div = document.createElement("div");
                        div.innerHTML = body;
                        var cal = div.querySelector(".js-yearly-contributions");
                        cal.querySelector(".float-left.text-gray").innerHTML = options.summary_text;

                        // If 'include-fragment' with spinner img loads instead of the svg, fetchCalendar again
                        if (cal.querySelector("include-fragment")) {
                            setTimeout(fetchCalendar, 500);
                        } else {
                            // If options includes responsive, SVG element has to be manipulated to be made responsive
                            if (options.responsive === true) {
                                var svg = cal.querySelector("svg.js-calendar-graph-svg");
                                // Get the width/height properties and use them to create the viewBox
                                var width = svg.getAttribute("width");
                                var height = svg.getAttribute("height");
                                // Remove height property entirely
                                svg.removeAttribute("height");
                                // Width property should be set to 100% to fill entire container
                                svg.setAttribute("width", "100%");
                                // Add a viewBox property based on the former width/height
                                svg.setAttribute("viewBox", "0 0 " + width + " " + height);
                            }

                            if (options.global_stats !== false) {
                                var parsed = parse($("svg", cal).outerHTML),
                                    currentStreakInfo = parsed.current_streak ? formatoid(parsed.current_streak_range[0], DATE_FORMAT2) + " \u2013 " + formatoid(parsed.current_streak_range[1], DATE_FORMAT2) : parsed.last_contributed ? "Last contributed in " + formatoid(parsed.last_contributed, DATE_FORMAT2) + "." : "Rock - Hard Place",
                                    longestStreakInfo = parsed.longest_streak ? formatoid(parsed.longest_streak_range[0], DATE_FORMAT2) + " \u2013 " + formatoid(parsed.longest_streak_range[1], DATE_FORMAT2) : parsed.last_contributed ? "Last contributed in " + formatoid(parsed.last_contributed, DATE_FORMAT2) + "." : "Rock - Hard Place",
                                    firstCol = $("<div>", {
                                    "class": "contrib-column contrib-column-first table-column",
                                    html: "<span class=\"text-muted\">Contributions in the last year</span>\n                               <span class=\"contrib-number\">" + parsed.last_year + " total</span>\n                               <span class=\"text-muted\">" + formatoid(addSubtractDate.subtract(new Date(), 1, "year"), DATE_FORMAT1) + " \u2013 " + formatoid(new Date(), DATE_FORMAT1) + "</span>"
                                }),
                                    secondCol = $("<div>", {
                                    "class": "contrib-column table-column",
                                    html: "<span class=\"text-muted\">Longest streak</span>\n                               <span class=\"contrib-number\">" + parsed.longest_streak + " days</span>\n                               <span class=\"text-muted\">" + longestStreakInfo + "</span>"
                                }),
                                    thirdCol = $("<div>", {
                                    "class": "contrib-column table-column",
                                    html: "<span class=\"text-muted\">Current streak</span>\n                               <span class=\"contrib-number\">" + parsed.current_streak + " days</span>\n                               <span class=\"text-muted\">" + currentStreakInfo + "</span>"
                                });

                                cal.appendChild(firstCol);
                                cal.appendChild(secondCol);
                                cal.appendChild(thirdCol);
                            }

                            container.innerHTML = cal.innerHTML;
                        }
                    }).catch(function (e) {
                        return console.error(e);
                    });
                };

                return fetchCalendar();
            };
        }, { "add-subtract-date": 2, "elly": 4, "formatoid": 6, "github-calendar-parser": 8 }], 2: [function (require, module, exports) {
            "use strict";

            function gen(add) {
                return function _(d, count, what) {
                    count = add * count;
                    switch (what) {
                        case "years":
                        case "year":
                            d.setFullYear(d.getFullYear() + count);
                            break;
                        case "months":
                        case "month":
                            d.setMonth(d.getMonth() + count);
                            break;
                        case "weeks":
                        case "week":
                            return _(d, count * 7, "days");
                            break;
                        case "days":
                        case "day":
                            d.setDate(d.getDate() + count);
                            break;
                        case "hours":
                        case "hour":
                            d.setHours(d.getHours() + count);
                            break;
                        case "minutes":
                        case "minute":
                            d.setMinutes(d.getMinutes() + count);
                            break;
                        case "seconds":
                        case "second":
                            d.setSeconds(d.getSeconds() + count);
                            break;
                        case "milliseconds":
                        case "millisecond":
                            d.setMilliseconds(d.getMilliseconds() + count);
                            break;
                        default:
                            throw new Error("Invalid range: " + what);
                    }
                    return d;
                };
            }

            module.exports = {
                add: gen(1),
                subtract: gen(-1)
            };
        }, {}], 3: [function (require, module, exports) {
            /*!
             * days <https://github.com/jonschlinkert/days>
             *
             * Copyright (c) 2014-2017, Jon Schlinkert.
             * Released under the MIT License.
             */

            // English
            module.exports.en = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            module.exports.en.abbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            module.exports.en.short = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

            // French translation
            module.exports.fr = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            module.exports.fr.abbr = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
            module.exports.fr.short = ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'];

            // Spanish translation
            module.exports.es = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            module.exports.es.abbr = ['dom', 'lun', 'mar', 'mir', 'jue', 'vie', 'sab'];
            module.exports.es.short = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sa'];

            // Italian translation
            module.exports.it = ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'];
            module.exports.it.abbr = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
            module.exports.it.short = ['D', 'L', 'Ma', 'Me', 'G', 'V', 'S'];

            // In order not to break compatibility
            module.exports = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            module.exports.abbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            module.exports.short = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        }, {}], 4: [function (require, module, exports) {
            "use strict";

            var iterateObj = require("iterate-object"),
                sliced = require("sliced");

            /**
             * elly
             * Selects the DOM elements based on the provided selector. If there is no
             * commonjs/module environment, the `$` global variable will be created.
             *
             * @name elly
             * @function
             * @param {String|HTMLElement} input The element selector (e.g.
             * `'#my-id > .my-class'`), the element tag you want to create
             * (e.g. `'<ul>'`) or the HTML element (will be returned by the function).
             * @param {Object|HTMLElement} contextOrAttributes
             * @returns {HTMLElement} The HTMLElement that was provided or selected.
             */
            function $(input, contextOrAttributes) {
                if (typeof input === "string") {
                    if (input.charAt(0) === "<") {
                        input = document.createElement(input.slice(1, -1));
                        iterateObj(contextOrAttributes || {}, function (value, name) {

                            switch (name) {
                                case "text":
                                    input.textContent = value;
                                    return;
                                case "html":
                                    input.innerHTML = value;
                                    return;
                            }

                            input.setAttribute(name, value);
                        });
                        return input;
                    } else {
                        contextOrAttributes = contextOrAttributes || document;
                        return contextOrAttributes.querySelector(input);
                    }
                }
                return input;
            };

            /**
             * elly.$$
             * Selects multiple elements. Note that if there is no commonjs/module environment, you will access this function using `$.$$`.
             *
             * @name elly.$$
             * @function
             * @param {String} selector The DOM query selector.
             * @param {HTMLElement} context The element context/container. Defaults to `document`.
             * @returns {Array} The array of elements.
             */
            $.$$ = function (selector, context) {
                if (typeof selector === "string") {
                    context = context || document;
                    return sliced(context.querySelectorAll(selector));
                }
                return [selector];
            };

            module.exports = $;
        }, { "iterate-object": 9, "sliced": 13 }], 5: [function (require, module, exports) {
            "use strict";

            /**
             * fillo
             * Fill additional characters at the beginning of the string.
             *
             * @name fillo
             * @function
             * @param {String|Number} what The input snippet (number, string or anything that can be stringified).
             * @param {Number} size The width of the final string (default: `2`).
             * @param {String} ch The character to repeat (default: `"0"`).
             * @return {String} The input value with filled characters.
             */

            module.exports = function fillo(what, size, ch) {
                size = size || 2;
                ch = ch || "0";
                what = what.toString();
                var howMany = size - what.length;
                return (howMany <= 0 ? "" : ch.repeat(howMany)) + what;
            };
        }, {}], 6: [function (require, module, exports) {
            "use strict";

            var months = require("months"),
                days = require("days"),
                fillo = require("fillo"),
                ParseIt = require("parse-it").Parser;

            var rules = {
                // Years
                /// 2015
                YYYY: function YYYY(i, utc) {
                    if (utc) {
                        return i.getUTCFullYear();
                    }
                    return i.getFullYear();
                }

                // 15

                , YY: function YY(i, utc) {
                    return rules.YYYY(i, utc) % 100;
                }

                // Months
                // January

                , MMMM: function MMMM(i, utc) {
                    if (utc) {
                        return months[i.getUTCMonth()];
                    }
                    return months[i.getMonth()];
                }

                // Jan

                , MMM: function MMM(i, utc) {
                    if (utc) {
                        return months.abbr[i.getUTCMonth()];
                    }
                    return months.abbr[i.getMonth()];
                }

                // 01

                , MM: function MM(i, utc) {
                    if (utc) {
                        return fillo(i.getUTCMonth() + 1);
                    }
                    return fillo(i.getMonth() + 1);
                }

                // 1

                , M: function M(i, utc) {
                    if (utc) {
                        return i.getUTCMonth() + 1;
                    }
                    return i.getMonth() + 1;
                }

                // Days
                // Sunday

                , dddd: function dddd(i, utc) {
                    return days[rules.d(i, utc)];
                }

                // Sun

                , ddd: function ddd(i, utc) {
                    return days.abbr[rules.d(i, utc)];
                }

                // Su

                , dd: function dd(i, utc) {
                    return days.short[rules.d(i, utc)];
                }

                // 0

                , d: function d(i, utc) {
                    if (utc) {
                        return i.getUTCDay();
                    }
                    return i.getDay();
                }

                // Dates
                // 06  Day in month

                , DD: function DD(i, utc) {
                    return fillo(rules.D(i, utc));
                }

                // 6   Day in month

                , D: function D(i, utc) {
                    if (utc) {
                        return i.getUTCDate();
                    }
                    return i.getDate();
                }

                // AM/PM
                // AM/PM

                , A: function A(i, utc) {
                    return rules.a(i, utc).toUpperCase();
                }

                // am/pm

                , a: function a(i, utc) {
                    return rules.H(i, utc) >= 12 ? "pm" : "am";
                }

                // Hours
                // 08 Hour

                , hh: function hh(i, utc) {
                    return fillo(rules.h(i, utc));
                }

                // 8 Hour

                , h: function h(i, utc) {
                    return rules.H(i, utc) % 12 || 12;
                }

                // (alias)

                , HH: function HH(i, utc) {
                    return fillo(rules.H(i, utc));
                }

                // (alias)

                , H: function H(i, utc) {
                    if (utc) {
                        return i.getUTCHours();
                    }
                    return i.getHours();
                }

                // Minutes
                // 09 Minute

                , mm: function mm(i, utc) {
                    return fillo(rules.m(i, utc));
                }

                // 9  Minute

                , m: function m(i, utc) {
                    if (utc) {
                        return i.getUTCMinutes();
                    }
                    return i.getMinutes();
                }

                // Seconds
                // 09 Seconds

                , ss: function ss(i, utc) {
                    return fillo(rules.s(i, utc));
                }

                // 9  Seconds

                , s: function s(i, utc) {
                    if (utc) {
                        return i.getUTCSeconds();
                    }
                    return i.getSeconds();
                }

                // Fractional seconds
                // 0 1 ... 8 9

                , S: function S(i, utc) {
                    return Math.round(rules.s(i, utc) / 60 * 10);
                },
                SS: function SS(i, utc) {
                    return fillo(rules.s(i, utc) / 60 * 100);
                },
                SSS: function SSS(i, utc) {
                    return fillo(rules.s(i, utc) / 60 * 1000, 3);
                }

                // Timezones

                , Z: function Z(i) {
                    var offset = -i.getTimezoneOffset();
                    return (offset >= 0 ? "+" : "-") + fillo(parseInt(offset / 60)) + ":" + fillo(offset % 60);
                },
                ZZ: function ZZ(i) {
                    var offset = -i.getTimezoneOffset();
                    return (offset >= 0 ? "+" : "-") + fillo(parseInt(offset / 60)) + fillo(offset % 60);
                }
            };

            var parser = new ParseIt(rules);

            /**
             * formatoid
             * Formats the date into a given format.
             *
             * Usable format fields:
             *
             *  - **Years**
             *      - `YYYY` (e.g. `"2015"`)
             *      - `YY` (e.g. `"15"`)
             *  - **Months**
             *      - `MMMM` (e.g. `"January"`)
             *      - `MMM` (e.g. `"Jan"`)
             *      - `MM` (e.g. `"01"`)
             *      - `M` (e.g. `"1"`)
             *  - **Days**
             *      - `dddd` (e.g. `"Sunday"`)
             *      - `ddd` (e.g. `"Sun"`)
             *      - `dd` (e.g. `"Su"`)
             *      - `d` (e.g. `"Su"`)
             *  - **Dates**
             *      - `DD` (e.g. `"07"`)
             *      - `D` (e.g. `"7"`)
             *  - **AM/PM**
             *      - `A` (e.g. `"AM"`)
             *      - `a` (e.g. `"pm"`)
             *  - **Hours**
             *      - `hh` (e.g. `"07"`)–12 hour format
             *      - `h` (e.g. `"7"`)
             *      - `HH` (e.g. `"07"`)–24 hour format
             *      - `H` (e.g. `"7"`)
             *  - **Minutes**
             *      - `mm` (e.g. `"07"`)
             *      - `m` (e.g. `"7"`)
             *  - **Seconds**
             *      - `ss` (e.g. `"07"`)
             *      - `s` (e.g. `"7"`)
             *  - **Fractional seconds**
             *      - `S` (e.g. `0 1 2 3 ... 9`)
             *      - `SS` (e.g. `00 01 02 ... 98 99`)
             *      - `SS` (e.g. `000 001 002 ... 998 999`)
             *  - **Timezones**
             *      - `Z` (e.g. `-07:00 -06:00 ... +06:00 +07:00`)
             *      - `ZZ` (e.g. `-0700 -0600 ... +0600 +0700`)
             *
             * @name formatoid
             * @function
             * @param {Date} i The date object.
             * @param {String} f The date format.
             * @return {String} The formatted date (as string).
             */
            module.exports = function formatoid(i, f) {
                return parser.run(f, [i, i._useUTC]);
            };
        }, { "days": 3, "fillo": 5, "months": 10, "parse-it": 11 }], 7: [function (require, module, exports) {
            "use strict";

            module.exports = ["#eee", "#d6e685", "#8cc665", "#44a340", "#1e6823"];
        }, {}], 8: [function (require, module, exports) {
            "use strict";

            var githubCalendarLegend = require("github-calendar-legend");

            /**
             * parseGitHubCalendarSvg
             * Parses the SVG input (as string).
             *
             * @name parseGitHubCalendarSvg
             * @function
             * @param {String} input The SVG code of the contributions calendar.
             * @return {Object} An object containing:
             *
             *  - `last_year` (Number): The total contributions in the last year.
             *  - `longest_streak` (Number): The longest streak.
             *  - `longest_streak_range` (Array): An array of two date objects representing the date range.
             *  - `current_streak` (Number): The current streak.
             *  - `current_streak_range` (Array): An array of two date objects representing the date range.
             *  - `days` (Array): An array of day objects:
             *       - `fill` (String): The hex color.
             *       - `date` (Date): The day date.
             *       - `count` (Number): The number of commits.
             *       - `level` (Number): A number between 0 and 4 (inclusive) representing the contribution level (more commits, higher value).
             *  - `weeks` (Array): The day objects grouped by weeks (arrays).
             *  - `last_contributed` (Date): The last contribution date.
             */
            module.exports = function parseGitHubCalendarSvg(input) {

                var data = {
                    last_year: 0,
                    longest_streak: -1,
                    longest_streak_range: [],
                    current_streak: 0,
                    current_streak_range: [],
                    weeks: [],
                    days: [],
                    last_contributed: null
                },
                    lastWeek = [],
                    updateLongestStreak = function updateLongestStreak() {
                    if (data.current_streak > data.longest_streak) {
                        data.longest_streak = data.current_streak;
                        data.longest_streak_range[0] = data.current_streak_range[0];
                        data.longest_streak_range[1] = data.current_streak_range[1];
                    }
                };

                input.split("\n").slice(2).map(function (c) {
                    return c.trim();
                }).forEach(function (c) {
                    if (c.startsWith("<g transform")) {
                        return lastWeek.length && data.weeks.push(lastWeek) && (lastWeek = []);
                    }

                    var fill = c.match(/fill="(#[a-z0-9]+)"/),
                        date = c.match(/data-date="([0-9\-]+)"/),
                        count = c.match(/data-count="([0-9]+)"/),
                        level = null;

                    fill = fill && fill[1];
                    date = date && date[1];
                    count = count && +count[1];

                    if (!fill) {
                        return;
                    }

                    var obj = {
                        fill: fill,
                        date: new Date(date),
                        count: count,
                        level: githubCalendarLegend.indexOf(fill)
                    };

                    if (data.current_streak === 0) {
                        data.current_streak_range[0] = obj.date;
                    }

                    if (obj.count) {
                        ++data.current_streak;
                        data.last_year += obj.count;
                        data.last_contributed = obj.date;
                        data.current_streak_range[1] = obj.date;
                    } else {
                        updateLongestStreak();
                        data.current_streak = 0;
                    }

                    lastWeek.push(obj);
                    data.days.push(obj);
                });

                updateLongestStreak();

                return data;
            };
        }, { "github-calendar-legend": 7 }], 9: [function (require, module, exports) {
            /**
             * iterateObject
             * Iterates an object. Note the object field order may differ.
             *
             * @name iterateObject
             * @function
             * @param {Object} obj The input object.
             * @param {Function} fn A function that will be called with the current value, field name and provided object.
             * @return {Function} The `iterateObject` function.
             */
            function iterateObject(obj, fn) {
                var i = 0,
                    keys = [];

                if (Array.isArray(obj)) {
                    for (; i < obj.length; ++i) {
                        if (fn(obj[i], i, obj) === false) {
                            break;
                        }
                    }
                } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj !== null) {
                    keys = Object.keys(obj);
                    for (; i < keys.length; ++i) {
                        if (fn(obj[keys[i]], keys[i], obj) === false) {
                            break;
                        }
                    }
                }
            }

            module.exports = iterateObject;
        }, {}], 10: [function (require, module, exports) {
            /*!
             * months <https://github.com/datetime/months>
             *
             * Copyright (c) 2014-2017, Jon Schlinkert.
             * Released under the MIT License.
             */

            // English Translation
            module.exports = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            module.exports.abbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Italian Translation
            module.exports.it = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
            module.exports.abbr.it = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

            // German Translation
            module.exports.de = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
            module.exports.abbr.de = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
        }, {}], 11: [function (require, module, exports) {
            "use strict";

            var _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            var regexEscape = require("regex-escape");

            var ParseIt = function () {
                /**
                 * ParseIt
                 * The `ParseIt` class. It can be used to use the same data object but with different formats/arguments.
                 *
                 * @name ParseIt
                 * @function
                 * @param {Object} obj An object containing the fields to replace.
                 */
                function ParseIt(obj) {
                    _classCallCheck(this, ParseIt);

                    this.obj = obj || {};
                    this.re = new RegExp("^(" + Object.keys(obj).map(regexEscape).join("|") + ")");
                }

                /**
                 * run
                 * Replaces the fields in the format string with data coming from the data object.
                 *
                 *
                 * @name parseIt
                 * @function
                 * @param {String} format The format input.
                 * @param {Array} args An array of arguments to be passed to the replace function (stored in the `obj` object).
                 * @return {String} The result as string.
                 */

                _createClass(ParseIt, [{
                    key: "run",
                    value: function run(format, args) {
                        var result = "";
                        args = args || [];
                        do {
                            var arr = format.match(this.re),
                                field = arr && arr[1],
                                c = field || format.charAt(0);

                            if (field) {
                                var value = this.obj[field];
                                if (typeof value === "function") {
                                    value = value.apply(this, args);
                                }
                                result += value;
                            } else {
                                result += c;
                            }
                            format = format.substring(c.length);
                        } while (format);
                        return result;
                    }
                }]);

                return ParseIt;
            }();

            /**
             * parseIt
             * A wrapper around the `ParseIt` class. The `ParseIt` constructor is accessible using `parseIt.Parser`.
             *
             * @name parseIt
             * @function
             * @param {String} format The format input.
             * @param {Object} obj An object containing the fields to replace.
             * @param {Array} args An array of arguments to be passed to the replace function (stored in the `obj` object).
             * @return {String} The result as string.
             */

            function parseIt(format, obj, args) {
                return new ParseIt(obj).run(format, args);
            }

            parseIt.Parser = ParseIt;

            module.exports = parseIt;
        }, { "regex-escape": 12 }], 12: [function (require, module, exports) {
            "use strict";

            /**
             * RegexEscape
             * Escapes a string for using it in a regular expression.
             *
             * @name RegexEscape
             * @function
             * @param {String} input The string that must be escaped.
             * @return {String} The escaped string.
             */

            function RegexEscape(input) {
                return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            }

            /**
             * proto
             * Adds the `RegexEscape` function to `RegExp` class.
             *
             * @name proto
             * @function
             * @return {Function} The `RegexEscape` function.
             */
            RegexEscape.proto = function () {
                RegExp.escape = RegexEscape;
                return RegexEscape;
            };

            module.exports = RegexEscape;
        }, {}], 13: [function (require, module, exports) {

            /**
             * An Array.prototype.slice.call(arguments) alternative
             *
             * @param {Object} args something with a length
             * @param {Number} slice
             * @param {Number} sliceEnd
             * @api public
             */

            module.exports = function (args, slice, sliceEnd) {
                var ret = [];
                var len = args.length;

                if (0 === len) return ret;

                var start = slice < 0 ? Math.max(0, slice + len) : slice || 0;

                if (sliceEnd !== undefined) {
                    len = sliceEnd < 0 ? sliceEnd + len : sliceEnd;
                }

                while (len-- > start) {
                    ret[len - start] = args[len];
                }

                return ret;
            };
        }, {}] }, {}, [1])(1);
});
