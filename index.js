var through = require('through2')
var util = require('core-util-is')

function match(opts, iter) {

  var regex = util.isRegExp(opts) ? opts : opts.regex
  if (!util.isRegExp(regex)) throw new Error('missing regular expression')
  if (typeof iter != 'function') throw new Error('missing callback')

  var matched = false

  return through(function (chunk, enc, callback) {
    var str = chunk.toString()
    var m = regex.exec(str)

    if (m) {
      if (true === opts.matchAll) {
        iter(m)
      }
      else if (false === matched) {
        matched = true
        iter(m)
      }
    }

    this.push(chunk)
    callback()
  })

}

module.exports = match
