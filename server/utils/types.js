var data = exports.data = {
  '.js': {
    contentType: 'text/javascript',
    formatType: 'js',
    isStatic: true
  },
  '.json': {
    contentType: 'application/json',
    formatType: 'js',
    isStatic: true
  },
  '.html': {
    contentType: 'text/html',
    formatType: 'html',
    isStatic: true
  },
  '.jade': {
    contentType: 'text/html', // *.jade file will be converted to html
    formatType: 'jade',
    isStatic: false
  },
  '.css': {
    contentType: 'text/css',
    formatType: 'css',
    isStatic: false
  }
};

exports.getFileData = function (path) {
  var result = null,
      ext = path.match(/\.[a-zA-Z0-9]+$/);
  
  return ext !== null ? data[ext[0]] : null;
};
