/**
 * Export service for CSV files
 */

import { TABLE_COLUMNS } from '../constants/index.js';
import { extractItemValue, escapeCSVField, generateFilename } from '../utils/helpers.js';

/**
 * Service for exporting collected data to CSV format
 */
export class ExportService {
  /**
   * Export data collection to CSV file
   * @param {Array} dataList - Array of collected items
   * @param {Object} i18n - Internationalization messages object
   */
  exportToCSV(dataList, i18n) {
    if (!dataList || dataList.length === 0) {
      alert(i18n.ContentTableNodata || 'No data');
      return false;
    }

    const rows = [];
    
    // Add header row
    const headers = [
      i18n.ContentTableId || 'Id',
      i18n.ContentTableName || 'Name',
      i18n.ContentTableName2 || 'Nickname',
      i18n.ContentTablePhone || 'Phone',
      i18n.ContentTableWeb || 'Web',
      i18n.ContentTableRegion || 'Region',
      i18n.ContentTableAddress || 'Address',
      i18n.ContentTableType || 'Type'
    ];
    rows.push(headers.join(','));

    // Add data rows
    dataList.forEach((item, index) => {
      const columns = [
        index + 1,
        extractItemValue(item.name, 1),
        extractItemValue(item.cnname, 1),
        extractItemValue(item.phone, 1),
        extractItemValue(item.web, 1),
        extractItemValue(item.dq, 1),
        extractItemValue(item.address, 1),
        extractItemValue(item.band, 0)
      ];

      const row = columns.map(field => escapeCSVField(field)).join(',');
      rows.push(row);
    });

    // Create CSV content with BOM for UTF-8
    const csvContent = String.fromCharCode(0xFEFF) + rows.join('\n');
    
    // Trigger download
    this._downloadCSV(csvContent, generateFilename('table'));
    
    return true;
  }

  /**
   * Download CSV content as file
   * @private
   */
  _downloadCSV(content, defaultFileName) {
    const fileName = prompt(
      'Save as CSV File name:',
      defaultFileName
    );
    
    if (fileName === null) return;
    
    const finalFileName = fileName !== '' ? fileName + '.csv' : 'table.csv';
    
    const downloadLink = document.createElement('a');
    downloadLink.download = finalFileName;
    downloadLink.href = window.URL.createObjectURL(
      new Blob([content], { type: 'text/csv' })
    );
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}

// Export singleton instance
export const exportService = new ExportService();
