/**
 * UI Manager for the floating table component
 */

import { formatString } from '../utils/helpers.js';

/**
 * Manages the floating UI table for displaying collected data
 */
export class UIManager {
  constructor() {
    this.containerId = 'fxsup_div_p';
    this.tableId = 'fxsup_table_p';
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.i18n = {};
  }

  /**
   * Set internationalization messages
   * @param {Object} i18n - I18n messages object
   */
  setI18n(i18n) {
    this.i18n = i18n;
  }

  /**
   * Create and show the floating table UI
   * @returns {boolean} True if created, false if already exists or closed
   */
  show() {
    // Check if already exists
    if (document.getElementById(this.containerId)) {
      this.hide();
      return false;
    }

    const buttonHtml = this._generateButtonHtml();
    const showTextHtml = '<div id="showtext"></div>';
    const tableHtml = this._generateTableHtml();

    // Create container
    const container = document.createElement('div');
    container.id = this.containerId;
    container.innerHTML = buttonHtml + showTextHtml + tableHtml;
    document.body.appendChild(container);

    // Bind event listeners
    this._bindEvents();

    return true;
  }

  /**
   * Hide/remove the floating table UI
   */
  hide() {
    const element = document.getElementById(this.containerId);
    if (element) {
      element.remove();
    }
  }

  /**
   * Render data to the table
   * @param {Array} dataList - Array of data items to display
   */
  renderTable(dataList) {
    // Remove existing table
    const existingTable = document.getElementById(this.tableId);
    if (existingTable) {
      existingTable.remove();
    }

    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Add new table
    const tableWrapper = document.createElement('div');
    tableWrapper.innerHTML = this._generateTableHtml();
    container.appendChild(tableWrapper);

    const table = document.getElementById(this.tableId);
    if (!table) return;

    if (!dataList || dataList.length === 0) {
      const noDataMsg = this.i18n.ContentTableNodata || 'No data';
      table.innerHTML = `<tr><td>${noDataMsg}</td></tr>`;
      return;
    }

    // Reverse list to show newest first
    const reversedList = [...dataList].reverse();
    
    reversedList.forEach((item, index) => {
      const row = this._generateTableRow(
        index + 1,
        item.name,
        item.cnname,
        item.phone,
        item.web,
        item.dq,
        item.address,
        item.band
      );
      table.insertAdjacentHTML('beforeend', row);
    });
  }

  /**
   * Generate button HTML
   * @private
   */
  _generateButtonHtml() {
    const imgRotate = this._getBase64Image('ROTATE');
    const imgSave = this._getBase64Image('SAVE');
    const imgDelete = this._getBase64Image('DELETE');
    const imgExit = this._getBase64Image('EXIT');

    return `
      <span>FxSup maps collection</span>
      <img id="fxsup_acRun" src="${imgRotate}" alt="${this.i18n.ContentTextRefresh || 'Refresh'}" title="${this.i18n.ContentTextRefresh || 'Refresh'}"/>
      <img id="fxsup_acExport" src="${imgSave}" alt="${this.i18n.ContentTextExport || 'Export'}" title="${this.i18n.ContentTextExport || 'Export'}"/>
      <img id="fxsup_acClean" src="${imgDelete}" alt="${this.i18n.ContentTextClean || 'Clean'}" title="${this.i18n.ContentTextClean || 'Clean'}"/>
      <img id="fxsup_acClose" src="${imgExit}" alt="${this.i18n.ContentTextClose || 'Hide'}" title="${this.i18n.ContentTextClose || 'Hide'}"/>
    `;
  }

  /**
   * Generate table HTML
   * @private
   */
  _generateTableHtml() {
    return `<table width="100%" border="1" id="${this.tableId}"></table>`;
  }

  /**
   * Generate table row HTML
   * @private
   */
  _generateTableRow(id, name, cnname, phone, web, dq, address, band) {
    const template = '<tr><td>' +
      `${this.i18n.ContentTableName || 'Name'}:{1}&nbsp;` +
      `${this.i18n.ContentTableName2 || 'Nickname'}:{2}&nbsp;` +
      `${this.i18n.ContentTablePhone || 'Phone'}:{3}&nbsp;` +
      `${this.i18n.ContentTableWeb || 'Web'}:{4}&nbsp;` +
      `${this.i18n.ContentTableRegion || 'Region'}:{5}&nbsp;` +
      `${this.i18n.ContentTableAddress || 'Address'}:{6}&nbsp;` +
      `${this.i18n.ContentTableType || 'Type'}:{7}&nbsp;` +
      '</td></tr>';

    return formatString(template, id, name, cnname, phone, web, dq, address, band);
  }

