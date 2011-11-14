var _ = require('underscore');

var reMakeNumericLoose = /[^0-9.,]/g;
var reMakeNumeric = /[^0-9.]/g;
var reIsEU = /,\d\d$/g;

/** simplistic price scrubber. */
exports.makeNumeric= function(str, isEU) {
  str = str.replace(reMakeNumericLoose, "");
  if (isEU || (isEU === undefined && str.match(reIsEU))) {
    str = exports.tr(str, ",.", ".,").replace(reMakeNumeric, "");
  } else {
    str = str.replace(reMakeNumeric, "");
  }

  return parseFloat(str, 10);
};

/** @see perl's tr/// */
exports.transliterate = exports.tr = function(str, from, to) {
  var map = exports.hash.apply(exports, _.flatten(_.zip(from.split(""), to.split(""))));
  var len = str.length;
  var s = new Array(str.length);
  for (var i=0; i < len; i++) {
    var c = str.charAt(i);
    s[i] = map[c] || c;
  };
  return s.join("");
}

/** Make a new object like ruby's Hash.new */
exports.hash = function() {
  var len = arguments.length;
  var obj = new Object(len/2);
  for (var i = 0; i < len; i+=2) {
    obj[arguments[i]] = arguments[i+1];
  }
  return obj;
}

/** extract desired values from map */
exports.distill= function(keys, obj) {
  return _.map(keys, function(key){ return obj[key]; });
};

/** deeply copy Arrays/Objects */
exports.deepCopy= function(thing) {
  // so hackety...
  return JSON.parse(JSON.stringify(thing));
}

/** Like _.extend; but merge, instead of replacing shallowly. */
exports.deepMerge= function(target) {
  var srcs = Array.prototype.slice.call(arguments, 1);

  if ('boolean' === typeof srcs[srcs.length-1]) {
    var xtraDeep = srcs.pop();
  }

  for (var i=0; i < srcs.length; i++) {
    var src = srcs[i];

    // walk src.
    _.each(src, function(value, key) {
      var tval = target[key];
      // no target
      if (tval === undefined) {
        target[key] = value;
      // merge arrays
      } if (xtraDeep) {
        if (Array.isArray(value) && Array.isArray(tval)) {
          target[key] = tval.concat(value);
        // merge hashes
        } else if ('object' === typeof value && 'object' === typeof tval) {
          exports.deepMerge(tval, value);
        // shove src onto target value array
        } else if (Array.isArray(tval)) {
          tval.append(value);
        // join into an array
        } else {
          target[key] = [tval, value];
        }
      } else {  // !xtraDeep
        if ('object' === typeof value && 'object' === typeof tval) {
          exports.deepMerge(tval, value, xtraDeep);
        } else {
          target[key] = value;
        }
      }
    })
  };

  return target;
}

/**
 * Object.create with constructor-like assignment to properties (based on enumeration of creation order).
 *
 * Wha-huh? Check it:
 *
 * var User = {
 *   name: null,
 *   id: null,
 *   sayHello: function() {
 *     console.log('Hello '+ this.name);
 *   }
 * }
 *
 * var bob = _.objectGen(User, 'Bob', 1);
 * bob.name
 *   => Bob
 * bob.id
 *   => 1
 *
 * From: http://stackoverflow.com/questions/2709612/using-object-create-instead-of-new/6571266#6571266
 */
exports.objectGen = function(o) {
   var makeArgs = arguments 
   function F() {
      var prop, i=1, arg, val
      for(prop in o) {
         if(!o.hasOwnProperty(prop)) continue
         val = o[prop]
         arg = makeArgs[i++]
         if(typeof arg === 'undefined') break
         this[prop] = arg
      }
   }
   F.prototype = o
   return new F()
};

exports.flattenKeys = function(obj, prefix, onto) {
  if (!onto) onto = {};

  _.each(obj, function(v, k) {
    if (_.isArray(v)) {
      onto[prefix ? prefix + "." + k : k] = v;
    } else if (typeof v === "object") {
      exports.flattenKeys(v, prefix ? prefix + "." + k : k, onto);
    } else {
      onto[prefix ? prefix + "." + k : k] = v;
    }
  });

  return onto;
}