"use strict";

const parse = require("github-calendar-parser")
    , $ = require("elly")
    , addSubtractDate = require("add-subtract-date")
    , formatoid = require("formatoid")
    ;

const DATE_FORMAT = "MMM D, YYYY";

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
 *
 * @return {Promise} A promise returned by the `fetch()` call.
 */
module.exports = function GitHubCalendar (container, username, options) {

    if (typeof container === "string") {
        container = document.querySelector(container);
    }

    options = options || {};
    options.summary_text = options.summary_text || `Summary of pull requests, issues opened, and commits made by <a href="https://github.com/${username}" target="blank">@${username}</a>`;

    // We need a proxy for CORS
    // Thanks, @izuzak (https://github.com/izuzak/urlreq)
    options.proxy = options.proxy || function (url) {
        return "https://urlreq.appspot.com/req?method=GET&url=" + url;
    };

    let fetchCalendar = () => fetch(options.proxy("https://github.com/" + username)).then(response => {
        return response.text()
    }).then(body => {
        let div = document.createElement("div");
        div.innerHTML = body;
        let cal = div.querySelector("#contributions-calendar");
        cal.querySelector(".left.text-muted").innerHTML = options.summary_text;

        // If 'include-fragment' with spinner img loads instead of the svg, fetchCalendar again
        if (cal.querySelector("include-fragment")) {
            setTimeout(fetchCalendar, 500);
        } else {
            if (options.global_stats !== false) {
                let parsed = parse($("svg", cal).outerHTML)
                  , currentStreakInfo = parsed.current_streak
                                      ? `${formatoid(parsed.current_streak_range[0], DATE_FORMAT)} – ${formatoid(parsed.current_streak_range[1], DATE_FORMAT)}`
                                      : `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT)}.`
                  , firstCol = $("<div>", {
                        "class": "contrib-column contrib-column-first table-column"
                      , html: `<span class="text-muted">Contributions in the last year</span>
                               <span class="contrib-number">${parsed.last_year} total</span>
                               <span class="text-muted">${formatoid(addSubtractDate.subtract(new Date(), 1, "year"), DATE_FORMAT)} – ${formatoid(new Date(), DATE_FORMAT)}</span>`
                    })
                  , secondCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Longest streak</span>
                               <span class="contrib-number">${parsed.longest_streak} days</span>
                               <span class="text-muted">${formatoid(parsed.longest_streak_range[0], DATE_FORMAT)} – ${formatoid(parsed.longest_streak_range[1], DATE_FORMAT)}</span>`
                    })
                  , thirdCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Current streak</span>
                               <span class="contrib-number">${parsed.current_streak} days</span>
                               <span class="text-muted">${currentStreakInfo}</span>`
                    })
                  ;

                cal.appendChild(firstCol);
                cal.appendChild(secondCol);
                cal.appendChild(thirdCol);
            }

            container.innerHTML = cal.innerHTML;
        }
    });

    return fetchCalendar();
}
