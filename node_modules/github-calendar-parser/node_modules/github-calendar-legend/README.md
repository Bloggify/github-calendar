# github-calendar-legend [![Support this project][donate-now]][paypal-donations]

The GitHub contributions calendar colors.

## Installation

```sh
$ npm i --save github-calendar-legend
```

## Example

```js
const legend = require("github-calendar-legend");

console.log(legend);
// => [ "#eee", "#d6e685", "#8cc665", "#44a340", "#1e6823" ]

console.log(legend.indexOf("#eee"));
// => 0

console.log(legend[4]);
// => "#1e6823"
```

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