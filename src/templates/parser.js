/**
 * A simplistic template parser.
 */
gpub.templates.parse = function(template) {
  var sections = [];
  var paramMap = {}; // key to position
  var states = {
    DEFAULT: 'DEFAULT',
    IN_PARAM: 'IN_PARAM'
  };
  var curstate = states.DEFAULT;
  var buffer = [];
  var prev = null;
  var position = 0;
  for (var i = 0; i < template.length; i++) {
    var c = template.charAt(i);
    switch(curstate) {
      case 'DEFAULT':
        if (c === '{') {
          if (prev === '{') {
            sections.push(buffer.join(''));
            curstate = states.IN_PARAM;
            position++;
            buffer = [];
          }
          // Else move on
        } else {
          if (prev === '{') buffer.push(prev);
          buffer.push(c);
        }
        break;
      case 'IN_PARAM':
        if (c === '}') {
          if (prev === '}') {
            sections.push(null);
            var param = buffer.join('').replace(/^\s*|\s*$/g, '');
            paramMap[param] = position;
            position++;
            curstate = states.DEFAULT;
            buffer = [];
          }
          // else ignore and move on
        } else {
          buffer.push(c)
        }
        break
      default: 
        throw new Error('Unknown state: ' + curstate);
    }
    prev = c;
  }
  sections.push(buffer.join(''));
  return new gpub.templates._Template(sections, paramMap);
};
