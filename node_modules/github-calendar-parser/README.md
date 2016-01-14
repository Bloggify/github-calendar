# github-calendar-parser [![Support this project][donate-now]][paypal-donations]

Parses the GitHub contributions calendar SVG code into JSON.

## Installation

```sh
$ npm i --save github-calendar-parser
```

## Example

```js
const parse = require("github-calendar-parser");

var svg = `<svg width="721" height="110" class="js-calendar-graph-svg">
  <g transform="translate(20, 20)">
      <g transform="translate(0, 0)">
          <rect class="day" width="11" height="11" y="39" fill="#1e6823" data-count="78" data-date="2014-12-31"/>
          <rect class="day" width="11" height="11" y="52" fill="#d6e685" data-count="6" data-date="2015-01-01"/>
          <rect class="day" width="11" height="11" y="65" fill="#d6e685" data-count="1" data-date="2015-01-02"/>
          <rect class="day" width="11" height="11" y="78" fill="#d6e685" data-count="21" data-date="2015-01-03"/>
      </g>
      <g transform="translate(13, 0)">
          <rect class="day" width="11" height="11" y="0" fill="#8cc665" data-count="40" data-date="2015-01-04"/>
          <rect class="day" width="11" height="11" y="13" fill="#8cc665" data-count="27" data-date="2015-01-05"/>
          <rect class="day" width="11" height="11" y="26" fill="#8cc665" data-count="27" data-date="2015-01-06"/>
          <rect class="day" width="11" height="11" y="39" fill="#44a340" data-count="57" data-date="2015-01-07"/>
          <rect class="day" width="11" height="11" y="52" fill="#8cc665" data-count="27" data-date="2015-01-08"/>
          <rect class="day" width="11" height="11" y="65" fill="#8cc665" data-count="32" data-date="2015-01-09"/>
          <rect class="day" width="11" height="11" y="78" fill="#d6e685" data-count="2" data-date="2015-01-10"/>
      </g>
  </g>
</svg>`;

console.log(parse(svg));
// =>
// { last_year: 318,
//   longest_streak: 11,
//   current_streak: 11,
//   weeks: [ [ [Object], [Object], [Object], [Object] ] ],
//   days:
//    [ { fill: '#1e6823',
//        date: Wed Dec 31 2014 02:00:00 GMT+0200 (EET),
//        count: 78,
//        level: 4 },
//      { fill: '#d6e685',
//        date: Thu Jan 01 2015 02:00:00 GMT+0200 (EET),
//        count: 6,
//        level: 1 },
//      { fill: '#d6e685',
//        date: Fri Jan 02 2015 02:00:00 GMT+0200 (EET),
//        count: 1,
//        level: 1 },
//      ...
//      { fill: '#d6e685',
//        date: Sat Jan 10 2015 02:00:00 GMT+0200 (EET),
//        count: 2,
//        level: 1 } ] }
```

## Documentation

### `parseGitHubCalendarSvg(input)`
Parses the SVG input (as string).

#### Params
- **String** `input`: The SVG code of the contributions calendar.

#### Return
- **Object** An object containing:
 - `last_year` (Number): The total contributions in the last year.
 - `longest_streak` (Number): The longest streak.
 - `current_streak` (Number): The current streak.
 - `days` (Array): An array of day objects:
   - `fill` (String): The hex color.
   - `date` (Date): The day date.
   - `count` (Number): The number of commits.
   - `level` (Number): A number between 0 and 4 (inclusive) representing the contribution level (more commits, higher value).
 - `weeks` (Array): The day objects grouped by weeks (arrays).

## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:

## License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md