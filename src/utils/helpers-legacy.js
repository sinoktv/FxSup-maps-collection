/**
 * String utility functions - Legacy version for non-module scripts
 */

/**
 * Format a string with placeholders {0}, {1}, etc.
 * @param {string} str - The string to format
 * @returns {string} Formatted string
 */
String.format = function() {
  if (arguments.length === 0) return null;
  
  let str = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    const re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    str = str.replace(re, arguments[i]);
  }
  return str;
};

/**
 * Calculate hash code of a string
 * @returns {number} Hash code
 */
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  
  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
