require('../utils/gfns').usingNamespace(GLOBAL,
  require('../utils/doc'),
  require('../utils/args'),
  require('../utils/exception'),
  require('../lib/doauth'));

var _ = require('underscore');

try {

  var args, auth, quiet, baseOption;

  args = parseObject(Array.prototype.slice.call(process.argv, 2));

  baseOption = {
    type:       args.type,
    debug:      Boolean(args.debug || 'false'),
    configPath: args.config || './configs/network.json',
  };

  if (args.auto === 'true') {
    autoAuthorize(_.extend(baseOption, {
      repeat:     Number(args.repeat)      || 3600000,
      testRepeat: Number(args.test_repeat) || 30000,
      testHost:   args.test_host           || '8.8.8.8' // Default test host is Google Public DNS
    }), stdout);
  } else {
    authorize(baseOption, stdout);
  }

} catch (e) {

  if (e instanceof InvalidArgumentException
    || e instanceof LackOfArgumentException) {
    console.log(e.message);
    showDoc();
  } else if (e instanceof AuthorizeException) {
    console.log(e.message);
  } else {
    console.log(e.message);
  }

}

function stdout(message) {
  console.log(message);
}
