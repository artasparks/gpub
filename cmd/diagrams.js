const files = require('./files.js')

module.exports = {
  render: function(opts) {
    if (!opts.input) {
      throw new Error('Expected input-spec to be defined, but was: '
          + opts.input +
          '. Pass in with --input <spec-name>');
    }
    var inputFile = opts.input;
    var parsed = files.readAndParseSpec(inputFile);
    console.log('Processing: ' + inputFile);
  },
};
