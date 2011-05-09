var _ = require('../lib/underscored');
var vows = require('vows');
var assert = require('assert');

vows.describe('Underscorec').addBatch({
  'makeNumeric': function(){
    assert.equal(_.makeNumeric(" 1.2asdf"), 1.2);
  },

  'distill': function(){
    var obj = {a: 1, b: 2, c: 3};
    assert.deepEqual(_.distill(['a'], obj), [1]);
    assert.deepEqual(_.distill(['a', 'b'], obj), [1,2]);
    assert.deepEqual(_.distill(['c', 'b', 'a'], obj), [3,2,1]);
  },

  'deepCopy': {
    'Array': function() {
      var obj = [1];
      var obj2 = _.deepCopy(obj);
      obj[0] = 2;
      assert.equal(2, obj[0]);
      assert.equal(1, obj2[0]);
    },

    'Nested Array': function() {
      var obj = [[[1]]];
      var obj2 = _.deepCopy(obj);
      obj[0][0][0] = 2;
      assert.equal(2, obj[0][0][0]);
      assert.equal(1, obj2[0][0][0]);
    },

    'Object': function() {
      var obj = {0: 1}
      var obj2 = _.deepCopy(obj);
      obj[0] = 2;
      assert.equal(2, obj[0]);
      assert.equal(1, obj2[0]);
    },

    'Nested Object': function() {
      var obj = {0: {0: {0: 1}}};
      var obj2 = _.deepCopy(obj);
      obj[0][0][0] = 2;
      assert.equal(2, obj[0][0][0]);
      assert.equal(1, obj2[0][0][0]);
    }
  }
}).run();
