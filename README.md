
















# github-calendar

Embed your GitHub contributions calendar anywhere.




## Installation

```sh
$ npm i github-calendar
```
















## Documentation





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
   - `global_stats` (Boolean): If `false`, the global stats (total, longest and current streaks) will not be calculated and displayed. By default this is enabled.
   - `responsive` (Boolean): If `true`, the graph is changed to scale with the container. Custom CSS should be applied to the element to scale it appropriately. By default this is disabled.

#### Return
- **Promise** A promise returned by the `fetch()` call.






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## License
See the [LICENSE][license] file.


[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
