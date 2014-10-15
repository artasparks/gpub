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
 *          ['flagtype', <default value>]
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
    if (process.argv.length <= 2) {
      return this.displayHelp();
    }

    var processed = {};
    // Set defaults
    for (var key in this.flagdefs) {
      processed[key] = this.flagdefs[key][1];
    }

    var unprocessed = [];
    var flagregex = /^-(-)?/;
    var helpregex = /^-(-)?h(elp)?$/;
    for (var i = 2; i < process.argv.length; i++) {
      var item = process.argv[i];
      if (helpregex.test(item)) {
        return this.displayHelp();
      }
      if (flagregex.test(item)) {
        // The item is attempting to be a flag.
        var itemkey = item.replace(flagregex, '')
        var value = null;
        if (/^[a-zA-Z_]+=/.test(itemkey)) {
          var splat = itemkey.split('=', 2);
          itemkey = splat[0];
          value = splat[1];
        }
        var flagarr = this.flagdefs[itemkey];
        if (flagarr === undefined) {
          return this.unknownFlag(itemkey);
        }
        var flagtype = flagarr[0];

        if (flagtype !== 'boolean' &&
            i + 1 < process.argv.length &&
            value === null) {
          console.log('zed');
          value = process.argv[i + 1];
          if (flagregex.test(value)) {
            // The next value is a flag value. This is an error.
            return this.unknownFlag(itemkey);
          }
          i++;
        }
        this.validateFlag(itemkey, value);
        processed[itemkey] = value

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

  displayHelp: function() {
    var usage = '\n\n:::Usage:::\n' + this._scriptname + ' ' +
        this.args.join(' ') + ' <optional flags>';
    var argData = '\n\n' +
        ':::Flags:::\n' +
        'flag_name: <expected type>, <default value>\n' +
        '-----------------------------------\n';
    for (var flag in this.flagdefs) {
      var farr= this.flagdefs[flag];
      argData += flag + ': <'
          + farr[0] + '>, <' + farr[1] + '>\n';
    }
    argData = argData.slice(0, argData.length - 1);
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
