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
 *      Flag names (keys) have have the format: fooBarBiff. However, when flags
 *          are passed in, --foo_bar_biff gets converted into fooBarBiff
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
  /** Processes a flag's type. */
  _processFlagType: function(value, flagarr, origFlagName) {
    var flagtype = flagarr[0];
    if (flagtype === 'boolean') {
      if (value === 'false' || value === '0') {
        value = false;
      } else if (value === 'true' || value === '1') {
        // Note: this catches the undefined case. However, for booleans,
        // specifying a flag like blah.js --foo_bool shoulb be considered true.
        value = true;
      } else  {
        return null;
      }
    } else if (value === null || value === undefined) {
      // We use null as the default (un-filled in) type, for all types.
      value = null;
    } else if (flagtype === 'number') {
      var oldvalue = value;
      if (/^\d+$/.test(value)) {
        value = parseInt(value, 10);
      } else {
        value = parseFloat(value);
      }
      if (isNaN(value)) {
        throw new Error('Could not parse ' + oldvalue + 'as a number');
      }
    } else if (/Array.*/.test(flagtype)) {
      value = value.split(',');
    }
    return value;
  },

  /**
   * Process command line flags and arguments based on the flag definition.
   *
   * Note: We only support flags with the following syntax:
   *
   * --foo (boolean). Equivalent to --foo=true
   * --nofoo (boolean). Equivalent to --foo=false
   * --bar=value
   * --bar="some complicated value"
   */
  process: function() {
    var scriptpath = process.argv[1] || 'script';
    var scriptname = scriptpath.replace(/([^\/]*\/)+/g, '');
    this._scriptname = scriptname;
    // It's sometimes advantageous to have scripts that just work without any
    // arguments. Thus, don't do this:
    // if (process.argv.length <= 2) {
      // return this.displayHelp();
    // }

    // Processed is a copy of all the flags.
    var processed = {};

    // Set defaults set in the init function by the user. Currently, we only use
    // assignment. Thus 
    for (var key in this.flagdefs) {
      processed[key] = this.flagdefs[key][1];
    }

    var unprocessed = [];

    // TODO(kashomon): Remove the single dash (-foo) form of flags.
    var flagregex = /^--/;
    var helpregex = /^--h(elp)?$/;
    var flagKeyValuePattern = /^[a-zA-Z0-9_]+=.*/;
    for (var i = 2; i < process.argv.length; i++) {
      var item = process.argv[i];
      if (helpregex.test(item)) {
        // If at any point we see help flag, we immediately terminate and
        // display the help text.
        return this.displayHelp();
      }

      if (flagregex.test(item)) {
        // The argument is attempting to be a flag. We know this because the
        // value on the command line looks like --foo or Thus, we need to
        // get the flag 'value'. The value will have the form --foo=bar
        var flagname = item.replace(flagregex, '')
        var origFlagName = flagname; // Store this original value

        if (flagKeyValuePattern.test(flagname)) {
          flagname = flagname.split('=')[0];
        }

        // convert under_score_delimited to camelCase
        flagname = flagname.replace(/(_[a-z])/g, function(m) {
          return m.slice(1).toUpperCase();
        });

        // The user-specified value of the flag;
        var value = null;

        // Recall that the flag arr has the format
        //  [type, default value, description]
        var flagarr = this.flagdefs[flagname];
        if (flagarr === undefined) {
          var alternateFlag = flagname.replace(/^no/, '');
          var flagarr = this.flagdefs[alternateFlag];
          if (flagarr && flagarr[0] === 'boolean') {
            value = false;
          } else {
            return this.unknownFlag(item);
          }
        }

        if (flagKeyValuePattern.test(origFlagName)) {
          // This flag has the form --foo=. So, split on = and the second part
          // is the value.
          var splat = origFlagName.split('=', 2);
          value = splat[1];
          value = this._processFlagType(value, flagarr, origFlagName);
        } else if (flagarr[0] === 'boolean' && value === null) {
          value = true;
        }

        if (!this.validateFlag(flagarr, value)) {
          return this.unknownFlag(item);
        }
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

  validateFlag: function(flagarr, argvalue) {
    if (flagarr[0] === 'boolean' && typeof argvalue !== 'boolean') {
      return false;
    }
    return true;
  },

  /** Display the help text. */
  displayHelp: function() {
    var usage = '\n\n:::Usage:::\n' + this._scriptname + ' ' +
        '<optional flags> ' +
        this.args.join(' ');
    var argData = '\n\n' +
        ':::Flags:::\n' +
        '--flag_name: <expected type>, <default value> :: Help Text\n' +
        '--------------------------------------------------------\n';
    for (var flag in this.flagdefs) {
      var farr = this.flagdefs[flag];
      var underScoreFlag = flag.replace(/[A-Z]/g, function(m) {
        return "_" + m.toLowerCase();
      });
      var helpText = farr[2] || '';
      argData += '--' + underScoreFlag + ': <'
          + farr[0] + '>, <' + farr[1] + '> :: ' + helpText + '\n';
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
