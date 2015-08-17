# Notes to self

## Things to Improve

This is an unordered collection of things to work on since I had a hard time
keeping them in my head.

* __Validation__: To publish, PDF/X-1a:2001 or PDF/X-3:2002 is often
  required. Can we ensure that is the case?
  http://stackoverflow.com/questions/569129/how-can-i-test-a-pdf-document-if-it-is-pdf-a-compliant
  There's also a LaTeX package called pdfx. It has some problems, but might be
  able to adapt it. Might be able to hack it manually,

http://tex.stackexchange.com/questions/242303/pdf-x-1a-on-tex-live-2014-for-publishing-with-pod-lightining-source

* __Book Interface__: The interface for book should probably be changed from
  returning string to returning a more complex data type. Right now we can
  probably just get away with a string return, but it won't work for
  externalized diagrams like PDFs, SVGs, PNGs, etc.

  For example, we'll want something like this:

```javascript
{
  contents: <string>,
  name: <string>,
  diagrams: [
    {
      diagramString: <string>,
      name: <string>
    }
  ]
}
```

- __Contextual Diagram Placement__: Right now, there is no logic around the way
  diagrams are placed within a page. However, being smarter about diagram
  placement means having higher diagram density and lower printing costs.
    - Sort of Done.

- __Better Cropping__: Only for game commentary. It would sometimes be nice to
  crop a diagram as tightly as possible (crop based only on the variation, not
  on the existing stones).
    - Sort of Done.
