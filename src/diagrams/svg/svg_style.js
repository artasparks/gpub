/**
 * Return the style modifications
 * @param {!glift.flattener.Flattened} flat
 * @return {string}
 */
gpub.diagrams.svg.style = function(flat) {
  var out =
    // Black Stone
    '.bs { fill: black; }\n' +

    // White Stone
    '.ws { stroke: black; }\n' +

    // Center line
    '.cl {\n' +
    '  stroke: black;\n' +
    '  stroke-width: 1;\n' +
    '}\n' +

    // Edge line
    '.el {\n' +
    '  stroke: black;\n' +
    '  stroke-width: 2.5;\n' +
    '}\n' +

    // corner line
    '.nl {\n' +
    '  stroke-linecap: round;\n' +
    '  stroke: black;\n' +
    '  stroke-width: 2.5;\n' +
    '}\n' +

    // Starpoint
    '.sp { fill: black; }\n';

  if (Object.keys(flat.labels()).length > 0) {
    out +=
      // Black Label
      '.bl {\n' +
      '  fill: black;\n' +
      '  stroke: black;\n' +
      '  text-anchor: middle;\n' +
      '  font-family: sans-serif;\n' +
      '  font-style: normal;\n' +
      ' }\n' +

      // White Label
      '.wl {\n' +
      '  fill: white;\n' +
      '  stroke: white;\n' +
      '  text-anchor: middle;\n' +
      '  font-family: sans-serif;\n' +
      '  font-style: normal;\n' +
      '}\n';
  }

  if (Object.keys(flat.labels()).length > 0) {
    out +=
      // Black mark
      '.bm {\n' +
      '  fill: none;\n' +
      '  stroke-width: 2;\n' +
      '  stroke: black;\n' +
      '}\n' +

      // White mark
      '.wm {\n' +
      '  fill: none;\n' +
      '  stroke-width: 2;\n' +
      '  stroke: white;\n' +
      '}\n';
  }

  return out;
};
