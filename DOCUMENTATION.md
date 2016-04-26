## Documentation

You can see below the API reference of this module.

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

