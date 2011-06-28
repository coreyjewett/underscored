var _ = require('underscore');

var reMakeNumeric = /[^0-9.]/g;
  /** simplistic price scrubber. */
exports.makeNumeric= function(str) {
  return parseFloat(str.replace(reMakeNumeric, ""), 10);
};

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
