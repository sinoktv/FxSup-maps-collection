/**
 * FxSup Maps Collection - Constants
 * Copyright (c) 2021-2022 https://github.com/sinoktv/FxSup-maps-collection
 * Licensed under Apache License 2.0
 */

// Supported map domains
export const MAP_DOMAINS = {
  GOOGLE: {
    patterns: [
      'https://www.google.com/maps/*',
      'https://www.google.com.hk/maps/*'
    ],
    searchPatterns: [
      'https://www.google.com/search*',
      'https://www.google.com.hk/search*'
    ],
    previewPattern: 'preview/place'
  },
  BAIDU: {
    patterns: [
      'https://map.baidu.com/*'
    ],
    requestFlag: 'reqflag=pcmap&biz=1&from=webmap&da_par=direct&pcevaname=pc4.1&qt=spot*',
    uidPattern: '/?uid='
  }
};

// Storage keys
export const STORAGE_KEYS = {
  SERVER_ID: 'server_id',
  SERVER_START_SNF: 'server_start_snf',
  CUM_LIST: 'CumList'
};

// Extension commands
export const COMMANDS = {
  CLEAN_DB: 'cleanDb',
  RELOAD_TABLE: 'reLoadTable',
  SAVE_TABLE: 'saveLoadTable',
  TEST: 'test'
};

// Table columns
export const TABLE_COLUMNS = {
  ID: 'id',
  NAME: 'name',
  CN_NAME: 'cnname',
  PHONE: 'phone',
  WEB: 'web',
  REGION: 'dq',
  ADDRESS: 'address',
  TYPE: 'band'
};

// Default values
export const DEFAULTS = {
  SERVER_START_SNF: '0',
  EMPTY_ARRAY: []
};
