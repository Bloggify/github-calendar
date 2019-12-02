"use strict";

const parse = require("github-calendar-parser")
    , $ = require("elly")
    , addSubtractDate = require("add-subtract-date")
    , formatoid = require("formatoid")
    ;

const DATE_FORMAT1 = "MMM D, YYYY"
    , DATE_FORMAT2 = "MMMM D"
    ;

function printDayCount(dayCount) {
    return  `${dayCount} ${(dayCount === 1) ? "day" : "days"}`;
}

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
 *    - `summary_text` (String): The text that appears under the calendar (defaults to: `"Summary of
 *      pull requests, issues opened, and commits made by <username>"`).
 *    - `proxy` (Function): A function that receives as argument an url (string) and should return the proxied url.
 *      The default is using [@izuzak](https://github.com/izuzak)'s [`urlreq`](https://github.com/izuzak/urlreq).
 *    - `global_stats` (Boolean): If `false`, the global stats (total, longest and current streaks) will not be calculated and displayed. By default this is enabled.
 *    - `responsive` (Boolean): If `true`, the graph is changed to scale with the container. Custom CSS should be applied to the element to scale it appropriately. By default this is disabled.
 *
 * @return {Promise} A promise returned by the `fetch()` call.
 */
module.exports = function GitHubCalendar (container, username, options) {

    container = $(container);

    options = options || {};
    options.summary_text = options.summary_text || `Summary of pull requests, issues opened, and commits made by <a href="https://github.com/${username}" target="blank">@${username}</a>`;

    if (options.global_stats === false) {
        container.style.minHeight = "175px";
    }

    // We need a proxy for CORS
    // Thanks, @izuzak (https://github.com/izuzak/urlreq)
    options.proxy = options.proxy || function (url) {
        return "https://urlreq.appspot.com/req?method=GET&url=" + url;
    };

    let fetchCalendar = () => fetch(options.proxy("https://github.com/users/" + username + "/contributions")).then(response => {
        return response.text()
    }).then(body => {
        let div = document.createElement("div");
        div.innerHTML = body;
        let cal = div.querySelector(".js-yearly-contributions");
        $(".position-relative h2", cal).remove();
        cal.querySelector(".float-left.text-gray").innerHTML = options.summary_text;

        // If 'include-fragment' with spinner img loads instead of the svg, fetchCalendar again
        if (cal.querySelector("include-fragment")) {
            setTimeout(fetchCalendar, 500);
        } else {
            // If options includes responsive, SVG element has to be manipulated to be made responsive
            if (options.responsive === true) {
                let svg = cal.querySelector("svg.js-calendar-graph-svg");
                // Get the width/height properties and use them to create the viewBox
                let width = svg.getAttribute("width");
                let height = svg.getAttribute("height");
                // Remove height property entirely
                svg.removeAttribute("height");
                // Width property should be set to 100% to fill entire container
                svg.setAttribute("width", "100%");
                // Add a viewBox property based on the former width/height
                svg.setAttribute("viewBox", "0 0 " + width + " " + height);
            }

            if (options.global_stats !== false) {
                let parsed = parse($("svg", cal).outerHTML)
                  , currentStreakInfo = parsed.current_streak
                                      ? `${formatoid(parsed.current_streak_range[0], DATE_FORMAT2)} &ndash; ${formatoid(parsed.current_streak_range[1], DATE_FORMAT2)}`
                                      : parsed.last_contributed
                                      ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                      : "Rock - Hard Place"
                  , longestStreakInfo = parsed.longest_streak
                                      ? `${formatoid(parsed.longest_streak_range[0], DATE_FORMAT2)} &ndash; ${formatoid(parsed.longest_streak_range[1], DATE_FORMAT2)}`
                                      : parsed.last_contributed
                                      ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                      : "Rock - Hard Place"
                  , firstCol = $("<div>", {
                        "class": "contrib-column contrib-column-first table-column"
                      , html: `<span class="text-muted">Contributions in the last year</span>
                               <span class="contrib-number">${parsed.last_year} total</span>
                               <span class="text-muted">${formatoid(addSubtractDate.add(addSubtractDate.subtract(new Date(), 1, "year"), 1, "day"), DATE_FORMAT1)} &ndash; ${formatoid(new Date(), DATE_FORMAT1)}</span>`
                    })
                  , secondCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Longest streak</span>
                               <span class="contrib-number">${printDayCount(parsed.longest_streak)}</span>
                               <span class="text-muted">${longestStreakInfo}</span>`
                    })
                  , thirdCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Current streak</span>
                               <span class="contrib-number">${printDayCount(parsed.current_streak)}</span>
                               <span class="text-muted">${currentStreakInfo}</span>`
                    })
                  ;

                cal.appendChild(firstCol);
                cal.appendChild(secondCol);
                cal.appendChild(thirdCol);
            }

            container.innerHTML = cal.innerHTML;
        }
    }).catch(e => console.error(e));

    return fetchCalendar();
}
