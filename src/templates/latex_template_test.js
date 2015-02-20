(function() {
  module('gpub.templates.latexTemplateTest');

  var validTemplate = [
    '\\documentclass[letterpaper,12pt]{memoir}',
    '{{ extraPackages }}',
    '----',
    '{{ diagramTypeDefs }}',
    '----',
    '{{ diagramWrapperDefs }}',
    '----',
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
        .setDiagramTypeDefs('zod')
        .setDiagramWrapperDefs('mod')
        .setTitleDef('titlez')
        .setContent('contentz')
        .compile();
    ok(str, 'should be truthy');

    ok(str.indexOf('{memoir}') > -1, 'memoir');
    ok(str.indexOf('zed') > -1, 'packages');
    ok(str.indexOf('zod') > -1, 'defs');
    ok(str.indexOf('mod') > -1, 'wrapper');
    ok(str.indexOf('titlez') > -1, 'title');
    ok(str.indexOf('contentz') > -1, 'content');
  });

  test('Test ensure latexBase compiles', function() {
    var str = gpub.templates.parseLatexTemplate(gpub.templates.latexBase)
        .setExtraPackages('zeded')
        .compile();
    ok(str.indexOf('zeded') > -1);
  });
})();
