
# github-calendar.js

 [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Version](https://img.shields.io/npm/v/github-calendar.svg)](https://www.npmjs.com/package/github-calendar) [![Downloads](https://img.shields.io/npm/dt/github-calendar.svg)](https://www.npmjs.com/package/github-calendar) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Embed your GitHub contributions calendar anywhere.


Everybody<sup><sup>well, haters gonna hate</sup></sup> loves GitHub and everybody loves stats. So, why not making the GitHub contributions calendar available for being embeded in your web pages? Now [you can](https://ionicabizau.github.io/github-calendar/example). :tada:


[![](http://i.imgur.com/S1h8XoB.jpg)](https://ionicabizau.github.io/github-calendar/example)


## :cloud: Installation


Check out the [`dist`](/dist) directory to download the needed files and include them on your page.

If you're using this module in a CommonJS environment, you can install it from `npm` and `require` it:

```sh
$ npm i --save github-calendar
```


```html
<!-- Prepare a container for your calendar. -->
<script
  src="https://cdn.rawgit.com/IonicaBizau/github-calendar/gh-pages/dist/github-calendar.min.js"
</script>

<!-- Optionally, include the theme (if you don't want to struggle to write the CSS) -->
<link
  rel="stylesheet"
  href="https://cdn.rawgit.com/IonicaBizau/github-calendar/gh-pages/dist/github-calendar.css"
/>

<!-- Prepare a container for your calendar. -->
<div class="calendar">
    <!-- Loading stuff -->
    Loading the data just for you.
</div>

<script>
    GitHubCalendar(".calendar", "your-username");
</script>
```

[Here](http://jsbin.com/wewihogevu/edit?html,output) you can see this example in action.


## :memo: Documentation


### `GitHubCalendar(container, username, options)`
Brings the contributions calendar from GitHub (provided username) into your page.

#### Params
- **String|HTMLElement** `container`: The calendar container (query selector or the element itself).
- **String** `username`: The GitHub username.
- **Object** `options`: An object containing the following fields:
 - `summary_text` (String): The text that appears under the calendar (defaults to: `"Summary of
   pull requests, issues opened, and commits made by <username>"`).
 - `proxy` (Function): A function that receives as argument an url (string) and should return the proxied url.
   The default is using [@izuzak](https://github.com/izuzak)'s [`urlreq`](https://github.com/izuzak/urlreq).

#### Return
- **Promise** A promise returned by the `fetch()` call.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :cake: Thanks

 - Big thanks to [**@izuzak**](https://github.com/izuzak) for creating the [urlreq](https://github.com/izuzak/urlreq) project–the default proxy used by this library. :cake:
 - Part of the CSS code was taken from the GitHub profile page to offer the same experience. :art:


## :sparkles: Related

 - [`github-calendar-parser`](https://github.com/IonicaBizau/github-calendar-parser)–Parses the GitHub calendar SVG into JSON.
 - [`github-calendar-legend`](https://github.com/IonicaBizau/github-calendar-legend)–The GitHub contributions calendar colors.
 - [`ghcal`](https://github.com/IonicaBizau/ghcal)–See the GitHub contributions calendar of a user in the command line.
 - [`github-stats`](https://github.com/IonicaBizau/github-stats)–Visualize stats about GitHub users and projects in your terminal.
 - [...and other goodies...](https://github.com/search?q=user%3AIonicaBizau+github)



## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
