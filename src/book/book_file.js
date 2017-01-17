goog.provide('gpub.book.File');

/**
 * Represents a file that should be written to disk. Some books (like ebooks)
 * are aggregates of multiple files.
 *
 * For mimetype, the most common will be
 *
 * - application/xhtml+xml
 * - image/svg+xml
 * - text/css
 *
 * @typedef {{
 *  contents: string,
 *  path: (string|undefined),
 *  mimetype: (string|undefined),
 *  id: (string|undefined),
 * }}
 */
gpub.book.File;
