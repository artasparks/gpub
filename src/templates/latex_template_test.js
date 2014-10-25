gpub.templates.latexTemplateTest = function() {
  module('gpub.templates.latexTemplateTest');
  var validTemplate = [
    '\\documentclass[letterpaper,12pt]{memoir}',
    '{{ extraPackages }}',
    '{{ extraDefs }}',
    '{{ mainBookTitleDef }}',
    '\\begin{document}',
    '{{ content }}',
    '\\end{document}'].join('\n');

  test('Test validate template', function() {
    var t = gpub.templates.parseLatexTemplate(validTemplate);
    ok(t, 'should be truthy');
  });

  test('Test compiled vars', function() {
    var str = gpub.templates.parseLatexTemplate(validTemplate)
        .setExtraPackages('zed')
        .setExtraDefs('zod')
        .setTitleDef('titlez')
        .setContent('contentz')
        .compile();
    ok(str, 'should be truthy');
    ok(str.indexOf('zed' > 1), 'packages');
    ok(str.indexOf('zod' > 1), 'defs');
    ok(str.indexOf('titlez' > 1), 'title');
    ok(str.indexOf('contentz' > 1), 'content');
  });
};
