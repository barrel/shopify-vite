declare module 'penthouse' {
  const penthouse: any;
  export default penthouse;
}

declare module 'crittr' {
  const crittr: any;
  export default crittr;
}

type PenthouseAllowedResponseCallback = (response: object) => boolean;

interface PenthouseConfig {
    /** Accessible url. Use file:/// protocol for local html files. */
    url: string;
    /** Original css to extract critical css from */
    cssString: string;
    /** Path to original css file on disk (if using instead of `cssString`) */
    css: string;
    /** Width for critical viewport */
    width: number;
    /** Height for critical viewport */
    height: number;
    /** Configuration for screenshots (not used by default). See [Screenshot example](https://github.com/pocketjoso/penthouse/blob/master/examples/screenshots.js) */
    screenshots: object;
    /** Keep media queries even for width/height values larger than critical viewport. */
    keepLargerMediaQueries: boolean;
    /**
     * Array of css selectors to keep in critical css, even if not appearing in critical viewport.
     * Strings or regex (f.e. `['.keepMeEvenIfNotSeenInDom', /^\.button/]`)
     */
    forceInclude: Array<string>;
    /**
     * Array of css selectors to remove in critical css, even if appearing in critical viewport.
     * Strings or regex (f.e. `['.doNotKeepMeEvenIfNotSeenInDom', /^\.button/]`)
     */
    forceExclude: Array<string>;
    /** Css properties to filter out from critical css */
    propertiesToRemove: Array<string>;
    /** Ms; abort critical CSS generation after this time */
    timeout: number;
    /** Settings for puppeteer. See [Custom puppeteer browser example](https://github.com/pocketjoso/penthouse/blob/master/examples/custom-browser.js) */
    puppeteer: object;
    /** Ms; stop waiting for page load after this time (for sites when page load event is unreliable) */
    pageLoadSkipTimeout: number;
    /**
     * ms; wait time after page load before critical css extraction starts
     * (also before "before" screenshot is taken, if used)
     */
    renderWaitTime: number;
    /** set to false to load JS (not recommended) */
    blockJSRequests: boolean;
    /** characters; strip out inline base64 encoded resources larger than this */
    maxEmbeddedBase64Length: number;
    /** Can be specified to limit nr of elements to inspect per css selector, reducing execution time. */
    maxElementsToCheckPerSelector: number;
    /** specify which user agent string when loading the page */
    userAgent: string;
    /** Set extra http headers to be sent with the request for the url. */
    customPageHeaders: object;
    /** For formatting of each cookie, see [Puppeteer setCookie docs](https://github.com/puppeteer/puppeteer/blob/v1.9.0/docs/api.md#pagesetcookiecookies) */
    cookies: Array<string>;
    /** Make Penthouse throw on errors parsing the original CSS. Legacy option, not recommended */
    strict: boolean;
    /**
     * Let Penthouse stop if the server response code is not matching this value. number and
     * regex types are tested against the [response.status()](https://github.com/puppeteer/puppeteer/blob/v1.14.0/docs/api.md#responsestatus). A function is also allowed and
     * gets [Response](https://github.com/puppeteer/puppeteer/blob/v1.14.0/docs/api.md#class-response) as argument. The function should return a boolean.
     */
    allowedResponseCode: number | RegExp | PenthouseAllowedResponseCallback;
}