<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <html>
            <head>
                <title>Projects</title>
            </head>

            <body>
                <h1>My Projects</h1>

                <xsl:for-each select="projects/project">
                    <h2>
                        <xsl:value-of select="name"/>
                    </h2>

                    <p>
                        Language:
                        <xsl:value-of select="language"/>
                    </p>
                </xsl:for-each>

            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
