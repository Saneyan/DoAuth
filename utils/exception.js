var InvalidArgumentException 
  = exports.InvalidArgumentException 
  = function (arg) {
    this.message = "Invalid argument '" + arg + "'";
  };

InvalidArgumentException.__proto__ = Error.prototype;

var LackOfArgumentException
  = exports.LackOfArgumentException
  = function () {
    this.message = "Not enough arguments";
  };

LackOfArgumentException.__proto__ = Error.prototype;

var AuthorizeException
  = exports.AuthorizeException
  = function () {};

AuthorizeException.__proto__ = Error.prototype;
