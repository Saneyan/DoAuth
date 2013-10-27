require('../utils/gfns').usingNamespace(GLOBAL,
  require('../utils/doc'),
  require('../utils/args'),
  require('../utils/exception'),
  require('../lib/doauth'));

try {

  var args = parseObject(Array.prototype.slice.call(process.argv, 2));

  authorize({
      type:       args.type,
      debug:      args.debug  || false,
      configPath: args.config || './configs/network.json'
    }, function () {
      console.log(arguments);
    });

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
