var _ = require('underscore');

var reMakeNumeric = /[^0-9.]/g;
module.exports = {
  /** simplistic price scrubber. */
  makeNumeric: function(str) {
    return parseFloat(str.replace(reMakeNumeric, ""), 10);
  },

  /** extract desired values from map */
  distill: function(keys, obj) {
    return _.map(keys, function(key){ return obj[key]; });
  },

  /** deeply copy Arrays/Objects */
  deepCopy: function(thing) {
    // so hackety...
    return JSON.parse(JSON.stringify(thing));
  }
};