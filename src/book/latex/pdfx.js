/**
 * Package for Pdf/X-1a:2001 compatibility.
 *
 * This is a package to add support for the above mentioned compatibility, which
 * is required by some professional printers.
 *
 * Requirements (from http://www.prepressure.com/pdf/basics/pdfx-1a):
 *
 * http://tex.stackexchange.com/questions/242303/pdf-x-1a-on-tex-live-2014-for-publishing-with-pod-lightining-source
 *
 * Requirements that we care about:
 * - PDF/X-1a files are regular PDF 1.3
 * - All color data must be grayscale, CMYK or named spot colors. The file
 *   should not contain any RGB, LAB, data.
 * - Can't use hyperref annotations.
 * - Have to change the stream compression to 0.
 *
 * Requirements should be taken care of
 * - All fonts must be embedded in the file. -- Handled by LaTeX by default
 * - OPI is not allowed in PDF/X-1a files.
 *
 * Should be irrelevant:
 * - If there are annotations (sticky notes) in the PDF, they should be located
 *   outside the bleed area.
 * - The file should not contain forms or Javascript code.
 * - Compliant files cannot contain music, movies or non-printable annotations.
 * - Only a limited number of compression algorithms are supported.
 * - Encryption cannot be used.
 * - Transfer curves cannot be used.
 *
 * For details, see https://github.com/Kashomon/gpub/issues/23
 */
gpub.book.latex.pdfx = {
  /**
   * Fixes this error:
   * "Compressed object streams used"
   */
  compressLevel: '\\pdfobjcompresslevel=0',

  /**
   * Fixes this error:
   * "PDF version is newer than 1.3"
   */
  pdfMinorVersion: '\\pdfminorversion=3',

  /**
   * Fixes the error:
   * "OutputIntent for PDF/X missing"
   *
   * typicacally, the colorProfileFilePath should be something like:
   * 'ISOcoated_v2_300_eci.icc'
   */
  outputIntent: function(colorProfileFilePath) {
    colorProfileFilePath = colorProfileFilePath || 'ISOcoated_v2_300_eci.icc';
    return [
      '\\immediate\\pdfobj stream attr{/N 4} file{' + colorProfileFilePath + '}',
      '\\pdfcatalog{%',
      '/OutputIntents [ <<',
      '/Type /OutputIntent',
      '/S/GTS_PDFX',
      '/DestOutputProfile \\the\\pdflastobj\\space 0 R',
      '/OutputConditionIdentifier (ISO Coated v2 300 (ECI))',
      '/Info(ISO Coated v2 300 (ECI))',
      '/RegistryName (http://www.color.org/)',
      '>> ]',
      '}'
    ];
  },

  /**
   * Returns the PDF Info, which contains the title and spec (PDF/X-1a:2101)
   * Fixes:
   *  - "Document title empty/missing",
   *  - "PDF/X version key (GTS_PDFXVersion) missing"
   */
  pdfInfo: function(title) {
    return [
      '\\pdfinfo{%',
      '/Title(' + title + ')%',
      '/GTS_PDFXVersion (PDF/X-1:2001)%',
      '/GTS_PDFXConformance (PDF/X-1a:2001)%',
      '}'
    ];
  },

  /**
   * Returns the relevant page boxes.
   */
  pageBoxes: function(pageSize) {
    var pageObj  = gpub.book.page.size[pageSize];
    var hpt = gpub.util.size.mmToPt(pageObj.heightMm);
    var wpt = gpub.util.size.mmToPt(pageObj.widthMm);
    return [
      '\\pdfpageattr{/MediaBox[0 0 ' + wpt + ' ' + hpt + ']',
      '              /BleedBox[0 0 ' + wpt + ' ' + hpt + ']',
      '              /TrimBox[0 0 ' + wpt + ' ' + hpt + ']}'
    ];
  },

  header: function(title, colorProfile, pageSize) {
    var pdfx = gpub.book.latex.pdfx;
    if (!colorProfile) {
      throw new Error('Color profile file path not specified:' + colorProfile);
    }
    if (!pageSize || !gpub.book.page.size[pageSize]) {
      throw new Error('Pagesize not defined or invalid:' + pageSize);
    }
    return [
      pdfx.pdfMinorVersion,
      pdfx.compressLevel
    ]
      .concat(pdfx.pageBoxes(pageSize))
      .concat(pdfx.pdfInfo(title))
      .concat(pdfx.outputIntent(colorProfile))
      .join('\n');
  }
};
