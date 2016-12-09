goog.provide('gpub.book.latex.pdfx');
goog.provide('gpub.book.latex.PdfxOptions');

/**
 * Package for Pdf/X-1a:2001 compatibility for Latex.
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
   * "PDF version is newer than 1.3"
   * @private {string}
   */
  pdfMinorVersion_: '\\pdfminorversion=3',

  /**
   * Fixes this error:
   * "Compressed object streams used"
   * @private {string}
   */
  compressLevel_: '\\pdfobjcompresslevel=0',

  /**
   * Fixes the error:
   * "OutputIntent for PDF/X missing"
   *
   * typicacally, the colorProfileFilePath should be something like:
   * 'ISOcoated_v2_300_eci.icc'
   * @param {string} colorProfileFilePath file-path to the color profile file.
   * @return {string}
   * @private
   */
  outputIntent_: function(colorProfileFilePath) {
    return '\\immediate\\pdfobj stream attr{/N 4} file{' + colorProfileFilePath + '}\n' +
      '\\pdfcatalog{%\n' +
      '/OutputIntents [ <<\n' +
      '/Type /OutputIntent\n' +
      '/S/GTS_PDFX\n' +
      '/DestOutputProfile \\the\\pdflastobj\\space 0 R\n' +
      '/OutputConditionIdentifier (ISO Coated v2 300 (ECI))\n' +
      '/Info(ISO Coated v2 300 (ECI))\n' +
      '/RegistryName (http://www.color.org/)\n' +
      '>> ]\n' +
      '}\n';
  },

  /**
   * Returns the PDF Info, which contains the title and spec (PDF/X-1a:2001)
   * Fixes:
   *  - "Document title empty/missing",
   *  - "PDF/X version key (GTS_PDFXVersion) missing"
   * @param {string} title of the work
   * @return {string}
   * @private
   */
  pdfInfo_: function(title) {
    return '\\pdfinfo{%\n' +
      '/Title(' + title + ')%\n' +
      '/GTS_PDFXVersion (PDF/X-1:2001)%\n' +
      '/GTS_PDFXConformance (PDF/X-1a:2001)%\n' +
      '}\n';
  },

  /**
   * Returns the relevant page boxes.
   * @param {number} hpt
   * @param {number} wpt
   * @return string
   * @private
   */
  pageBoxes_: function(hpt, wpt) {
    return '\\pdfpageattr{/MediaBox[0 0 ' + wpt + ' ' + hpt + ']\n' +
           '             /BleedBox[0 0 ' + wpt + ' ' + hpt + ']\n' +
           '             /TrimBox[0 0 ' + wpt + ' ' + hpt + ']}\n'
  },

  /**
   * Creates the appropriate header/metadata information for PDF/X-1a:2001
   * comptabible documents.
   *
   * Note: There are still other ways to break PDF/X-1a compatibility! You must
   * not, for example, include hyperlinks.
   * 
   * @param {!gpub.book.latex.PdfxOptions} opts
   * @return {string}
   */
  header: function(opts) {
    if (!opts.title) {
      throw new Error('title is required for PDF/X-1a header.');
    }
    if (!opts.colorProfileFile) {
      throw new Error('Color profile file path not specified:' +
          opts.colorProfileFile);
    }
    var wpt, hpt;
    if (opts.pageSize) {
      if (!gpub.book.PageSize[opts.pageSize]) {
        throw new Error('Page size not a member of gpub.book.PageSize. ' +
            opts.pageSize);
      }
      var pageObj = gpub.book.pageDimensions[opts.pageSize];
      hpt = gpub.util.size.mmToPt(pageObj.heightMm);
      wpt = gpub.util.size.mmToPt(pageObj.widthMm);
    } else if (opts.pageHeightPt && opts.pageWidthPt) {
      hpt = opts.pageHeightPt;
      wpt = opts.pageWidthPt;
    } else {
      throw new Error('Either pageSize must be defined or ' +
          'pageHeightPt and pageWidthPt must be defined. Options were: ' +
          opts);
    }
    return [
      gpub.book.latex.pdfx.pdfMinorVersion_,
      gpub.book.latex.pdfx.compressLevel_,
      gpub.book.latex.pdfx.pageBoxes_(hpt, wpt),
      gpub.book.latex.pdfx.pdfInfo_(opts.title),
      gpub.book.latex.pdfx.outputIntent_(opts.colorProfileFile)
    ].join('\n');
  }
};

/**
 * Options for constructing the PDF/X-1a header for latex. Note that one of
 * pageSize or (pageHeightPt,pageWidthPt) most be defined.
 *
 * title: Title of the work.
 * colorProfileFile: Path to a color profile file. Usually something like
 * 'ISOcoated_v2_300_eci.icc'
 * pageSize: Optional page size enum.
 * pageHeightPt: Optional page height in pt
 * pageWidthPt: Optional page width in pt
 *
 * @typedef {{
 *  title: string,
 *  colorProfileFile: string,
 *  pageSize: (undefined|gpub.book.PageSize),
 *  pageHeightPt: (undefined|number),
 *  pageWidthPt: (undefined|number),
 * }}
 */
gpub.book.latex.PdfxOptions;
