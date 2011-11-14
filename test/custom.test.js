var _ = require('../lib/underscored');
var vows = require('vows');
var assert = require('assert');

vows.describe('Underscored').addBatch({
  'makeNumeric': function(){
    assert.equal(_.makeNumeric(" 1.2asdf"), 1.2);
    assert.equal(_.makeNumeric(" EUR 0,97 ", true), 0.97);
    assert.equal(_.makeNumeric(" EUR 80,99 ", true), 80.99);
    assert.equal(_.makeNumeric(" EUR 2.780,99 ", true), 2780.99);
    assert.equal(_.makeNumeric(" EUR 2.780,99 ", false), 2.78099);   // this is obviously "wrong".
    assert.equal(_.makeNumeric(" EUR 2.780,99 "), 2780.99);   // auto-detect EU
    assert.equal(_.makeNumeric(" Zwischensumme:	 € 2.780,56"), 2780.56);
    assert.equal(_.makeNumeric(" Zwischensumme:	 € 2.780,56", true), 2780.56);
  },

  'hash': function(){
    assert.deepEqual(
      _.hash("a", 1, "b", 2), 
      { a: 1, b: 2 }
    );
  },

  'transliterate': function(){
    assert.equal(_.tr("qwerty", "wet", "uik"), "quirky");
    assert.equal(_.tr("1.234,56", ",.", ".,"), "1,234.56");
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
  },

  'objectGen': {
    'works': function() {
      var User = {
        name: null,
        id: null,
        sayHello: function() {
          console.log('Hello '+ this.name);
        }
      }

      var bob = _.objectGen(User, 'Bob', 1);
      assert.equal("Bob", bob.name);
      assert.equal(1, bob.id);

      var ben = _.objectGen(User, 'Ben', 4);
      assert.equal("Ben", ben.name);
      assert.equal(4, ben.id);
    }
  },

  'flattenKeys': {
    'does not mangle vanilla hash': function() {
      var obj = {
        'hi': 'there',
        'fuzzy': 'dice'
      }

      assert.deepEqual(_.flattenKeys(obj), obj);
    },

    'works': function() {
      var obj = {
        'hi': 'there',
        'fuzzy': 'dice',
        'hello': {
          a: 1,
          b: 2,
          c: {
            one: "hen",
            two: "ducks",
            three: "squawking geese"
          },
          d: ['x','y','z']
        }
      }

      var expect = {
        'hi': 'there',
        'fuzzy': 'dice',
        'hello.a': 1,
        'hello.b': 2,
        'hello.c.one': "hen",
        'hello.c.two': "ducks",
        'hello.c.three': "squawking geese",
        'hello.d': ['x','y','z']
      }

      assert.deepEqual(_.flattenKeys(obj), expect);
    }
  }
}).run();
