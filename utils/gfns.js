exports.usingNamespace = function (global) {
  var objs = Array.prototype.slice.call(arguments, 1);

  objs.forEach(function (obj) {
    var prop;

    for (prop in obj)
      global[prop] = obj[prop];
  });
};
