/**
 * Data collection service for Google and Baidu Maps
 */

import { STORAGE_KEYS, DEFAULTS } from '../constants/index.js';
import { extractItemValue, hashCode } from '../utils/helpers.js';

/**
 * Service for managing collected map data
 */
export class DataCollectionService {
  constructor() {
    this.cumList = [];
  }

  /**
   * Initialize by reading from storage
   */
  async init() {
    return new Promise((resolve) => {
      chrome.storage.local.get({ [STORAGE_KEYS.CUM_LIST]: DEFAULTS.EMPTY_ARRAY }, (items) => {
        if (items && items[STORAGE_KEYS.CUM_LIST]) {
          this.cumList = items[STORAGE_KEYS.CUM_LIST];
        }
        resolve();
      });
    });
  }

  /**
   * Add Google Map item to collection
   * @param {Object} itemJson - Raw item data from Google Maps API
   */
  addGoogleMapItem(itemJson) {
    const hashId = this._generateGoogleMapHashId(itemJson);
    
    // Check for duplicates
    const isDuplicate = this.cumList.some(item => item.id === hashId);
    if (isDuplicate) return;

    const item = {
      id: hashId,
      name: extractItemValue(itemJson[11], 1),
      cnname: extractItemValue(itemJson[14], 1),
      dq: extractItemValue(itemJson[30], 1),
      address: extractItemValue(itemJson[18], 1),
      addressItem: extractItemValue(itemJson[4], 1),
      band: extractItemValue(itemJson[13], 1),
      web: extractItemValue(itemJson[7], 1),
      phone: extractItemValue(itemJson[178], 1)
    };

    this.cumList.push(item);
    this._saveToStorage();
  }

  /**
   * Add Baidu Map item to collection
   * @param {Object} itemJson - Raw item data from Baidu Maps API
   */
  addBaiduMapItem(itemJson) {
    const hashId = this._generateBaiduMapHashId(itemJson);
    
    // Check for duplicates
    const isDuplicate = this.cumList.some(item => item.id === hashId);
    if (isDuplicate) return;

    const phone = extractItemValue(itemJson.tel, 1) || extractItemValue(itemJson.phone, 1);
    const showtag = extractItemValue(itemJson.tag, 1) || extractItemValue(itemJson.showtag, 1);

    const item = {
      id: hashId,
      name: extractItemValue(itemJson.name, 1),
      cnname: '',
      dq: extractItemValue(itemJson.area_name, 1),
      address: extractItemValue(itemJson.addr, 1),
      addressItem: extractItemValue(itemJson.address_norm, 1),
      band: showtag,
      web: extractItemValue(itemJson.web, 1),
      phone: phone
    };

    this.cumList.push(item);
    this._saveToStorage();
  }

  /**
   * Clear all collected data
   */
  clear() {
    this.cumList = [];
    this._saveToStorage();
  }

  /**
   * Get current collection
   * @returns {Array} Current collection array
   */
  getList() {
    return this.cumList;
  }

  /**
   * Get collection count
   * @returns {number} Number of items in collection
   */
  getCount() {
    return this.cumList.length;
  }

  /**
   * Save current list to storage
   * @private
   */
  _saveToStorage() {
    chrome.storage.local.set({ [STORAGE_KEYS.CUM_LIST]: this.cumList }, () => {
      console.log('Data saved to storage, count:', this.cumList.length);
    });
  }

  /**
   * Generate hash ID for Google Map item
   * @private
   */
  _generateGoogleMapHashId(itemJson) {
    const hashStr = extractItemValue(itemJson[11], 1) + 
                    extractItemValue(itemJson[14], 1) + 
                    extractItemValue(itemJson[18], 1);
    return hashCode(hashStr);
  }

  /**
   * Generate hash ID for Baidu Map item
   * @private
   */
  _generateBaiduMapHashId(itemJson) {
    const hashStr = extractItemValue(itemJson.geo, 1) + 
                    extractItemValue(itemJson.addr, 1);
    return hashCode(hashStr);
  }
}

// Export singleton instance
export const dataCollectionService = new DataCollectionService();
