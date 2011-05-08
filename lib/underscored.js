var _ = require('./lib/underscore/underscore');
_.mixin(require('underscore.string'));
_.mixin(require('./lib/custom'))

module.exports = _;