/**
 * An html 'book' creator/processor. Implements gpub.book.processor.
 */
gpub.book.html = {
  create: function(spec, options) {
  },

  defaultTemplate: function() {
    return gpub.book.htmlBook._template;
  },

  processBookOptions: function() {
  }
};

gpub.book.html._template = [
'<!DOCTYPE html>',
'<html>',
'  <head>',
'    <title> {{book_title}} </title>',
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
'      var gliftMgr = glift.create({{book_definition}});',
'    </script>',
'  </body>',
'<html>',
].join('\n');
