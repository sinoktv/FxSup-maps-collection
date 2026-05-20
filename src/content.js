// +----------------------------------------------------------------------
// | FxSup maps collection[地图信息收集]
// +----------------------------------------------------------------------
// | Copyright (c) 2021-2022 https://github.com/sinoktv/FxSup-maps-collection All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: FxSup <vod08@qq.com>
// +----------------------------------------------------------------------

import { COMMANDS, STORAGE_KEYS } from '../constants/index.js';
import { dataCollectionService } from '../services/DataCollectionService.js';
import { exportService } from '../services/ExportService.js';
import { uiManager } from '../services/UIManager.js';

/**
 * Content script for displaying and managing collected map data
 */

// Initialize i18n messages
const i18n = {
  ContentTableId: chrome.i18n.getMessage('ContentTableId'),
  ContentTableName: chrome.i18n.getMessage('ContentTableName'),
  ContentTableName2: chrome.i18n.getMessage('ContentTableName2'),
  ContentTablePhone: chrome.i18n.getMessage('ContentTablePhone'),
  ContentTableWeb: chrome.i18n.getMessage('ContentTableWeb'),
  ContentTableRegion: chrome.i18n.getMessage('ContentTableRegion'),
  ContentTableAddress: chrome.i18n.getMessage('ContentTableAddress'),
  ContentTableType: chrome.i18n.getMessage('ContentTableType'),
  ContentTextRefresh: chrome.i18n.getMessage('ContentTextRefresh'),
  ContentTextExport: chrome.i18n.getMessage('ContentTextExport'),
  ContentTextClean: chrome.i18n.getMessage('ContentTextClean'),
  ContentTextClose: chrome.i18n.getMessage('ContentTextClose'),
  ContentTableNodata: chrome.i18n.getMessage('ContentTableNodata'),
  ContentSaveAsFile: chrome.i18n.getMessage('ContentSaveAsFile')
};

// Set i18n for UI manager
uiManager.setI18n(i18n);

/**
 * Show the floating table UI and load data
 */
async function showTable() {
  const isCreated = uiManager.show();
  
  if (!isCreated) {
    // Table was closed
    return false;
  }
  
  // Load and display data
  await loadDataAndRender();
  return true;
}

/**
 * Load data from storage and render to table
 */
async function loadDataAndRender() {
  const items = await chrome.storage.local.get({ [STORAGE_KEYS.CUM_LIST]: [] });
  const dataList = items[STORAGE_KEYS.CUM_LIST] || [];
  uiManager.renderTable(dataList);
}

/**
 * Export data to CSV file
 */
async function exportToCSV() {
  const items = await chrome.storage.local.get({ [STORAGE_KEYS.CUM_LIST]: [] });
  const dataList = items[STORAGE_KEYS.CUM_LIST] || [];
  exportService.exportToCSV(dataList, i18n);
}

/**
 * Clear all collected data
 */
async function clearData() {
  await chrome.runtime.sendMessage({ cmd: COMMANDS.CLEAN_DB });
  setTimeout(() => loadDataAndRender(), 500);
}

/**
 * Bind event handlers to UI buttons
 */
function bindEvents() {
  // Refresh button
  document.getElementById('fxsup_acRun')?.addEventListener('click', () => {
    loadDataAndRender();
  });

  // Export button
  document.getElementById('fxsup_acExport')?.addEventListener('click', () => {
    exportToCSV();
  });

  // Clean button
  document.getElementById('fxsup_acClean')?.addEventListener('click', () => {
    clearData();
  });

  // Close button
  document.getElementById('fxsup_acClose')?.addEventListener('click', () => {
    uiManager.hide();
  });
}

/**
 * Handle messages from popup or background script
 * @param {Object} request - Message object
 * @param {Object} sender - Message sender
 * @param {Function} sendResponse - Response callback
 */
function handleMessage(request, sender, sendResponse) {
  switch (request.cmd) {
    case COMMANDS.TEST:
      // Test command - no action needed
      break;
      
    case COMMANDS.RELOAD_TABLE:
      showTable().then(() => {
        // Table shown and data loaded
      });
      break;
      
    case COMMANDS.SAVE_TABLE:
      exportToCSV();
      break;
  }
  
  sendResponse('Message received');
}

// Listen for messages from extension
chrome.runtime.onMessage.addListener(handleMessage);

// Observe for dynamic UI binding after DOM is ready
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      const container = document.getElementById('fxsup_div_p');
      if (container) {
        bindEvents();
        observer.disconnect();
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
