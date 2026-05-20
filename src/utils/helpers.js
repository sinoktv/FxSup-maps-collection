/**
 * String utility functions
 */

/**
 * Format a string with placeholders {0}, {1}, etc.
 * @param {string} str - The string to format
 * @param {...any} args - Arguments to replace placeholders
 * @returns {string} Formatted string
 */
export function formatString(str, ...args) {
  if (arguments.length === 0) return null;
  
  let result = str;
  for (let i = 1; i < arguments.length; i++) {
    const re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    result = result.replace(re, arguments[i]);
  }
  return result;
}

/**
 * Calculate hash code of a string
 * @param {string} str - Input string
 * @returns {number} Hash code
 */
export function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Extract text value from nested object/array structure
 * @param {any} item - The item to extract value from
 * @param {number} mode - 1 for single value, 0 for multiple values joined by comma
 * @returns {string} Extracted text value
 */
export function extractItemValue(item, mode = 1) {
  if (item == null) return '';
  
  if (mode === 1) {
    const type = typeof item;
    if (type === 'object' && Array.isArray(item)) {
      return item.length > 0 ? extractItemValue(item[0], 1) : '';
    } else if (type === 'object') {
      return item.length > 0 ? extractItemValue(item[0], 1) : '';
    } else {
      return item;
    }
  } else {
    const type = typeof item;
    if (type === 'object' && !Array.isArray(item)) {
      let itemText = '';
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          itemText += (itemText.length > 0 ? ',' : '') + extractItemValue(item[key], 1);
        }
      }
      return itemText;
    } else if (type === 'object' && Array.isArray(item)) {
      let itemText = '';
      for (let i = 0; i < item.length; i++) {
        itemText += (itemText.length > 0 ? ',' : '') + extractItemValue(item[i], 1);
      }
      return itemText;
    } else {
      return item;
    }
  }
}

/**
 * Generate timestamp-based filename
 * @param {string} prefix - Filename prefix
 * @returns {string} Generated filename
 */
export function generateFilename(prefix = 'table') {
  const d = new Date();
  let s = prefix + '_';
  s += d.getFullYear();
  s += (d.getMonth() + 1);
  s += d.getDate();
  s += d.getHours();
  s += d.getMinutes();
  s += d.getSeconds();
  return s;
}

/**
 * Escape CSV field according to RFC 4180
 * @param {string} field - Field value
 * @returns {string} Escaped field
 */
export function escapeCSVField(field) {
  let columnItem = field.toString();
  columnItem = columnItem.replace(/"/g, '\"\"'); // Double quotes per RFC 4180
  columnItem = columnItem.replace(/(\r\n\t|\n|\r\t)/gm, ' ').trim(); // Remove problematic newlines
  return '"' + columnItem + '"';
}
