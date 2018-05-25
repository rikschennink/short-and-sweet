# Short and Sweet, Accessible Character Counter

Scales up (or down) text so it fits perfectly to its parent container. 

Ideal for flexible and responsive websites.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rikschennink/short-and-sweet/blob/gh-pages/LICENSE)
[![npm version](https://badge.fury.io/js/short-and-sweet.svg)](https://badge.fury.io/js/short-and-sweet)
[![Donate with PayPal](https://img.shields.io/badge/donate-PayPal.me-pink.svg)](https://www.paypal.me/rikschennink/5)


## Features

- No dependencies
- Easy setup
- Accessible


## Time to learn ES6?

Short and Sweet is written in ES6.

If you want to learn how to write modern ES6 JavaScript as well, I highly recommend [ES6 for Everyone](http://bit.ly/es6-course) by Wes Bos. 


## Installation

Install from npm:

```
npm install short-and-sweet --save
```

Or download `dist/short-and-sweet.min.js` and include the script on your page like shown below.


## Usage

Run short-and-sweet like shown below and pass an element reference or a querySelector. For best performance include the script just before the closing `</body>` element.

```html
<textarea maxlength="200" id="my-element"></textarea>

<script src="short-and-sweet.min.js"></script>
<script>
shortAndSweet('#my-element');
</script>
```



## Tested

- Modern browsers
- VoiceOver + Safari
- NVDA + Firefox
- IE 10+


## Versioning

Versioning follows [Semver](http://semver.org).

## License

MIT
