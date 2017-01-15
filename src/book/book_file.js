goog.provide('gpub.book.File');

/**
 * Represents a file that should be written to disk. Some books (like ebooks)
 * are aggregates of multiple files.
 *
 * @typedef {{
 *  contents: string,
 *  path: (string|undefined),
 *  mimetype: (string|undefined),
 * }}
 */
gpub.book.File;
