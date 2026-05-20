# FxSup Maps Collection - Refactored Version

This is a refactored version of the FxSup Maps Collection Chrome extension that collects business information from Google Maps and Baidu Maps and exports it as CSV.

## Project Structure

```
/workspace/
├── manifest.json              # Extension manifest (Manifest V2)
├── _locales/                  # Internationalization files
│   ├── en/
│   │   └── messages.json     # English translations
│   └── zh_CN/
│       └── messages.json     # Chinese translations
├── html/                      # Popup HTML pages
│   ├── popup_en.html         # English popup page
│   └── popup_zh_CN.html      # Chinese popup page
├── src/                       # Refactored source code (ES6 modules)
│   ├── constants/
│   │   └── index.js          # Application constants
│   ├── utils/
│   │   ├── helpers.js        # Utility functions (ES6 modules)
│   │   └── helpers-legacy.js # Legacy utilities for non-module scripts
│   ├── services/
│   │   ├── DataCollectionService.js  # Data collection logic
│   │   ├── ExportService.js          # CSV export functionality
│   │   └── UIManager.js              # UI management
│   ├── background.js         # Background script (ES6 module)
│   ├── content.js            # Content script (ES6 module)
│   └── popup.js              # Popup script (ES6 module)
├── scripts/                   # Legacy scripts (kept for compatibility)
│   ├── background.js         # Original background script
│   ├── content.js            # Original content script
│   ├── fun.js                # Original utility functions
│   ├── popup.js              # Original popup script
│   └── zepto.min.js          # Zepto library
├── styles/
│   └── main.css              # Content script styles
└── images/                    # Extension icons and UI images
```

## Key Improvements

### 1. Modular Architecture
- **ES6 Modules**: Code is organized into reusable ES6 modules
- **Separation of Concerns**: Clear separation between constants, utilities, services, and scripts
- **Service Layer**: Dedicated services for data collection, export, and UI management

### 2. Code Quality
- **JSDoc Comments**: Comprehensive documentation for all functions and classes
- **Consistent Naming**: Clear and consistent naming conventions
- **Error Handling**: Improved error handling throughout the codebase
- **Modern JavaScript**: Uses modern ES6+ features (async/await, arrow functions, template literals, etc.)

### 3. Maintainability
- **Constants File**: Centralized configuration and constants
- **Reusable Utilities**: Common functions extracted to utility modules
- **Service Classes**: Encapsulated business logic in service classes

### 4. Internationalization
- **Complete i18n Support**: All user-facing strings are externalized
- **Multiple Languages**: Support for English and Chinese (Simplified)
- **Locale Files**: Properly structured locale files with descriptions

### 5. UI Improvements
- **Modern Popup Design**: Clean and responsive popup interface
- **Better UX**: Improved user experience with clear button states and feedback

## Usage

### Development
1. Load the unpacked extension from Chrome: `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `/workspace` directory

### Building for Production
The extension uses ES6 modules which require Chrome 76+. For broader compatibility, you may want to bundle the modules using a tool like Webpack or Rollup.

## Migration Notes

### For Existing Users
- The original scripts in `/scripts/` are kept for reference
- The new implementation uses the same storage format, so existing data is compatible
- Manifest version remains V2 for compatibility

### Breaking Changes
- The popup HTML path has changed from `popup_en.html` to `html/popup_en.html`
- Background and content scripts now use ES6 module syntax

## API Reference

### Constants (`src/constants/index.js`)
- `MAP_DOMAINS`: Supported map domain patterns
- `STORAGE_KEYS`: Storage key constants
- `COMMANDS`: Inter-script communication commands
- `TABLE_COLUMNS`: Table column definitions

### Services

#### DataCollectionService
Manages the collection of map data:
- `addGoogleMapItem(itemJson)`: Add Google Maps item
- `addBaiduMapItem(itemJson)`: Add Baidu Maps item
- `clear()`: Clear all collected data
- `getList()`: Get current collection
- `getCount()`: Get item count

#### ExportService
Handles CSV export:
- `exportToCSV(dataList, i18n)`: Export data to CSV file

#### UIManager
Manages the floating UI table:
- `show()`: Show the table UI
- `hide()`: Hide the table UI
- `renderTable(dataList)`: Render data to table
- `setI18n(i18n)`: Set internationalization messages

## License

Apache License 2.0 - See LICENSE file for details.

## Author

FxSup <vod08@qq.com>

## Repository

https://github.com/sinoktv/FxSup-maps-collection
