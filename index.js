var _ = require('./lib/underscore/underscore');

_.mixin(require('./lib/underscore.string/lib/underscore.string'));
_.mixin(require('./lib/custom'))

module.exports = _;