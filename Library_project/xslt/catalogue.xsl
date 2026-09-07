<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <!-- Parameters passed dynamically from JavaScript -->
  <xsl:param name="searchQuery" select="''"/>
  <xsl:param name="selectedCategory" select="'All'"/>
  <xsl:param name="selectedStatus" select="'All'"/>
  <xsl:param name="sortBy" select="'title'"/>

  <!-- Constants for case-insensitive search in XSLT 1.0 -->
  <xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'"/>
  <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
  <xsl:variable name="query" select="translate($searchQuery, $uppercase, $lowercase)"/>

  <!-- Root Template -->
  <xsl:template match="/library">
    <div class="catalogue-container">
      <!-- Filtered book nodes -->
      <xsl:variable name="filteredBooks" select="book[
        ($selectedCategory = 'All' or category = $selectedCategory) and
        ($selectedStatus = 'All' or status = $selectedStatus) and
        ($query = '' or 
         contains(translate(title, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), $query) or
         contains(translate(author, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), $query) or
         contains(translate(isbn, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), $query) or
         contains(translate(id, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), $query))
      ]"/>

      <!-- Metadata summary banner rendered by XSLT -->
      <div class="results-header" data-count="{count($filteredBooks)}">
        <div class="results-count-label">
          Showing <span class="highlight-count"><xsl:value-of select="count($filteredBooks)"/></span> 
          of <xsl:value-of select="count(book)"/> books in collection
        </div>
        <div class="active-filter-tags">
          <xsl:if test="$selectedCategory != 'All'">
            <span class="active-tag">Category: <xsl:value-of select="$selectedCategory"/></span>
          </xsl:if>
          <xsl:if test="$selectedStatus != 'All'">
            <span class="active-tag">Status: <xsl:value-of select="$selectedStatus"/></span>
          </xsl:if>
          <xsl:if test="$searchQuery != ''">
            <span class="active-tag">Search: "<xsl:value-of select="$searchQuery"/>"</span>
          </xsl:if>
        </div>
      </div>

      <!-- Book Cards Grid or Empty State -->
      <xsl:choose>
        <xsl:when test="count($filteredBooks) &gt; 0">
          <div class="book-grid">
            <xsl:for-each select="$filteredBooks">
              <!-- Dynamic Multi-field Sorting -->
              <xsl:sort select="title[$sortBy = 'title']" order="ascending" data-type="text"/>
              <xsl:sort select="author[$sortBy = 'author']" order="ascending" data-type="text"/>
              <xsl:sort select="year[$sortBy = 'year']" order="descending" data-type="number"/>
              <xsl:sort select="id[$sortBy = 'id']" order="ascending" data-type="number"/>

              <article class="book-card" data-id="{id}">
                <div class="card-header">
                  <span class="category-pill"><xsl:value-of select="category"/></span>
                  <span class="book-id">#<xsl:value-of select="id"/></span>
                </div>

                <div class="card-body">
                  <h3 class="book-title"><xsl:value-of select="title"/></h3>
                  <p class="book-author">by <xsl:value-of select="author"/></p>

                  <div class="book-meta-row">
                    <span class="meta-item">
                      <span class="meta-label">Year:</span>
                      <xsl:value-of select="year"/>
                    </span>
                    <span class="meta-item">
                      <span class="meta-label">ISBN:</span>
                      <xsl:value-of select="isbn"/>
                    </span>
                  </div>
                </div>

                <div class="card-footer">
                  <!-- Conditional status rendering using xsl:choose -->
                  <xsl:choose>
                    <xsl:when test="status = 'Available'">
                      <div class="status-badge status-available">
                        <span class="status-dot"></span>
                        <span class="status-text">Available</span>
                      </div>
                      <div class="loan-details available-hint">On Shelf</div>
                    </xsl:when>

                    <xsl:when test="status = 'Borrowed'">
                      <div class="status-badge status-borrowed">
                        <span class="status-dot"></span>
                        <span class="status-text">Borrowed</span>
                      </div>
                      <div class="loan-details">
                        <span class="borrower-name"><xsl:value-of select="member"/></span>
                        <span class="due-date">Due: <xsl:value-of select="dueDate"/></span>
                      </div>
                    </xsl:when>

                    <xsl:when test="status = 'Overdue'">
                      <div class="status-badge status-overdue">
                        <span class="status-dot"></span>
                        <span class="status-text">Overdue</span>
                      </div>
                      <div class="loan-details overdue-alert">
                        <span class="borrower-name"><xsl:value-of select="member"/></span>
                        <span class="due-date">Due: <xsl:value-of select="dueDate"/></span>
                      </div>
                    </xsl:when>

                    <xsl:otherwise>
                      <div class="status-badge">
                        <span class="status-text"><xsl:value-of select="status"/></span>
                      </div>
                    </xsl:otherwise>
                  </xsl:choose>
                </div>
              </article>
            </xsl:for-each>
          </div>
        </xsl:when>

        <xsl:otherwise>
          <div class="empty-state">
            <div class="empty-state-icon">&#128269;</div>
            <h4 class="empty-state-title">No books match your criteria</h4>
            <p class="empty-state-desc">Try modifying your search keywords or resetting filters.</p>
            <button type="button" class="btn btn-secondary reset-action-btn" onclick="window.resetFilters &amp;&amp; window.resetFilters()">
              Clear All Filters
            </button>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>
</xsl:stylesheet>
