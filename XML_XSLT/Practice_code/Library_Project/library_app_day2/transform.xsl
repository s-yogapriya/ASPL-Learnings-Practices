<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:partner="http://example.com">

    <xsl:output
        method="html"
        encoding="UTF-8"/>


    <!-- ================================================= -->
    <!-- ROOT TEMPLATE -->
    <!-- ================================================= -->

    <xsl:template match="/">

        <xsl:call-template name="tableView"/>

        <xsl:call-template name="cardView"/>

        <xsl:call-template name="categoryView"/>

    </xsl:template>


    <!-- ================================================= -->
    <!-- TABLE VIEW -->
    <!-- ================================================= -->

    <xsl:template name="tableView">

        <xsl:for-each select="library/book">

            <!-- Sort by category -->

            <xsl:sort
                select="category"
                order="ascending"/>

            <!-- If same category, sort by title -->

            <xsl:sort
                select="title"
                order="ascending"/>


            <tr>

                <!-- ID -->

                <td>
                    <xsl:value-of select="@id"/>
                </td>


                <!-- TITLE -->

                <td>

                    <xsl:value-of select="title"/>


                    <!-- Quick Read -->

                    <xsl:if test="number(pages) &lt; 300">

                        <span class="badge">
                            Quick Read
                        </span>

                    </xsl:if>

                </td>


                <!-- AUTHOR -->

                <td>
                    <xsl:value-of select="author"/>
                </td>


                <!-- CATEGORY -->

                <td>
                    <xsl:value-of select="category"/>
                </td>


                <!-- PAGES -->

                <td>

                    <xsl:value-of select="pages"/>

                    pages

                </td>


                <!-- PRICE -->

                <td>

                    $

                    <xsl:value-of select="price"/>

                    (

                    <xsl:value-of
                        select="price/@currency"/>

                    )

                </td>


                <!-- STATUS -->

                <td>

                    <xsl:choose>

                        <xsl:when
                            test="@status = 'available'">

                            <span class="status-available">
                                Available
                            </span>

                        </xsl:when>


                        <xsl:when
                            test="@status = 'borrowed'">

                            <span class="status-borrowed">
                                Checked Out
                            </span>

                        </xsl:when>


                        <xsl:otherwise>

                            <span class="status-unknown">
                                Unknown
                            </span>

                        </xsl:otherwise>

                    </xsl:choose>

                </td>


                <!-- PARTNER CODE -->

                <td>

                    <xsl:value-of
                        select="partner:storeCode"/>

                </td>

            </tr>

        </xsl:for-each>

    </xsl:template>


    <!-- ================================================= -->
    <!-- CARD VIEW -->
    <!-- ================================================= -->

    <xsl:template name="cardView">

        <xsl:for-each select="library/book">

            <div
                class="book-card"
                data-id="{@id}"
                data-title="{title}"
                data-author="{author}"
                data-category="{category}"
                data-status="{@status}"
                data-pages="{pages}"
                data-price="{price}">

                <div class="card-header">

                    <div>

                        <div class="book-id">

                            <xsl:value-of
                                select="@id"/>

                        </div>


                        <div class="book-title">

                            <xsl:value-of
                                select="title"/>


                            <xsl:if
                                test="number(pages) &lt; 300">

                                <span class="badge">
                                    Quick Read
                                </span>

                            </xsl:if>

                        </div>


                        <div class="book-author">

                            by

                            <xsl:value-of
                                select="author"/>

                        </div>

                    </div>


                    <div>

                        <xsl:choose>

                            <xsl:when
                                test="@status = 'available'">

                                <span class="status-available">
                                    Available
                                </span>

                            </xsl:when>


                            <xsl:when
                                test="@status = 'borrowed'">

                                <span class="status-borrowed">
                                    Checked Out
                                </span>

                            </xsl:when>


                            <xsl:otherwise>

                                <span class="status-unknown">
                                    Unknown
                                </span>

                            </xsl:otherwise>

                        </xsl:choose>

                    </div>

                </div>


                <div class="card-info">

                    <div class="info-row">

                        <span class="info-label">
                            Category
                        </span>

                        <span class="info-value">

                            <xsl:value-of
                                select="category"/>

                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-label">
                            Pages
                        </span>

                        <span class="info-value">

                            <xsl:value-of
                                select="pages"/>

                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-label">
                            Price
                        </span>

                        <span class="info-value">

                            $

                            <xsl:value-of
                                select="price"/>

                            <xsl:text> </xsl:text>

                            <xsl:value-of
                                select="price/@currency"/>

                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-label">
                            Partner Code
                        </span>

                        <span class="info-value">

                            <xsl:value-of
                                select="partner:storeCode"/>

                        </span>

                    </div>

                </div>

            </div>

        </xsl:for-each>

    </xsl:template>


    <!-- ================================================= -->
    <!-- CATEGORY VIEW -->
    <!-- ================================================= -->

    <xsl:template name="categoryView">

        <!--

        We select each unique category.

        generate-id() is used so that
        only the first book of each category
        creates the category heading.

        -->

        <xsl:for-each
            select="library/book[
                generate-id()
                =
                generate-id(
                    key('categoryKey', category)[1]
                )
            ]">

            <xsl:sort
                select="category"
                order="ascending"/>


            <div class="category-card">

                <div class="category-title">

                    📁

                    <xsl:value-of
                        select="category"/>

                </div>


                <!-- Books belonging to this category -->

                <xsl:for-each
                    select="key(
                        'categoryKey',
                        current()/category
                    )">

                    <div class="category-book">

                        <strong>

                            <xsl:value-of
                                select="title"/>

                        </strong>


                        <span>

                            <xsl:value-of
                                select="author"/>

                            •

                            <xsl:value-of
                                select="pages"/>

                            pages

                        </span>

                    </div>

                </xsl:for-each>

            </div>

        </xsl:for-each>

    </xsl:template>


    <!-- ================================================= -->
    <!-- CATEGORY KEY -->
    <!-- ================================================= -->

    <xsl:key
        name="categoryKey"
        match="book"
        use="category"/>


</xsl:stylesheet>
