/**
 *
 */
gpub.book.latex.options = function() {
  return {
    diagramType: gpub.diagrams.diagramType.GNOS,
    bookOptions: {
      /**
       * init: Any additional setup that needs to be done in the header. I.e.,
       * for diagram packages.
       */
      init: '',

      title: 'My Book',
      subtitle: null,
      publisher: null,
      authors: [
        'You!'
      ]
    }
  }
}
