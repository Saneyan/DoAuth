var _     = require('underscore'),
    files = require('../utils/files'),
    types = require('../utils/types');

var routes = exports.routes = {
  // The property name is used to as a source of regular expressions.
  '/\.(?:js|html|css)$/': 'readStaticFile',
  '/\.jade$/': 'compileJade',
  '/^(404|500)$/': 'readErrorPage'
};

exports.route = function (regSrc, handler) {
  if (!routes[regSrc])
    routes[regSrc] = [];
  routes[regSrc].push(handler);
};

exports.proceed = function (pn, option) {
  var src, data, result;

  data = types.getFileData(pn);

  if (data === null)
    throw new Error('Not match file type');

  for (src in routes) {
    if (pn.match(new RegExp(src)))
      result.body = files[routes[src]](pn, option);
  }

  _.extend(result, files.ge
};
