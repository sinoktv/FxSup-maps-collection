// +----------------------------------------------------------------------
// | FxSup maps collection[地图信息收集]
// +----------------------------------------------------------------------
// | Copyright (c) 2021-2022 https://github.com/sinoktv/FxSup-maps-collection All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: FxSup <vod08@qq.com>
// +----------------------------------------------------------------------

import { MAP_DOMAINS, STORAGE_KEYS, COMMANDS, DEFAULTS } from '../constants/index.js';
import { dataCollectionService } from '../services/DataCollectionService.js';

/**
 * Background script for handling web requests and managing extension state
 */

// Global state
let serverStartSNF = false;

/**
 * Initialize the background script
 */
async function init() {
  // Load saved state from storage
  const items = await chrome.storage.local.get({
    [STORAGE_KEYS.SERVER_ID]: '',
    [STORAGE_KEYS.SERVER_START_SNF]: DEFAULTS.SERVER_START_SNF
  });
  
  serverStartSNF = items[STORAGE_KEYS.SERVER_START_SNF] === '1';
  
  // Initialize data collection service
  await dataCollectionService.init();
}

/**
 * Handle completed web requests
 * @param {Object} details - Request details
 */
function handleWebRequestCompleted(details) {
  if (!serverStartSNF) return;
  
  const url = details.url;
  const checkUrl = 'reget=1';
  
  if (url.indexOf(checkUrl) === -1) {
    const newUrl = url + '&' + checkUrl;
    
    if (url.indexOf('google.com') > 0) {
      sendRequest(newUrl, 'googlemaps');
    } else if (url.indexOf('baidu.com') > 0) {
      sendRequest(newUrl, 'baidumaps');
    }
  }
}

/**
 * Send HTTP request to fetch map data
 * @param {string} url - Request URL
 * @param {string} type - Map type ('googlemaps' or 'baidumaps')
 */
function sendRequest(url, type) {
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200) {
      let responseText = req.responseText;
      responseText = responseText.replace(/\/\*\"\"\*\//g, '');
      
      if (type === 'googlemaps') {
        parseGoogleMapResponse(url, responseText);
      } else if (type === 'baidumaps') {
        parseBaiduMapResponse(url, responseText);
      }
    }
  };
  
  req.send();
}

/**
 * Parse Google Maps API response
 * @param {string} url - Request URL
 * @param {string} responseText - Response text
 */
function parseGoogleMapResponse(url, responseText) {
  if (url.indexOf(MAP_DOMAINS.GOOGLE.previewPattern) > 0) {
    // Preview place response
    const jsonData = JSON.parse(
      responseText.substring(responseText.indexOf('['), responseText.length)
    );
    
    if (jsonData.length >= 6) {
      const itemJson = jsonData[6];
      dataCollectionService.addGoogleMapItem(itemJson);
      updateBadgeText(dataCollectionService.getCount());
    }
  } else {
    // Search results response
    const outerJson = JSON.parse(responseText);
    
    if (outerJson.d) {
      const innerText = outerJson.d;
      const jsonData = JSON.parse(
        innerText.substring(innerText.indexOf('['), innerText.length)
      );
      
      if (jsonData.length >= 1 && jsonData[0].length >= 2) {
        const itemsJson = jsonData[0][1];
        
        for (let i = 0; i < itemsJson.length; i++) {
          if (itemsJson[i].length >= 15) {
            const itemJson = itemsJson[i][14];
            dataCollectionService.addGoogleMapItem(itemJson);
          }
        }
        
        updateBadgeText(dataCollectionService.getCount());
      }
    }
  }
}

/**
 * Parse Baidu Maps API response
 * @param {string} url - Request URL
 * @param {string} responseText - Response text
 */
function parseBaiduMapResponse(url, responseText) {
  const jsonData = JSON.parse(responseText);
  
  if (!jsonData.content) return;
  
  if (url.indexOf(MAP_DOMAINS.BAIDU.uidPattern) > 0) {
    // Single place detail
    dataCollectionService.addBaiduMapItem(jsonData.content);
    updateBadgeText(dataCollectionService.getCount());
  } else {
    // Search results
    const itemsJson = jsonData.content;
    
    for (let i = 0; i < itemsJson.length; i++) {
      dataCollectionService.addBaiduMapItem(itemsJson[i]);
    }
    
    updateBadgeText(dataCollectionService.getCount());
  }
}

/**
 * Update extension badge text with count
 * @param {number} count - Item count
 */
function updateBadgeText(count) {
  chrome.browserAction.setBadgeText({ text: count.toString() });
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 200, 200, 255] });
}

/**
 * Set extension configuration
 * @param {Object} config - Configuration object
 */
function setConfig(config) {
  console.log('Setting config:', config);
  serverStartSNF = config.server_start_snf === '1';
  
  chrome.storage.local.set({
    [STORAGE_KEYS.SERVER_ID]: config.server_id,
    [STORAGE_KEYS.SERVER_START_SNF]: config.server_start_snf
  });
}

/**
 * Clear all collected data
 */
function clearCollectedData() {
  dataCollectionService.clear();
  updateBadgeText(0);
}

/**
 * Handle messages from other parts of the extension
 * @param {Object} message - Message object
 * @param {Object} sender - Message sender
 * @param {Function} sendResponse - Response callback
 */
function handleMessage(message, sender, sendResponse) {
  if (message.cmd === COMMANDS.CLEAN_DB) {
    clearCollectedData();
  }
  
  sendResponse('Message received');
}

// Setup event listeners
chrome.webRequest.onCompleted.addListener(
  handleWebRequestCompleted,
  {
    urls: [
      ...MAP_DOMAINS.GOOGLE.searchPatterns,
      'https://www.google.com/maps/preview/place*',
      'https://www.google.com.hk/maps/preview/place*',
      'https://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=spot*',
      'https://map.baidu.com/?uid=*'
    ],
    types: ['xmlhttprequest']
  }
);

chrome.runtime.onMessage.addListener(handleMessage);

// Expose functions to popup
window.setConfig = setConfig;
window.clearCumList = clearCollectedData;
window.showText2PopTitle = updateBadgeText;

// Initialize
init();
