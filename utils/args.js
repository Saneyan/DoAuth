require('../utils/gfns').usingNamespace(GLOBAL,
  require('../utils/exception'));

var _ = require('underscore');

var validOptions = {
  type:   ['wireless', 'dormitory'],
  debug:  ['true', 'false'],
  config: ['*<|mat>'],
};

var requirements = ['type']; 

exports.parseObject = function (args) {
  var count = 0,
      parsed = {};

  args.forEach(function (arg) {
    arg = split(arg);

    if (isValid(arg)) {
      parsed[arg.key] = arg.value;

      if (requirements.indexOf(arg.key) !== -1)
        count++;
    } else {
      throw new InvalidArgumentException(arg.key);
    }
  });

  if (requirements.length !== count) 
    throw new LackOfArgumentException();

  return parsed;
};

function split(arg) {
  var splited = arg.split('=');

  return {
    key: splited[0],
    value: splited[1]
  };
}

function isValid(arg) {
  var valid = false;
  
  if (validOptions.hasOwnProperty(arg.key)) {
    values = validOptions[arg.key];
    values.forEach(function (value) {
      if (value === arg.value || value === '*<|mat>')
        valid = true;
    });
  }

  return valid;
}
