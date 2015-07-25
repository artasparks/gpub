/**
 * Create a new flagz def object. See the FlagzDef for more details.
 */
var init = function(helptext, args, flagkeys) {
  return new FlagzDef(helptext, args, flagkeys);
};

/**
 * The flagz def object.  This defines how to process arguments to a command
 * line script.
 *
 * Params:
 *  helptext: Basic helptext string to display in the case of -h, --help or an
 *      error.
 *
 *  args: Array of arguments expected to be passed to the scirpt. Used to craft
 *      the usage message.
 *
 *  flagdefs: The flag object is where the magic happens. It's a mapping from
 *      flag name to a flag array.
 *
 *      Flag names have have the format: 
 *          foo_bar_biff
 *      Flag arrays (the values in the obj) have the format:
 *          ['flagtype', <default value>, helptext]
 *
 *      where flag types are strings with the following formats:
 *          :: Default Javascript Types ::
 *          boolean
 *          string
 *          array
 *          object
 *          function
 *
 *          :: Constructed Types ::
 *          glift.enums.boardRegions
 *          gpub.diagrams.types
 *          etc.
 */
var FlagzDef = function(helptext, args, flagdefs) {
  /**
   * The base help text to display.
   */
  this.helptext = helptext || '';

  /**
   * Array of no-name args. These are generally required args
   * i.e., ./scriptname <filename>
   * where <filename. is the no-name arg.
   *
   * This is only used in generating the help text.
   */
  this.args = args || []

  /**
   * Map of flag names to flag-array.
   */
  this.flagdefs = flagdefs || {};

  /**
   * ScriptName of the currently running script. Defined on process.
   */
  this._scriptname = null;
};

FlagzDef.prototype = {
  /**
   * Process command line flags and arguments based on the flag definition.
   */
  process: function() {
    var scriptpath = process.argv[1] || 'script';
    var scriptname = scriptpath.replace(/([^\/]*\/)+/g, '');
    this._scriptname = scriptname;
    // It's sometimes advantageous to have scripts that work without any
    // arguments
    // if (process.argv.length <= 2) {
      // return this.displayHelp();
    // }

    var processed = {};
    // Set defaults set in the init function by the user.
    for (var key in this.flagdefs) {
      processed[key] = this.flagdefs[key][1];
    }

    var unprocessed = [];
    var flagregex = /^-(-)?/;
    var helpregex = /^-(-)?h(elp)?$/;
    for (var i = 2; i < process.argv.length; i++) {
      var item = process.argv[i];
      if (helpregex.test(item)) {
        // If at any point we see help flag, we immediately terminate and
        // display the help text.
        return this.displayHelp();
      }
      if (flagregex.test(item)) {
        // The argument is attempting to be a flag. We know this because the
        // value on the command line looks like --foo or -foo. Thus, we need to
        // get the flag 'value'. The value will have the form --foo=bar or -f
        // bar.
        var flagname = item.replace(flagregex, '')
        var value = null;
        if (/^[a-zA-Z_]+=/.test(flagname)) {
          // This flag has the form --foo=. So, split on = and the second part
          // is the value.
          var splat = flagname.split('=', 2);
          flagname = splat[0];
          value = splat[1];
        }

        // var flagname = flagname.replace(

        // Recall that the flag arr has the format
        //  [type, default value, description]
        var flagarr = this.flagdefs[flagname];
        if (flagarr === undefined) {
          // if (/^no.*$/.test
          return this.unknownFlag(flagname);
        }

        var flagtype = flagarr[0];
        if (i + 1 < process.argv.length && value === null) {
          // The flag value is still null. We need to peek at the next value in
          // the process args. Ideally, the flag has the format --foo bar
          value = process.argv[i + 1];
          if (flagtype === 'boolean') {
            // Boolean values are special. We allow --foo as truthy and --no
          }
          if (flagregex.test(value)) {
            // The next value is a flag value. This is an error.
            return this.unknownFlag(flagname);
          }
          i++;
        }
        this.validateFlag(flagname, value);
        processed[flagname] = value

      } else {
        unprocessed.push(item);
      }
    }
    return new Flagz(scriptname, unprocessed, processed);
  },

  unknownFlag: function(flagname) {
    console.log('Unknown Option: ' + flagname);
    this.displayHelp()
  },

  validateFlag: function(argname, argvalue) {
    // TODO(kashomon): I should probably do this at some point.
  },

  /** Display the help text. */
  displayHelp: function() {
    var usage = '\n\n:::Usage:::\n' + this._scriptname + ' ' +
        this.args.join(' ') + ' <optional flags>';
    var argData = '\n\n' +
        ':::Flags:::\n' +
        'flag_name: <expected type>, <default value> :: Help Text\n' +
        '--------------------------------------------------------\n';
    for (var flag in this.flagdefs) {
      var farr = this.flagdefs[flag];
      var helpText = farr[2] || '';
      argData += flag + ': <'
          + farr[0] + '>, <' + farr[1] + '>, ' + helpText + '\n';
    }
    argData += '--------------------------------------------------------';
    console.log(
        this._scriptname + ': ' + this.helptext + usage + argData);
    process.exit(1);
  }
};

/**
 * Construct a flag wrapper. Created with FlagzDef.process();
 */
var Flagz = function(scriptname, args, processed) {
  /**
   * Name of the script
   */
  this.scriptname = scriptname;

  /**
   * Array of unprocess flag values
   */
  this.args = args;

  /**
   * Process values: a mapping from flag name to value.
   */
  this.processed = processed;
};

exports.init = init;
