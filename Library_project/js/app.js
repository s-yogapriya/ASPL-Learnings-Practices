/**
 * Central Library - Frontend Application Controller
 * 
 * Architecture:
 * Browser UI (Vanilla JS) ──► Fetch Request ──► Node.js Server (/api/transform)
 *                                                      │
 *                                                      ▼
 *                                            XSLT Engine (xslt-processor)
 *                                                      │
 *                                                      ▼
 *                                           library.xml + selected .xsl
 *                                                      │
 *                                                      ▼
 * Browser UI ◄── Injects Transformed HTML/XML ─────────┘
 * 
 * NOTE: Absolutely NO browser-native XSLTProcessor is used.
 * JavaScript only manages UI events and fetches the server-transformed output.
 */

(() => {
  'use strict';

  // Application State
  const state = {
    currentView: 'catalogue',
    exportXmlString: '',
    isLoading: false,
    activeAbortController: null
  };

  // DOM Element References
  const elements = {
    navButtons: document.querySelectorAll('.nav-btn'),
    catalogueToolbar: document.getElementById('catalogue-toolbar'),
    searchInput: document.getElementById('search-input'),
    btnClearSearch: document.getElementById('btn-clear-search'),
    categoryFilter: document.getElementById('category-filter'),
    statusFilter: document.getElementById('status-filter'),
    sortSelect: document.getElementById('sort-select'),
    btnResetFilters: document.getElementById('btn-reset-filters'),
    outputContainer: document.getElementById('output-container'),
    loadingSpinner: document.getElementById('loading-spinner'),
    toast: document.getElementById('toast-message')
  };

  /**
   * Toast notification helper
   */
  function showToast(message, duration = 2500) {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, duration);
  }

  /**
   * Show/hide loading indicator
   */
  function setLoading(loading) {
    state.isLoading = loading;
    if (elements.loadingSpinner) {
      elements.loadingSpinner.style.display = loading ? 'flex' : 'none';
    }
  }

  /**
   * Request XSLT transformation from Node.js server
   * Sends user filter parameters and receives server-transformed HTML or XML.
   */
  async function fetchTransformation() {
    // Abort previous in-flight request if user is typing rapidly
    if (state.activeAbortController) {
      state.activeAbortController.abort();
    }
    state.activeAbortController = new AbortController();

    const view = state.currentView;
    const searchQuery = elements.searchInput ? elements.searchInput.value.trim() : '';
    const selectedCategory = elements.categoryFilter ? elements.categoryFilter.value : 'All';
    const selectedStatus = elements.statusFilter ? elements.statusFilter.value : 'All';
    const sortBy = elements.sortSelect ? elements.sortSelect.value : 'title';

    // Build URL query parameters
    const params = new URLSearchParams({
      view,
      searchQuery,
      selectedCategory,
      selectedStatus,
      sortBy
    });

    try {
      setLoading(true);

      const response = await fetch(`/api/transform?${params.toString()}`, {
        signal: state.activeAbortController.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'XSLT transformation failed on server.');
      }

      // Render transformed output according to format
      if (data.format === 'xml') {
        renderXmlExportView(data.content);
      } else {
        renderHtmlView(data.content);
      }

    } catch (error) {
      if (error.name === 'AbortError') return; // User initiated a newer request

      console.error('Transformation fetch error:', error);
      elements.outputContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon" style="color: #dc2626;">&#9888;</div>
          <h4 class="empty-state-title">Transformation Request Failed</h4>
          <p class="empty-state-desc">${error.message}</p>
          <button type="button" class="btn btn-secondary reset-action-btn" onclick="window.retryTransform && window.retryTransform()">
            Retry Transformation
          </button>
        </div>
      `;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Render HTML view transformed by Node.js
   */
  function renderHtmlView(htmlContent) {
    elements.outputContainer.innerHTML = htmlContent;
  }

  /**
   * Render XML Export view with schema comparison and code panel
   */
  function renderXmlExportView(rawXml) {
    state.exportXmlString = formatXmlString(rawXml);

    elements.outputContainer.innerHTML = `
      <div class="xml-export-view">
        <!-- Practical Schema Transformation Demonstration Card -->
        <section class="xml-schema-comparison">
          <h2 class="comparison-title">XML &rarr; XML Transformation Demonstration</h2>
          <p class="comparison-desc">
            XSLT executed by the Node.js server transforms the internal <code>&lt;book&gt;</code> structure 
            into an external partner <code>&lt;libraryBook&gt;</code> schema:
          </p>

          <div class="comparison-grid">
            <div class="comparison-pane">
              <span class="pane-label">Internal Schema (xml/library.xml)</span>
              <pre><code>&lt;book&gt;
  &lt;id&gt;101&lt;/id&gt;
  &lt;title&gt;Clean Code&lt;/title&gt;
  &lt;author&gt;Robert C. Martin&lt;/author&gt;
  &lt;status&gt;Available&lt;/status&gt;
&lt;/book&gt;</code></pre>
            </div>

            <div class="pane-arrow" title="Transformed via xslt/external-library.xsl">&rarr;</div>

            <div class="comparison-pane">
              <span class="pane-label">External Partner Schema (Generated)</span>
              <pre><code>&lt;libraryBook&gt;
  &lt;bookId&gt;101&lt;/bookId&gt;
  &lt;bookTitle&gt;Clean Code&lt;/bookTitle&gt;
  &lt;bookAuthor&gt;Robert C. Martin&lt;/bookAuthor&gt;
  &lt;availability&gt;Available&lt;/availability&gt;
&lt;/libraryBook&gt;</code></pre>
            </div>
          </div>
        </section>

        <!-- Full Generated Output Code Panel -->
        <section class="export-code-panel">
          <div class="panel-header">
            <div class="panel-header-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>Generated External XML (Transformed via <code>xslt/external-library.xsl</code>)</span>
            </div>
            <div class="panel-actions">
              <button type="button" class="btn btn-secondary" id="btn-copy-xml">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                Copy XML
              </button>
              <button type="button" class="btn btn-primary" id="btn-download-xml">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download XML
              </button>
            </div>
          </div>

          <pre class="xml-code-pre"><code id="xml-display-content"></code></pre>
        </section>
      </div>
    `;

    const codeElement = document.getElementById('xml-display-content');
    if (codeElement) {
      codeElement.textContent = state.exportXmlString;
    }

    // Attach Copy and Download handlers
    const btnCopy = document.getElementById('btn-copy-xml');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(state.exportXmlString)
          .then(() => showToast('Transformed XML copied to clipboard!'))
          .catch(() => showToast('Could not copy to clipboard.'));
      });
    }

    const btnDownload = document.getElementById('btn-download-xml');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        const blob = new Blob([state.exportXmlString], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'external-catalogue.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded external-catalogue.xml');
      });
    }
  }

  /**
   * Pretty-format XML output string
   */
  function formatXmlString(xml) {
    let formatted = '';
    let indent = '';
    const pad = '  ';
    const lines = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3').split('\r\n');

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;

      if (line.match(/^<\/\w/)) {
        if (indent.length >= pad.length) {
          indent = indent.substring(pad.length);
        }
      }

      formatted += indent + line + '\r\n';

      if (line.match(/^<\w[^>]*[^\/]>$/) && !line.startsWith('<?xml')) {
        indent += pad;
      }
    }
    return formatted.trim();
  }

  /**
   * Reset all filter controls
   */
  function resetAllFilters() {
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.btnClearSearch) elements.btnClearSearch.style.display = 'none';
    if (elements.categoryFilter) elements.categoryFilter.value = 'All';
    if (elements.statusFilter) elements.statusFilter.value = 'All';
    if (elements.sortSelect) elements.sortSelect.value = 'title';
    if (state.currentView === 'catalogue') {
      fetchTransformation();
    }
  }

  /**
   * Switch active view and request corresponding XSLT transformation
   */
  function switchView(viewName) {
    state.currentView = viewName;

    // Toggle filter toolbar (only visible on main Catalogue view)
    if (elements.catalogueToolbar) {
      elements.catalogueToolbar.style.display = viewName === 'catalogue' ? 'block' : 'none';
    }

    elements.navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    fetchTransformation();
  }

  /**
   * Setup UI Event Listeners
   */
  function setupEventListeners() {
    // Navigation view buttons
    elements.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        if (!view || view === state.currentView) return;
        switchView(view);
      });
    });

    // Live search input with 150ms debounce
    let searchDebounce = null;
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', () => {
        const val = elements.searchInput.value;
        if (elements.btnClearSearch) {
          elements.btnClearSearch.style.display = val.length > 0 ? 'block' : 'none';
        }

        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          if (state.currentView === 'catalogue') {
            fetchTransformation();
          }
        }, 150);
      });
    }

    // Clear search button
    if (elements.btnClearSearch) {
      elements.btnClearSearch.addEventListener('click', () => {
        elements.searchInput.value = '';
        elements.btnClearSearch.style.display = 'none';
        if (state.currentView === 'catalogue') {
          fetchTransformation();
        }
        elements.searchInput.focus();
      });
    }

    // Dropdown filters
    if (elements.categoryFilter) {
      elements.categoryFilter.addEventListener('change', () => {
        if (state.currentView === 'catalogue') fetchTransformation();
      });
    }

    if (elements.statusFilter) {
      elements.statusFilter.addEventListener('change', () => {
        if (state.currentView === 'catalogue') fetchTransformation();
      });
    }

    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', () => {
        if (state.currentView === 'catalogue') fetchTransformation();
      });
    }

    // Reset filters button
    if (elements.btnResetFilters) {
      elements.btnResetFilters.addEventListener('click', resetAllFilters);
    }

    // Global helpers
    window.resetFilters = resetAllFilters;
    window.retryTransform = fetchTransformation;
  }

  /**
   * Initialize application
   */
  function initialize() {
    setupEventListeners();
    // Perform initial transformation for Catalogue view
    fetchTransformation();
  }

  // Kick off on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
