<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- XML to XML Transformation Output -->
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>

  <!-- Root Template -->
  <xsl:template match="/library">
    <externalCatalogue source="Athenaeum Central Library" formatVersion="2.0" timestamp="2026-09-07">
      <xsl:for-each select="book">
        <xsl:sort select="id" data-type="number" order="ascending"/>
        
        <!-- Transforming internal <book> structure into external <libraryBook> structure -->
        <libraryBook>
          <bookId><xsl:value-of select="id"/></bookId>
          <bookTitle><xsl:value-of select="title"/></bookTitle>
          <bookAuthor><xsl:value-of select="author"/></bookAuthor>
          <availability><xsl:value-of select="status"/></availability>
          <category><xsl:value-of select="category"/></category>
          <publicationYear><xsl:value-of select="year"/></publicationYear>
          <isbnCode><xsl:value-of select="isbn"/></isbnCode>
          <xsl:if test="status != 'Available'">
            <loanDetails>
              <borrowerName><xsl:value-of select="member"/></borrowerName>
              <expectedReturnDate><xsl:value-of select="dueDate"/></expectedReturnDate>
            </loanDetails>
          </xsl:if>
        </libraryBook>
      </xsl:for-each>
    </externalCatalogue>
  </xsl:template>
</xsl:stylesheet>
