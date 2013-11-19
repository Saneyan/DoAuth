/**
 * DoAuth Library (doauth-ut)
 *
 * See readme at https://github.com/Saneyan/DoAuth/blob/master/README.md
 *
 * @version  0.1.0a
 * @license  MIT
 * @author   Saneyuki Tadokoro <saneyan@mail.gfunction.com>
 *           (gfunction Computer Science Laboratory)
*/

var _     = require('underscore'),
    fs    = require('fs'),
    qs    = require('querystring'),
    url   = require('url'),
    https = require('https'),
    spawn = require('child_process').spawn;

var _testing = false, _authorizing = false;

/**
 * authorize - Authorize network system only once
 * @param Object options (Options of authorization)
 * @param Function callback (Will be called after trying to authorize)
*/
var authorize = exports.authorize = function (options, callback) {
  var req, config, apart, data, u, d;

  _authorizing = true;

  log('Trying to authorize...');

  // Get config object from a JSON file.
  config = loadConfig(options.configPath);

  if (options.type === 'dormitory') {
    u = config.dormitory_url;
    d = {
      name: config.username,
      pass: config.password
    };
  } else if (options.type === 'wireless') {
    u = config.wireless_url;
    d = {
      username: config.username,
      password: config.password,
      // The query must include these variables for wireless authorization
      // but it does not have to include them for network authorization of dormitories.
      buttonClicked: '4',
      err_flag: '0'
    };
  }

  callback = callback || function () {};
  data = qs.stringify(d);
  apart = url.parse(u);

  options.debug
    && log(apart, data);

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
      var err;

      res.on('data', function (chunk) {
        process.stdout.write(chunk);
      });

      _authorizing = false;

      // As long as network is reachable, even authorizing failures,
      // the status code will be 200.
      if (res.statusCode == 200) {
        callback();
      } else {
        err = new Error('An error occured when authorizing.');
        callback(err);
      }
    });

  req.on('error', callback);
  req.write(data);
  req.end();
};

/**
 * autoAuthorize - Authorize and test network system at optional intervals
 * @param Object options (Options of authrization)
 * @param Function callback (Will be called after trying to authorize)
 * @return Object (Includes interval ID)
*/
exports.autoAuthorize = function (options, callback) {
  callback = callback || function () {};

  function auth() {
    !_authorizing
      && authorize(options, callback);
  };

  function test() {
    !_testing
      && testNetwork(options.testHost, function (result) {
        !result && auth();
      });
  }

  return {
    regular: setInterval(auth, options.repeat),
    test: setInterval(test, options.testRepeat)
  };
};

/**
 * isTesting - Check if this lib tests network
 * @return Boolean (true means that it is in progress)
*/
exports.isTesting = function () {
  return _testing;
};

/**
 * isAuthorizing - Check if this lib authorizes network system
 * @return Boolean
*/
exports.isAuthorizing = function () {
  return _authorizing;
};

/**
 * testNetwork - Test network whether it can access an external server
 * @param String host (FQDN or IP address)
 * @param Function callback (Will be given a result of test)
*/
function testNetwork(host, callback) {
  var proc;

  _testing = true;

  proc = spawn('ping', ['-c ' + 3, host]);

  proc.stdout.on('data', function (data) {
    // Trying to ping to an external server. If all of packets loss,
    // it gives false to the callback.
    if (data.toString().indexOf('100% packet loss') !== -1) {
      _testing = false;
      callback(false);
      proc.kill();
    }
  });

  // If all of packets are sended to an external server, this callback
  // will be called.
  proc.on('exit', function () {
    _testing = false;
    callback(true);
  });
}

/**
 * loadConfig
 * @param String path
 * @return Object
*/
function loadConfig(path) {
  return JSON.parse(fs.readFileSync(path, { encoding: 'UTF-8' }));
}

/**
 * log
 * @param Arguments
*/
function log() {
  [].slice.call(arguments).forEach(console.log);
}
