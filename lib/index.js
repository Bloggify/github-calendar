"use strict";

const parse = require("github-calendar-parser")
    , $ = require("elly")
    , addSubtractDate = require("add-subtract-date")
    , formatoid = require("formatoid")

const DATE_FORMAT1 = "MMM D, YYYY"
    , DATE_FORMAT2 = "MMMM D"

function printDayCount(dayCount) {
    return  `${dayCount} ${(dayCount === 1) ? "day" : "days"}`
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
 *    - `proxy` (Function): A function that receives as argument the username (string) and should return a promise resolving the HTML content of the contributions page.
 *      The default is using @Bloggify's APIs.
 *    - `global_stats` (Boolean): If `false`, the global stats (total, longest and current streaks) will not be calculated and displayed. By default this is enabled.
 *    - `responsive` (Boolean): If `true`, the graph is changed to scale with the container. Custom CSS should be applied to the element to scale it appropriately. By default this is disabled.
 *    - `cache` (Number) The cache time in seconds.
 *
 * @return {Promise} A promise returned by the `fetch()` call.
 */
module.exports = function GitHubCalendar (container, username, options) {

    container = $(container)

    options = options || {}
    options.summary_text = options.summary_text || `Summary of pull requests, issues opened, and commits made by <a href="https://github.com/${username}" target="blank">@${username}</a>`
    options.cache = (options.cache || (24 * 60 * 60)) * 1000

    if (options.global_stats === false) {
        container.style.minHeight = "175px"
    }

    const cacheKeys = {
        content: "gh_calendar_content",
        expire_at: "gh_calendar_expire"
    }

    // We need a proxy for CORS
    options.proxy = options.proxy || (username => {
        return fetch(`https://api.bloggify.net/gh-calendar/?username=${username}`).then(r => r.text())
    })

    options.getCalendar = options.getCalendar || (username => {
        if (options.cache && Date.now() < +localStorage.getItem(cacheKeys.expire_at)) {
            const content = localStorage.getItem(cacheKeys.content)
            if (content) {
                return Promise.resolve(content)
            }
        }

        return options.proxy(username).then(body => {
            if (options.cache) {
                localStorage.setItem(cacheKeys.content, body)
                localStorage.setItem(cacheKeys.expire_at, Date.now() + options.cache)
            }
            return body
        })
    })

    let fetchCalendar = () => options.getCalendar(username).then(body => {
        let div = document.createElement("div")
        div.innerHTML = body
        let cal = div.querySelector(".js-yearly-contributions")
        $(".position-relative h2", cal).remove()
        cal.querySelector(".float-left.text-gray").innerHTML = options.summary_text

        // If 'include-fragment' with spinner img loads instead of the svg, fetchCalendar again
        if (cal.querySelector("include-fragment")) {
            setTimeout(fetchCalendar, 500)
        } else {
            // If options includes responsive, SVG element has to be manipulated to be made responsive
            if (options.responsive === true) {
                let svg = cal.querySelector("svg.js-calendar-graph-svg")
                // Get the width/height properties and use them to create the viewBox
                let width = svg.getAttribute("width")
                let height = svg.getAttribute("height")
                // Remove height property entirely
                svg.removeAttribute("height")
                // Width property should be set to 100% to fill entire container
                svg.setAttribute("width", "100%")
                // Add a viewBox property based on the former width/height
                svg.setAttribute("viewBox", "0 0 " + width + " " + height)
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

                cal.appendChild(firstCol)
                cal.appendChild(secondCol)
                cal.appendChild(thirdCol)
            }

            container.innerHTML = cal.innerHTML
        }
    }).catch(e => console.error(e))

    return fetchCalendar()
}