  /**
   * Get base64 encoded image by name
   * @private
   */
  _getBase64Image(name) {
    // These would be imported from an images module or defined as constants
    const images = {
      DELETE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIlJREFUeNqUUgEKwCAITOlf9bOxn9nL2kHgRC3ooIHtzvPcSETKDSqO9I7nM+cYIyVZQtXblyiVuXaM081UkLXWdmyAbIb1WhkooyHbQq3go2IHdrUdL10DpwtJ8yQCm2FZRQ3vEut4TsM7doyUZ4iAxpr83yHd+mmt6HRgo90yodu/lcslPgEGAFEkaGTDeaUwAAAAAElFTkSuQmCC',
      ROTATE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNqUUtsRwCAIU6+DMZqjMVqptREBPZsPD7nE8DAzc5pBJDlKC5QwK5ojwfPyR11prpNXAwewUT2C1hJPDrh7tom7Q60Jp2e8JihB9zB41DTs6ozHSqhetQGHkn4iEIxKWmC+wmha70GokJmRFN2u351afOdkOG42HU9JsvAFJGPWkv333uMWYAC/a0ukHYbbfAAAAABJRU5ErkJggg==',
      SAVE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAN1JREFUeNpi/P//PwMpgAWIRUVFGT5+ZODn//LlC1ZFPDw8Hz9+5Ofnf/36NSPQBkZGRoabNxnU1RctWoRVQ1xc3Lt374SEhICKWaBiampAQllZGZdLvA0NIQwmZNHfOABQ6vjkyVg04AO+viRqQA4lOBAWFiZFQ3n5lNpa7KrKy+FMWLBCoi8lBbuGOXPAasGKUTScPImu9OtXEPn+PUNwMEQDAzRpgFmYRhuJiQERVAEDA2ENl8EAWQML/jD58OEDllASERF58/YtVg3AJARlwRX8BwMiYw2oEiDAAJABhC5AmuH+AAAAAElFTkSuQmCC',
      EXIT: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT9JREFUeNpi/P//PyMjIwM2AJTCFGSBs379+vXp0yc4V0REhAGPMfn5DNLSav+RAEQKDpSUJkIYTBBtoqIMrq631NSMsRpqbDzr3r3XKE7684dBVZXhy5dzzs7Oe/fuRVbt7Lzo3LlHDAysQAaQywjxdEMDSI6dnaGyEupIoCCQYWEx5+TJe0AZsN6fQMyEbNjPn+iOCQzUhKiDafjJgizNy4uuobzcGkhWVKwHSnZ0BCFCCegkILK0ZIAHDnIolZfvZmAohbBRbHjzBnvQd3S4vHv3HRpK8+bNg3gX6IHMTIaiIgaICBDAGUAwa1YShMGopqYmIyMjJLTP0JDh92+Qw4AiQAmg4JMnT+Aabt68CbUBwgJGGQ/PORUVFDmcSQMCxMWVsrMZ0FIEJkCR5uERIaiBES0NQyIYj4sAAgwAaKnyDBDAG3AAAAAASUVORK5CYII='
    };
    return images[name] || '';
  }

  /**
   * Bind drag and drop events
   * @private
   */
  _bindEvents() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Mouse down - start dragging
    container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragOffsetX = e.clientX - container.offsetLeft;
      this.dragOffsetY = e.clientY - container.offsetTop;
      container.setCapture && container.setCapture();
      e.preventDefault();
    });

    // Mouse move - dragging
    document.addEventListener('mousemove', this._handleMouseMove.bind(this));

    // Mouse up - stop dragging
    document.addEventListener('mouseup', (e) => {
      this.isDragging = false;
      container.releaseCapture && container.releaseCapture();
      e.cancelBubble = true;
    });
  }

  /**
   * Handle mouse move during drag
   * @private
   */
  _handleMouseMove(e) {
    if (!this.isDragging) return;

    const container = document.getElementById(this.containerId);
    if (!container) return;

    const newX = e.clientX - this.dragOffsetX;
    const newY = e.clientY - this.dragOffsetY;

    container.style.left = newX + 'px';
    container.style.top = newY + 'px';

    e.preventDefault();
  }
}

// Export singleton instance
export const uiManager = new UIManager();
