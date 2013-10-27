/**
 * DoAuth library
 *
 * @author  Saneyuki Tadokoro <saneyan@mail.gfunction.com>
*/

var _       = require('underscore'),
    fs      = require('fs'),
    qs      = require('querystring'),
    url     = require('url'),
    https   = require('https'),
    forever = require('forever');

exports.authorize = function (options, callback) {
  var req, config, apart, data, err;

  config = loadConfig(options.configPath);

  data = qs.stringify({
    username: config.username,
    password: config.password,
    buttonClicked: '4',
    err_flag: '0'
  });

  apart = url.parse(
    options.type === 'dormitory' ? config.dormitory_url :
    options.type === 'wireless'  ? config.wireless_url  : null);

  options.debug && console.log(apart);
  options.debug && console.log(data);

  req = https.request({
      hostname: apart.hostname,
      port: apart.port,
      path: apart.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    }, function (res) {
      res.on('data', function (chunk) {
        process.stdout.write(chunk);
      });

      if (res.statusCode == 200) {
        callback();
      } else {
        err = new Error('An error occured when authorizing.');
        callback(err);
      }
    });

  req.on('error', function (err) {
    callback(err);
  });

  req.write(data);
  req.end();
};

function loadConfig(path) {
  return JSON.parse(fs.readFileSync(path, { encoding: 'UTF-8' }));
}
