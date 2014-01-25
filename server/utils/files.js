var fs     = require('fs'),
    routes = require('routes');

exports.readStaticFile = function (path) {
  return fs.readFileSync(__dirname + '/static' + path, { 'enconding': 'utf-8' });
};

exports.compileJade = function (path) {
};

exports.readErrorPage = function (code, message) {
};
