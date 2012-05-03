var _ = require('underscore');
_.mixin(require('underscore.string').exports());
_.mixin(require('./custom'))

module.exports = _;