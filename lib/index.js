"use strict";

const parse = require("github-calendar-parser")
    , $ = require("elly")
    ;

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

            debugger
            if (options.global_stats !== false) {
                let parsed = parse($("svg", cal).outerHTML)
                  , firstCol = $("<div>", {
                        "class": "contrib-column contrib-column-first table-column"
                      , html: `<span class="text-muted">Contributions in the last year</span>
                               <span class="contrib-number">${parsed.last_year} total</span>
                               <span class="text-muted">${new Daty().subtract(1, "year").format("LLL")} – ${new Daty().format("LLL")}</span>`
                    })
                  , secondCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Longest streak</span>
                               <span class="contrib-number">${parsed.longest_streak} days</span>
                               <span class="text-muted">${Daty(parsed.longest_streak_range[0]).format("LLL")} – {Daty(parsed.longest_streak_range[1]).format("LLL")}</span>`
                    })
                  , thirdCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Current streak</span>
                               <span class="contrib-number">${parsed.current_streak} days</span>`
                               //<span class="text-muted">${parsed.current_streak ? Daty(parsed.current_streak_range[0]).format("LLL") – Daty(parsed.current_streak_range[1]).format("LLL")</span>`
                                // TODO Last contributed
                                // <span class="text-muted">Last contributed <time datetime="2099-12-31T08:00:00Z" is="time-ago" title="31 December 2099 at 08:00:00 GMT">just now</time></span>
                    })
                  ;

                cal.appendChild(firstCol, secondCol, thirdCol);
            }

            container.innerHTML = cal.innerHTML;
        }
    });

    return fetchCalendar();
}
