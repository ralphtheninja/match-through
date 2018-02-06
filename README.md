# match-through

> Match on patterns in a stream

[![Build Status](https://travis-ci.org/ralphtheninja/match-through.svg?branch=master)](https://travis-ci.org/ralphtheninja/match-through)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Greenkeeper badge](https://badges.greenkeeper.io/ralphtheninja/match-through.svg)](https://greenkeeper.io/)

* Pipe data through a stream and get notified when something matches
* Match once or multiple times

## Install

```
$ npm install match-through --save
```

## Usage

Print out the total file size in the current directory.

```js
var match = require('match-through')
var spawn = require('child_process').spawn
spawn('ls', [ '-lh' ]).stdout.pipe(match(/^total\s+(\S+)/, function (m) {
  console.log(m[1])
})).pipe(process.stdout)
```

## Api

### `match(opts, iter)`

Returns a through stream that calls back when a regular expression is matched. Does nothing with the data passing through so it's a pure pass through stream.

* opts *(object|regexp)* Either options object with `regex` and `matchAll` properties or a single regular expression.
* iter *(function)* Called when there is a match. Will call multiple times if there are several matches and `matchAll` property is `true`. If `opts` is a regular expression the callback will be called at the first match only, if ever.

## License
All code, unless stated otherwise, is licensed under the [`WTFPL`](http://www.wtfpl.net/txt/copying/).
