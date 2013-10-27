var doauth = require('../lib/doauth');

describe('DoAuth', function () {
  false && it('should authorize network system', function (done) {
    doauth.authorize({
      debug: true,
      type: 'dormitory',
      configPath: './configs/network.json'
    }, eval.bind(null, done));
  });

  false && it('should authorize wireless network system', function (done) {
    doauth.authorize({
      debug: true,
      type: 'wireless',
      configPath: './configs/network.json'
    }, eval.bind(null, done));
  });
});

function eval(done, err) {
  if (err) throw err
  else done();
}
