# Notes to self

## Things to Improve

This is an unordered collection of things to work on since I had a hard time
keeping them in my head.

- __Frontmatter__: The LaTeX book generator needs to support frontmatter before
  we can consider LaTeXU generation complete. Frontmatter support is required
  before publishing

- __Validation__: To publish in placese, PDF/X-1a:2001 or PDF/X-3:2002 is often
  required. Can we ensure that is the case?
  http://stackoverflow.com/questions/569129/how-can-i-test-a-pdf-document-if-it-is-pdf-a-compliant

- __Book Interface__: The interface for book should probably be changed from
  returning string to returning a more complex data type. Right now we can
  probably just get away with a string return, but it won't work for
  externalized diagrams like PDFs, SVGs, PNGs, etc.

  For example, we'll want something like

```javascript
{
  book: <string>,
  name: <string>,
  diagrams: [
    {
      diagramString: <string>,
      name: <string>
    }
  ]
}
```

- __Problem Support__: There's no support for problem books right now. I don't
  think it should be terribly hard, but I'll need to think pretty deeply about
  how to place problems within a page. There are three things to consider
  - How is the diagram cropped?
  - Is there text (commentary) shown?
  - How should problem-answers be handled?

- __Contextual Diagram Placement__: Right now, there is no logic around the way
  diagrams are placed within a page. However, being smarter about diagram
  placement means having 

- __Smart Go Support__: SmartGo support would be awesome. It only targets iOS
  and OSX, but it's definitely on my radar.

- __Better Cropping__: Only for game commentary. It would sometimes be nice to
  crop a diagr
