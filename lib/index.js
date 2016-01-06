"use strict";
module.exports = class GitHubCalendar {
    constructor (container, username, options) {

        options.summary_text = options.summary_text || `Summary of pull requests, issues opened, and commits made by <a href="https://github.com/${username}">@${username}</a>`;
        // We need a proxy for CORS
        // Thanks, @izuzak (https://github.com/izuzak/urlreq)
        function proxy(url) {
            return "http://urlreq.appspot.com/req?method=GET&url=" + url;
        }

        fetch(proxy("https://github.com/" + username)).then(response => {
            return response.text()
        }).then(body => {
            var div = document.createElement("div");
            div.innerHTML = body;
            var cal = div.querySelector("#contributions-calendar");
            cal.querySelector(".left.text-muted").innerHTML = options.summary_text;
            container.innerHTML = cal.innerHTML;
        });
    }
};
