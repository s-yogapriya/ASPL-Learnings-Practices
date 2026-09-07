<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <!-- Root Template -->
  <xsl:template match="/library">
    <div class="report-view category-summary-report">
      <!-- Report Header Banner -->
      <div class="report-banner summary-banner">
        <div class="banner-icon">&#128202;</div>
        <div class="banner-content">
          <h2 class="report-title">Category Distribution &amp; Inventory Summary</h2>
          <p class="report-subtitle">
            Demonstrating XSLT Grouping (<code class="xpath-snippet">book[not(category = preceding-sibling::book/category)]</code>)
          </p>
        </div>
        <div class="banner-stat">
          <span class="stat-number">
            <xsl:value-of select="count(book[not(category = preceding-sibling::book/category)])"/>
          </span>
          <span class="stat-label">Categories</span>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="category-grid">
        <!-- Loop over unique categories using standard distinct XPath grouping -->
        <xsl:for-each select="book[not(category = preceding-sibling::book/category)]">
          <xsl:sort select="category" order="ascending"/>

          <xsl:variable name="currentCategory" select="category"/>
          <xsl:variable name="categoryBooks" select="/library/book[category = $currentCategory]"/>
          <xsl:variable name="totalCount" select="count($categoryBooks)"/>
          <xsl:variable name="availableCount" select="count($categoryBooks[status = 'Available'])"/>
          <xsl:variable name="borrowedCount" select="count($categoryBooks[status = 'Borrowed'])"/>
          <xsl:variable name="overdueCount" select="count($categoryBooks[status = 'Overdue'])"/>

          <section class="category-card">
            <div class="category-card-header">
              <div class="category-title-group">
                <span class="category-icon-bullet">&#128218;</span>
                <h3 class="category-name"><xsl:value-of select="$currentCategory"/></h3>
              </div>
              <span class="category-total-badge"><xsl:value-of select="$totalCount"/> Titles</span>
            </div>

            <!-- Metric Distribution Badges -->
            <div class="category-metrics">
              <div class="metric-pill metric-available">
                <span class="metric-val"><xsl:value-of select="$availableCount"/></span>
                <span class="metric-lbl">Available</span>
              </div>
              <div class="metric-pill metric-borrowed">
                <span class="metric-val"><xsl:value-of select="$borrowedCount"/></span>
                <span class="metric-lbl">Borrowed</span>
              </div>
              <div class="metric-pill metric-overdue">
                <span class="metric-val"><xsl:value-of select="$overdueCount"/></span>
                <span class="metric-lbl">Overdue</span>
              </div>
            </div>

            <!-- Mini Titles List in this category -->
            <div class="category-books-list">
              <h4 class="sublist-heading">Titles in Collection:</h4>
              <ul class="book-pill-list">
                <xsl:for-each select="$categoryBooks">
                  <xsl:sort select="title" order="ascending"/>
                  <li class="book-pill-item">
                    <span class="book-mini-title"><xsl:value-of select="title"/></span>
                    <span class="book-mini-year">(<xsl:value-of select="year"/>)</span>
                    <xsl:choose>
                      <xsl:when test="status = 'Available'">
                        <span class="mini-status dot-available" title="Available">&#9679;</span>
                      </xsl:when>
                      <xsl:when test="status = 'Borrowed'">
                        <span class="mini-status dot-borrowed" title="Borrowed">&#9679;</span>
                      </xsl:when>
                      <xsl:when test="status = 'Overdue'">
                        <span class="mini-status dot-overdue" title="Overdue">&#9679;</span>
                      </xsl:when>
                    </xsl:choose>
                  </li>
                </xsl:for-each>
              </ul>
            </div>
          </section>
        </xsl:for-each>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>
