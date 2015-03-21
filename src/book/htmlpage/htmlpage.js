/**
 * An html 'book' creator/processor. Implements gpub.book.processor.
 */
gpub.book.htmlpage = {}

gpub.book.htmlpage._template = [
'<!DOCTYPE html>',
'<html>',
'  <head>',
'    <title> {{title}} </title>',
'  <style>',
'    * {',
'      margin: 0;',
'      padding: 0;',
'    }',
'    #glift_display1 {',
'      height:500px;',
'      width:100%;',
'      position:relative;',
'    }',
'  </style>',
'  <body>',
'    <div id="wrap" style="position:relative;">',
'      <div id="glift_display1"></div>',
'    </div>',
'    <script type="text/javascript">',
'      var gliftMgr = glift.create({{content}});',
'    </script>',
// TODO(kashomon): Need to put Glift in here somewhere. Maybe even just
// embedded.
'  </body>',
'<html>'
].join('\n');
