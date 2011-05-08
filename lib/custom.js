var reMakeNumeric = /[^0-9.]/g;
module.exports = {
  /** simplistic price scrubber. */
  makeNumeric: function(str) {
    return parseFloat(str.replace(reMakeNumeric, ""), 10);
  }

  /** extract desired values from map */
  distill: function(keys, obj) {
    return _.map(keys, function(key){ obj[key]; });
  }
};