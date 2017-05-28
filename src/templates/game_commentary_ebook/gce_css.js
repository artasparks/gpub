/**
 * Styling for the game commentary ebook.
 * @param {!gpub.opts.TemplateOptions} opts
 * @return {!gpub.book.File}
 */
gpub.templates.GameCommentaryEbook.cssFile = function(opts) {

  var obj = { classes: {} };
  obj.classes.hd = {
    'font-family': 'sans-serif'
  };
  obj.classes['p-break'] = {
    'page-break-after': 'always',
  };
  obj.classes['d-gp'] = {
    'page-break-inside': 'avoid',
    'page-break-before': 'always',
    'background-color': '#DDD',
    'border-radius': '20px',
  };
  if (opts.azw3Format) {
    obj.classes.pidx = {
      'font-size': '1.5em',
      'text-align': 'center',
      // 'padding-bottom': '1em'
      // Hackery for AZW3/KF8
      position: 'absolute',
      left: '0',
      right: '0',
      // float: 'left',
      // left: '50%',
      // Attempts at centering:
      // 'margin-left': 'auto',
      // 'margin-right': 'auto',
      // position: 'relative',
      // left: '-50%',
      // 'font-family': 'sans-serif',
    };
  } else {
    obj.classes.pidx = {
      'font-size': '1.5em',
      'text-align': 'center',
    };
  }
  obj.classes.pspan = {
    'padding-left': '2em',
    'padding-right': '2em',
    'border-bottom': '1px solid black',
  };
  obj.classes['s-img'] = {
    // 'margin-top': '2em',
    // 'background-color': '#DDD',
    // Another attempt to center
    // 'margin-right': 'auto',
    // 'margin-left': 'auto',
  }
  return gpub.book.epub.css(obj);

};
