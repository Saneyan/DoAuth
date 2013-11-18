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
    spawn   = require('child_process').spawn;

var authorize = exports.authorize = function (options, callback) {
  var req, config, apart, data, err;

  console.log('Trying to authorize...');

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
        isf(callback) && callback();
      } else {
        err = new Error('An error occured when authorizing.');
        isf(callback) && callback(err);
      }
    });

  isf(callback) && req.on('error', callback);

  req.write(data);
  req.end();
};

var autoAuthorize = exports.autoAuthorize = function (options, callback) {
  var regular, test, auth, testing = false, authorizing = false;

  auth = function () {
    if (authorizing === false) {
      authorizing = true;
      authorize(_.omit(options, 'repeat', 'testHost', 'testRepeat'), function (err) {
        authorizing = false;
        isf(callback) && callback(err);
      });
    }
  };

  regular = setInterval(auth, options.repeat);

  test = setInterval(function () {
    if (testing === false) {
      testing = true;
      testNetwork(options.testHost, function (result) {
        if (result === false) {
          console.log('100% packet loss');
          auth();
        }
        testing = false;
      });
    }
  }, options.testRepeat);

  return {
    regular: regular,
    test: test
  };
};

function testNetwork(host, callback) {
  var proc = spawn('ping', ['-c ' + 3, host]);

  proc.stdout.on('data', function (data) {
    if (data.toString().indexOf('100% packet loss') !== -1) {
      callback(false);
      proc.kill();
    }
  });

  proc.on('exit', function () {
    callback(true);
  });
}

function loadConfig(path) {
  return JSON.parse(fs.readFileSync(path, { encoding: 'UTF-8' }));
}

function isf(target) {
  return typeof target === 'function';
}
