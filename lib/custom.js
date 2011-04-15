var reMakeNumeric = /[^0-9.]/g;
module.exports = {
  /** simplistic price scrubber. */
  makeNumeric: function(str) {
    return parseFloat(str.replace(reMakeNumeric, ""), 10);
  }
};