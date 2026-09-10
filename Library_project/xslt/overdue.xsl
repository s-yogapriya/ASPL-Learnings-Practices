<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <!-- Root Template -->
  <xsl:template match="/library">
    <div class="report-view overdue-report">
      <!-- XPath Filtering: Select only books where status is 'Overdue' -->
      <xsl:variable name="overdueBooks" select="book[status = 'Overdue']"/>

      <!-- Summary Banner -->
      <div class="report-banner overdue-banner">
        <div class="banner-icon">&#9888;</div>
        <div class="banner-content">
          <h2 class="report-title">Overdue Loans Report</h2>
          <p class="report-subtitle">
            XPath Filter: <code class="xpath-snippet">/library/book[status = 'Overdue']</code> &#8226; 
            Sorted by earliest due date
          </p>
        </div>
        <div class="banner-stat">
          <span class="stat-number"><xsl:value-of select="count($overdueBooks)"/></span>
          <span class="stat-label">Action Required</span>
        </div>
      </div>

      <!-- Results Table / Cards -->
      <xsl:choose>
        <xsl:when test="count($overdueBooks) &gt; 0">
          <div class="table-responsive">
            <table class="report-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book Title &amp; Author</th>
                  <th>Category</th>
                  <th>Borrower</th>
                  <th>Due Date</th>
                  <th>Circulation Status</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="$overdueBooks">
                  <!-- Sort by due date ascending (oldest overdue first) -->
                  <xsl:sort select="dueDate" order="ascending"/>

                  <tr class="overdue-row">
                    <td class="cell-id">#<xsl:value-of select="id"/></td>
                    <td class="cell-book">
                      <div class="table-book-title"><xsl:value-of select="title"/></div>
                      <div class="table-book-author"><xsl:value-of select="author"/></div>
                      <div class="table-book-isbn">ISBN: <xsl:value-of select="isbn"/></div>
                    </td>
                    <td class="cell-category">
                      <span class="category-pill small"><xsl:value-of select="category"/></span>
                    </td>
                    <td class="cell-borrower">
                      <span class="borrower-badge">
                        <span class="member-icon">&#128100;</span>
                        <xsl:value-of select="member"/>
                      </span>
                    </td>
                    <td class="cell-date">
                      <span class="date-overdue-tag">
                        <xsl:value-of select="dueDate"/>
                      </span>
                    </td>
                    <td class="cell-action">
                      <span class="action-pill overdue-pill">
                        Notice Pending
                      </span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </xsl:when>

        <xsl:otherwise>
          <div class="empty-state all-clear">
            <div class="empty-state-icon">&#10004;</div>
            <h4 class="empty-state-title">No Overdue Books</h4>
            <p class="empty-state-desc">All borrowed library assets are currently within their active lending periods.</p>
          </div>
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>
</xsl:stylesheet>
