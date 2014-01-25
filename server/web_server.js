var http  = require('http'),
    url   = require('url'),
    routes = require('./configs/routes');

routes.route('/\.(?:js|html|css)$/', readStaticFile);
routes.route('/\.jade$/', compileJade);
routes.route('/^(404|500)$/', readErrorPage);

http.createServer(reqHandler).listen(3000, '127.0.0.1');

function reqHandler(req, res) {
  var ctype, pn, body, code;

  // If request pathname points static file, read this file
  // in static directory. Otherwise create a file dynamically.
  try {
    fdata = routes.proceed(url.parse(req.url).pathname);

    if (!fdata) {
      fdata = routes.route('404');
      code = 404;
    } else {
      code = 200;
    }
  } catch (e) {
    fdata = routes.route('500', { message: e.message });
    code = 500;
  }

  res.writeHead(code, {
    'Content-Type': fdate.contentType,
    'Content-Length': fdata.contentLength
  });

  res.end(fdata.body);
}

function readStaticFile() {
}

function compileJade() {
}

function readErrorPage() {
}
