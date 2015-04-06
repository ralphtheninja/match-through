var match = require('../')
var test = require('tape')
var split = require('split')
var spawn = require('child_process').spawn

test('constructor parameters', function (t) {
  t.throws(function () { match() }, 'no parameters')
  t.throws(function () { match({}) }, 'empty options')
  t.throws(function () { match({ regex: /foo/gi }) }, 'missing callback')
  t.throws(function () { match(/foo/gi) }, 'missing callback')
  t.throws(function () {
    match({ regex: new RegExp('bar') })
  }, 'missing callback')
  t.throws(function () {
    match(new RegExp('bar'))
  }, 'missing callback')
  t.doesNotThrow(function () {
    match({ regex: /foo/gi }, function () {})
  }, 'valid parameters')
  t.doesNotThrow(function () {
    match(/foo/gi, function () {})
  }, 'valid parameters')
  t.doesNotThrow(function () {
    match({ regex: new RegExp('bar') }, function () {})
  }, 'valid parameters')
  t.doesNotThrow(function () {
    match(new RegExp('bar'), function () {})
  }, 'valid parameters')
  t.end()
})

test('single match while parsing file size from from ls -lh', function (t) {
  var count = 0
  var child = spawn('ls', [ '-lh' ])
  child.stdout.pipe(split()).pipe(match(/^total\s+(\S+)/, function (m) {
    t.ok(m, 'something matched')
    ++count
  }))
  child.on('close', function (code) {
    t.equal(count, 1, 'should be a single match')
    t.end()
  })
})

test('multiple match while parsing output from ls -al', function (t) {
  var count = 0
  var child = spawn('ls', [ '-al' ], { cwd: __dirname })
  var opts = { regex: /^d/i, matchAll: true }
  child.stdout.pipe(split()).pipe(match(opts, function (m) {
    t.ok(m, 'something matched')
    ++count
  }))
  child.on('close', function (code) {
    t.equal(count, 2, 'should match folders . and ..')
    t.end()
  })
})

test('single match while parsing bufferred output from ls -al', function (t) {
  var count = 0
  var child = spawn('ls', [ '-al' ], { cwd: __dirname })
  var opts = { regex: /test\.js/, buffer: true }
  child.stdout.pipe(match(opts, function (m) {
    t.ok(m, 'something matched')
    ++count
  }))
  child.on('close', function (code) {
    t.equal(count, 1, 'should match file test.js')
    t.end()
  })
})

test('multiple match while parsing bufferred output from ls -al', function (t) {
  var count = 0
  var child = spawn('ls', [ '-al' ], { cwd: __dirname })
  var opts = { regex: /test\.js/g, buffer: true, matchAll: true }
  child.stdout.pipe(split()).pipe(match(opts, function (m) {
    t.ok(m, 'something matched')
    ++count
  }))
  child.on('close', function (code) {
    t.equal(count, 2, 'should match file test.js and anothertest.json')
    t.end()
  })
})
