// +----------------------------------------------------------------------
// | FxSup maps collection[地图信息收集]
// +----------------------------------------------------------------------
// | Copyright (c) 2021-2022 https://github.com/sinoktv/FxSup-maps-collection All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: FxSup <vod08@qq.com>
// +----------------------------------------------------------------------

import { STORAGE_KEYS, COMMANDS } from '../constants/index.js';
import { MAP_DOMAINS } from '../constants/index.js';

/**
 * Popup script for extension UI control
 */

$(document).ready(async function() {
  // Load configuration state
  const configItems = await chrome.storage.local.get({
    [STORAGE_KEYS.SERVER_ID]: '',
    [STORAGE_KEYS.SERVER_START_SNF]: '0'
  });
  
  console.log('Config:', configItems[STORAGE_KEYS.SERVER_ID], configItems[STORAGE_KEYS.SERVER_START_SNF]);

  // Load collected data count and update background page badge
  const dataItems = await chrome.storage.local.get({ [STORAGE_KEYS.CUM_LIST]: '' });
  
  if (dataItems[STORAGE_KEYS.CUM_LIST]) {
    const bg = chrome.extension.getBackgroundPage();
    if (bg && bg.showText2PopTitle) {
      bg.showText2PopTitle(dataItems[STORAGE_KEYS.CUM_LIST].length.toString());
    }
  }

  // Check if start flag is enabled
  const bg = chrome.extension.getBackgroundPage();
  if (bg && bg.G_server_start_snf === '1') {
    $('#start_snf').prop('checked', true);
  }

  // Check current tab URL to enable/disable buttons
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentUrl = tabs.length > 0 ? tabs[0].url : '';
  
  const isValidMapUrl = checkValidMapUrl(currentUrl);
  
  if (!isValidMapUrl) {
    const notUrlMsg = chrome.i18n.getMessage('PopupTitleNotUrl') || 'Only runs on maps';
    
    $('#cleanTable').attr('disabled', 'true').attr('title', notUrlMsg);
    $('#showTable').attr('disabled', 'true').attr('title', notUrlMsg);
    $('#saveTable').attr('disabled', 'true').attr('title', notUrlMsg);
  }

  // Show table button click handler
  $('#showTable').click(function() {
    sendMessageToContentScript({ cmd: COMMANDS.RELOAD_TABLE, value: '' }, function(response) {
      console.log('Response from content:', response);
    });
  });

  // Toggle start/stop collection checkbox
  $('#start_snf').change(function() {
    const callServerId = ''; // $('#call_server_id').val();
    const bg = chrome.extension.getBackgroundPage();
    
    const config = {
      server_id: callServerId,
      server_start_snf: $('#start_snf').prop('checked') ? '1' : '0'
    };
    
    if (bg && bg.setConfig) {
      bg.setConfig(config);
    }
  });

  // Clean table button click handler
  $('#cleanTable').click(function() {
    const bg = chrome.extension.getBackgroundPage();
    if (bg && bg.clearCumList) {
      bg.clearCumList();
    }
  });

  // Save/export table button click handler
  $('#saveTable').click(function() {
    sendMessageToContentScript({ cmd: COMMANDS.SAVE_TABLE, value: '' }, function(response) {
      console.log('Response from content:', response);
    });
  });
});

/**
 * Check if URL is a valid map URL
 * @param {string} url - URL to check
 * @returns {boolean} True if valid map URL
 */
function checkValidMapUrl(url) {
  if (!url) return false;
  
  const isGoogleMaps = url.indexOf('https://www.google.com') === 0 && url.indexOf('/maps/') > 0;
  const isBaiduMaps = url.indexOf('https://map.baidu.com/') === 0;
  
  return isGoogleMaps || isBaiduMaps;
}

/**
 * Send message to content script in the active tab
 * @param {Object} message - Message to send
 * @param {Function} callback - Response callback
 */
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
        if (callback) callback(response);
      });
    }
  });
}
