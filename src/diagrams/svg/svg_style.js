goog.provide('gpub.diagrams.svg.styleDefaults');

goog.scope(function() {

/** @type {!Object<string, !Object<string, string>>} */
gpub.diagrams.svg.styleDefaults = {};

var sdef = gpub.diagrams.svg.styleDefaults

// Black stones
sdef['.bs'] = {
  fill: 'black',
};

// White stones
sdef['.ws'] = {
  stroke: 'black',
};

// Center Line
sdef['.cl'] = {
  stroke: 'black',
  'stroke-width': '1',
};

// Edge line
sdef['.el'] = {
  stroke: 'black',
  'stroke-width': '2.5',
};

// Corner line
sdef['.nl'] = {
  'stroke-linecap': 'round',
  stroke: 'black',
  'stroke-width': '2.5',
};

sdef['.sp'] = {
  fill: 'black',
};

// Black Label
sdef['.bl'] = {
  fill: 'black',
  stroke: 'black',
  'text-anchor': 'middle',
  'font-family': 'sans-serif',
  'font-style': 'normal',
}

// White Label
sdef['.wl'] = {
  fill: 'white',
  stroke: 'white',
  'text-anchor': 'middle',
  'font-family': 'sans-serif',
  'font-style': 'normal',
};

// Black mark
sdef['.bm'] = {
  fill: 'none',
  'stroke-width': '2',
  stroke: 'black',
};

// White mark
sdef['.wm'] = {
  fill: 'none',
  'stroke-width': '2',
   stroke: 'white',
};

/**
 * Return the style modifications
 * @param {!Object<string, !Object<string, string>>} defs
 * @param {!glift.flattener.Flattened} flat
 * @return {string}
 */
gpub.diagrams.svg.style = function(defs, flat) {
  var out = '';
  for (var clazz in defs) {
    var d = defs[clazz];

    // Only add b/w labels if we actually have labels.
    // if ((clazz == '.bl' || clazz == 'wl') &&
        // Object.keys(flat.labels()).length == 0) {
      // continue;
    // }

    // Only add marks style if we actually have marks
    // if ((clazz == '.bl' || clazz == 'wl') &&
        // Object.keys(flat.marks()).length == 0) {
      // continue;
    // }

    out += clazz + ' {\n';
    for (var key in d) {
      out += '  ' + key + ': ' + d[key] + ';\n';
    }
    out += '}\n\n'
  }
  return out;
};

});
