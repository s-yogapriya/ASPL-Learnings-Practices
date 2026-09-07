 /**
 * Central Library - Node.js Server Layer
 * 
 * Architecture:
 * Browser ──► JavaScript (Fetch API) ──► Node.js Server
 *                                             │
 *                                             ▼
 *                                      XSLT Processor (xslt-processor)
 *                                             │
 *                                             ▼
 *                                  library.xml + selected .xsl
 *                                             │
 *                                             ▼
 * Browser ◄── Transformed HTML/XML ───────────┘
 * 
 * Note: No browser-native XSLTProcessor is used.
 * All XSLT transformations are executed on the Node.js server.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { Xslt, XmlParser } = require('xslt-processor');            

const app = express();
const PORT = process.env.PORT || 3000;

// Path configuration (relative to project root for portability)
const XML_FILE_PATH = path.join(__dirname, 'xml', 'library.xml');
const XSLT_DIR_PATH = path.join(__dirname, 'xslt');

// Stylesheet mappings
const STYLESHEET_MAP = {
  catalogue: 'catalogue.xsl',
  overdue: 'overdue.xsl',
  categories: 'category-summary.xsl',
  export: 'external-library.xsl'
};

// Serve static frontend assets (HTML, CSS, JS)
app.use(express.static(__dirname));

/**
 * Health & Status Check Endpoint
 * Confirms server readiness, Node.js version, and XML source availability.
 */
app.get('/api/health', (req, res) => {
  try {
    const xmlExists = fs.existsSync(XML_FILE_PATH);
    const xmlContent = xmlExists ? fs.readFileSync(XML_FILE_PATH, 'utf8') : '';
    const bookCount = (xmlContent.match(/<book>/g) || []).length;

    res.json({
      status: 'ok',
      service: 'Library Node.js XSLT Transformation Service',
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      xmlSource: {
        path: 'xml/library.xml',
        available: xmlExists,
        bookRecords: bookCount
      },
      availableViews: Object.keys(STYLESHEET_MAP)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * Server-Side XSLT Transformation Endpoint
 * 
 * Query Parameters:
 * - view: 'catalogue' | 'overdue' | 'categories' | 'export'
 * - searchQuery: text to search in title, author, isbn
 * - selectedCategory: filter by genre or 'All'
 * - selectedStatus: filter by 'Available', 'Borrowed', 'Overdue' or 'All'
 * - sortBy: 'title' | 'author' | 'year' | 'id'
 */
app.get('/api/transform', async (req, res) => {
  const startTime = Date.now();
  const view = (req.query.view || 'catalogue').toLowerCase();

  // Validate view
  const xslFileName = STYLESHEET_MAP[view];
  if (!xslFileName) {
    return res.status(400).json({
      success: false,
      error: `Invalid view "${view}". Available views: ${Object.keys(STYLESHEET_MAP).join(', ')}`
    });
  }

  const xslFilePath = path.join(XSLT_DIR_PATH, xslFileName);

  try {
    // 1. Load canonical XML and requested XSLT from disk
    const xmlContent = await fs.promises.readFile(XML_FILE_PATH, 'utf8');
    const xslContent = await fs.promises.readFile(xslFilePath, 'utf8');

    // 2. Parse into XML DOMs using xslt-processor parser
    const xmlParser = new XmlParser();
    const xmlDom = xmlParser.xmlParse(xmlContent);
    const xslDom = xmlParser.xmlParse(xslContent);

    // 3. Prepare parameters for XSLTProcessor
    const searchQuery = (req.query.searchQuery || '').trim();
    const selectedCategory = req.query.selectedCategory || 'All';
    const selectedStatus = req.query.selectedStatus || 'All';
    const sortBy = req.query.sortBy || 'title';

    const parameters = [
      { name: 'searchQuery', value: searchQuery },
      { name: 'selectedCategory', value: selectedCategory },
      { name: 'selectedStatus', value: selectedStatus },
      { name: 'sortBy', value: sortBy }
    ];

    // 4. Execute XSLT transformation in Node.js
    const xslt = new Xslt({ parameters });
    const transformedOutput = await xslt.xsltProcess(xmlDom, xslDom);
    const executionMs = Date.now() - startTime;

    // 5. Return result
    const isXmlOutput = view === 'export';
    res.json({
      success: true,
      view,
      format: isXmlOutput ? 'xml' : 'html',
      executionMs,
      appliedParameters: {
        searchQuery,
        selectedCategory,
        selectedStatus,
        sortBy
      },
      content: transformedOutput
    });

  } catch (error) {
    console.error(`Transformation error for view "${view}":`, error);
    res.status(500).json({
      success: false,
      view,
      error: error.message || 'XSLT transformation failed'
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`📚 Athenaeum Library Catalogue is running!`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log(`⚙️  Node.js XSLT Engine Active (No browser XSLTProcessor)`);
  console.log('====================================================');
});
