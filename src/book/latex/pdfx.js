/**
 * Package for Pdf/X-1a:2001 compatibility.
 *
 * This is a package to add support for the above mentioned compatibility, which
 * is required by some professional printers.
 *
 * Requirements (from http://www.prepressure.com/pdf/basics/pdfx-1a):
 *
 * Requirements that we care about:
 * - PDF/X-1a files are regular PDF 1.3 or PDF 1.4
 * - All color data must be grayscale, CMYK or named spot colors. The file should not contain any RGB, LAB,… data.
 *
 * Requirements should be taken care of
 * - All fonts must be embedded in the file. -- Handled by LaTeX by default
 * - OPI is not allowed in PDF/X-1a files.
 *
 * Should be irrelevant:
 * - If there are annotations (sticky notes) in the PDF, they should be located outside the bleed area.
 * - The file should not contain forms or Javascript code.
 * - Compliant files cannot contain music, movies or non-printable annotations.
 * - Only a limited number of compression algorithms are supported.
 * - Encryption cannot be used.
 * - Transfer curves cannot be used.
 */
gpub.book.latex.pdfx = {

};
