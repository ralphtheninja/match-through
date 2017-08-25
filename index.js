const through = require('through2')
const util = require('core-util-is')

function match (opts, iter) {
  const regex = util.isRegExp(opts) ? opts : opts.regex
  if (!util.isRegExp(regex)) throw new Error('missing regular expression')
  if (typeof iter !== 'function') throw new Error('missing callback')

  let buff = ''
  let matched = false

  return through(function (chunk, enc, callback) {
    this.push(chunk)

    var str = chunk.toString()
    buff += str

    var m = regex.exec(opts.buffer ? buff : str)

    if (m) {
      if (opts.matchAll === true) {
        iter(m)
      } else if (matched === false) {
        matched = true
        iter(m)
      }
    }

    callback()
  })
}

module.exports = match
