(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GitHubCalendar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});