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
  },

  'deepMerge': {
    'Whatever': function() {
      var target = {val: 1, array: ['a'], obj: {o: 1}}
      var merged = _.deepMerge(_.deepCopy(target), {val2: 2, array: ['b'], obj2: {o: 2}});
      assert.equal(1, merged.val);
      assert.equal(2, merged.val2);
      assert.deepEqual(['b'], merged.array);
      assert.deepEqual({o: 1}, merged.obj);
      assert.deepEqual({o: 2}, merged.obj2);

      var merged = _.deepMerge(_.deepCopy(target), {val: 2, array: ['b'], obj: {o: 2, p: 3}});
      assert.deepEqual(2, merged.val);
      assert.deepEqual(['b'], merged.array);
      assert.deepEqual({o: 2, p: 3}, merged.obj);

      var merged = _.deepMerge(_.deepCopy(target), {val: 2, array: ['b'], obj: {o: 2, p: 3}}, true);
      assert.deepEqual([1, 2], merged.val);
      assert.deepEqual(['a','b'], merged.array);
      assert.deepEqual({o: 2, p: 3}, merged.obj);
    }
  }
}).run();
