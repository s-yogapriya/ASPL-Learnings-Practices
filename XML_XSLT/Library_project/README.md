# 📚  Central Library Catalogue (Node.js & XSLT)

A clean, minimal, and professional **Library Catalogue** web application built using **HTML, CSS, Vanilla JavaScript, XML, and XSLT**.

Transformations are executed **outside the browser** on a lightweight **Node.js server** using a JavaScript-based XSLT processor (`xslt-processor`), removing all reliance on the browser's native `XSLTProcessor` API.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                        BROWSER                         │
│  HTML5 + Modern CSS3 + Vanilla JavaScript (app.js)     │
│  - Captures search keystrokes, filter dropdowns & tabs │
│  - Zero XSLT processing inside the browser             │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP GET /api/transform?view=...
                            ▼
┌────────────────────────────────────────────────────────┐
│                     NODE.JS SERVER                     │
│  Express.js (server.js)                                │
│  - Receives user parameters (query, category, sort)    │
│  - Loads canonical XML and selected XSLT stylesheet    │
│  - Executes transformation via `xslt-processor`        │
│                                                        │
│      xml/library.xml  +  xslt/*.xsl                    │
│             └───────┬───────┘                          │
│                     ▼                                  │
│         XSLT Processor (Node.js)                       │
└───────────────────────────┬────────────────────────────┘
                            │ Returns Transformed HTML / XML
                            ▼
┌────────────────────────────────────────────────────────┐
│                        BROWSER                         │
│  - Injects clean HTML cards or displays formatted XML  │
└────────────────────────────────────────────────────────┘
```

### Why this architecture?
1. **Browser Independence**: Works identically across **Chrome, Edge, Firefox, Safari, and mobile browsers** without depending on any browser-specific or deprecated native XSLT engine.
2. **Clear Separation of Concerns**:
   - **XML** is the data source.
   - **XSLT** contains all presentation transformation logic.
   - **Node.js** executes the transformation in a predictable runtime.
   - **JavaScript** in the browser solely manages UI events and fetches output.
3. **No Java yet, but Backend-Ready**: The server architecture mimics exactly how a future Java / Spring Boot / JAXP service would operate.

---

## 🚀 Quick Start (Exact Setup Steps)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (bundled with Node.js)

### 1. Clone the repository
```bash
git clone <repository-url>
cd XML_XSL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the application
```bash
npm start
```

You will see the console confirmation:
```
====================================================
📚 Library Catalogue is running!
🚀 URL: http://localhost:3000
⚙️  Node.js XSLT Engine Active (No browser XSLTProcessor)
====================================================
```

### 4. Open in your browser
Navigate to:
```
http://localhost:3000
```

---

## 📂 Project Structure

All file paths are resolved relative to the project root (`path.join(__dirname, ...)`), ensuring the project works immediately after cloning on any operating system (Windows, macOS, Linux).

```
XML_XSL/
│
├── package.json                # Project dependencies & npm start script
├── server.js                   # Node.js Express server running xslt-processor
├── index.html                  # Main application UI & layout
│
├── css/
│   └── style.css               # Clean, minimal, professional library styling
│
├── js/
│   └── app.js                  # Pure UI interaction controller (no XSLTProcessor)
│
├── xml/
│   └── library.xml             # Canonical library repository (25 realistic books)
│
├── xslt/
│   ├── catalogue.xsl           # Main catalogue cards (params, XPath search, sorting)
│   ├── overdue.xsl             # Overdue loans action report
│   ├── category-summary.xsl    # Inventory statistics & distinct grouping
│   └── external-library.xsl    # XML -> XML partner schema transformation
│
└── README.md                   # Full documentation & learning guide
```

---

## 🏥 Health & Status Check

The server includes a simple health check endpoint at `/api/health`.

You can inspect it anytime in your browser or via curl:
```bash
curl http://localhost:3000/api/health
```

**Sample Response**:
```json
{
  "status": "ok",
  "service": "Library Node.js XSLT Transformation Service",
  "nodeVersion": "v24.19.0",
  "uptimeSeconds": 42,
  "xmlSource": {
    "path": "xml/library.xml",
    "available": true,
    "bookRecords": 25
  },
  "availableViews": ["catalogue", "overdue", "categories", "export"]
}
```

---

## 🧠 Architectural Roles: What Each Technology Does

| Technology | Role in this Project |
| :--- | :--- |
| **XML** (`xml/library.xml`) | **Data Storage Layer**. Canonical repository of 25 books containing IDs, titles, authors, categories, publication years, ISBNs, circulation statuses (`Available`, `Borrowed`, `Overdue`), member names, and due dates. |
| **XSLT** (`xslt/*.xsl`) | **Transformation Engine**. Contains declarative templates and XPath rules. Formats book cards, isolates overdue loans, computes category distributions, and remaps XML tags. |
| **Node.js** (`server.js`) | **Runtime & Execution Layer**. Loads the XML and XSLT files, passes user filter parameters into `xslt-processor`, runs the transformation outside the browser, and returns the result. |
| **Vanilla JS** (`js/app.js`) | **UI Interaction Handler**. Listens to user keystrokes in the search bar, filter dropdowns, and view buttons. Sends HTTP `fetch()` requests to `/api/transform` and renders the server's output into the DOM. |
| **CSS** (`css/style.css`) | **Visual Design**. Clean card grids, editorial serif book titles (`Lora`), status badges (green, blue, red), subtle borders, and responsive layouts. |

---

## 💡 Core XSLT Features Explained Simply

All XSLT stylesheets are standard W3C XSLT 1.0 templates.

### 1. `<xsl:template>` (Templates)
**Concept**: Rules defining what output to generate when a specific XML node pattern is matched.

```xslt
<!-- Matches the root /library element and produces the main container -->
<xsl:template match="/library">
  <div class="catalogue-container">
    <xsl:for-each select="book">
      <!-- render each book -->
    </xsl:for-each>
  </div>
</xsl:template>
```

---

### 2. `<xsl:for-each>` (Iteration)
**Concept**: Iterates over a selected set of XML nodes.

```xslt
<!-- Iterates through books where status is 'Overdue' -->
<xsl:for-each select="book[status = 'Overdue']">
  <tr>
    <td><xsl:value-of select="title"/></td>
    <td><xsl:value-of select="dueDate"/></td>
  </tr>
</xsl:for-each>
```

---

### 3. `<xsl:value-of>` (Value Extraction)
**Concept**: Reads the text content of an XML element or attribute.

```xslt
<h3 class="book-title"><xsl:value-of select="title"/></h3>
<p class="book-author">by <xsl:value-of select="author"/></p>
```

---

### 4. XPath Filtering (Predicates)
**Concept**: Filters nodes using logical conditions inside brackets `[...]`.

In `xslt/catalogue.xsl`, dynamic search keywords and category/status dropdowns are evaluated directly in XPath:
```xslt
book[
  ($selectedCategory = 'All' or category = $selectedCategory) and
  ($selectedStatus = 'All' or status = $selectedStatus) and
  ($query = '' or contains(translate(title, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), $query))
]
```

In `xslt/overdue.xsl`, only overdue loans are filtered:
```xslt
book[status = 'Overdue']
```

---

### 5. `<xsl:choose>`, `<xsl:when>`, `<xsl:otherwise>` & `<xsl:if>` (Conditions)
**Concept**: Generates different markup based on node values (like `if / else` or `switch / case`).

```xslt
<xsl:choose>
  <xsl:when test="status = 'Available'">
    <div class="status-badge status-available">Available</div>
  </xsl:when>
  <xsl:when test="status = 'Borrowed'">
    <div class="status-badge status-borrowed">Borrowed (Due: <xsl:value-of select="dueDate"/>)</div>
  </xsl:when>
  <xsl:when test="status = 'Overdue'">
    <div class="status-badge status-overdue">Overdue</div>
  </xsl:when>
  <xsl:otherwise>
    <div class="status-badge"><xsl:value-of select="status"/></div>
  </xsl:otherwise>
</xsl:choose>
```

---

### 6. `<xsl:sort>` (Sorting)
**Concept**: Reorders nodes before producing output.

In `xslt/catalogue.xsl`, dynamic multi-type sorting is controlled by the user:
```xslt
<xsl:sort select="title[$sortBy = 'title']" order="ascending" data-type="text"/>
<xsl:sort select="author[$sortBy = 'author']" order="ascending" data-type="text"/>
<xsl:sort select="year[$sortBy = 'year']" order="descending" data-type="number"/>
<xsl:sort select="id[$sortBy = 'id']" order="ascending" data-type="number"/>
```

In `xslt/overdue.xsl`, loans are sorted so the oldest overdue comes first:
```xslt
<xsl:sort select="dueDate" order="ascending"/>
```

---

### 7. Grouping (Distinct Categories)
**Concept**: Groups books by their category without duplicating category headings.

In `xslt/category-summary.xsl`, distinct categories are identified using the standard XPath pattern:
```xslt
<!-- Select only the first book of each category -->
<xsl:for-each select="book[not(category = preceding-sibling::book/category)]">
  <xsl:sort select="category" order="ascending"/>

  <xsl:variable name="currentCategory" select="category"/>
  <xsl:variable name="categoryBooks" select="/library/book[category = $currentCategory]"/>

  <!-- Aggregate statistics -->
  <h3><xsl:value-of select="$currentCategory"/></h3>
  <p>Total Books: <xsl:value-of select="count($categoryBooks)"/></p>
  <p>Available: <xsl:value-of select="count($categoryBooks[status = 'Available'])"/></p>
  <p>Borrowed: <xsl:value-of select="count($categoryBooks[status = 'Borrowed'])"/></p>
  <p>Overdue: <xsl:value-of select="count($categoryBooks[status = 'Overdue'])"/></p>
</xsl:for-each>
```

---

### 8. XML → XML Transformation (Schema Translation)
**Concept**: Translating an internal XML vocabulary into an external partner XML vocabulary.

#### Internal XML (`xml/library.xml`):
```xml
<book>
    <id>101</id>
    <title>Clean Code</title>
    <author>Robert C. Martin</author>
    <status>Available</status>
</book>
```

#### XSLT Mapping (`xslt/external-library.xsl`):
```xslt
<xsl:output method="xml" indent="yes" encoding="UTF-8"/>

<xsl:template match="/library">
  <externalCatalogue source="Athenaeum Central Library">
    <xsl:for-each select="book">
      <libraryBook>
        <bookId><xsl:value-of select="id"/></bookId>
        <bookTitle><xsl:value-of select="title"/></bookTitle>
        <bookAuthor><xsl:value-of select="author"/></bookAuthor>
        <availability><xsl:value-of select="status"/></availability>
      </libraryBook>
    </xsl:for-each>
  </externalCatalogue>
</xsl:template>
```

#### Generated External XML:
```xml
<libraryBook>
    <bookId>101</bookId>
    <bookTitle>Clean Code</bookTitle>
    <bookAuthor>Robert C. Martin</bookAuthor>
    <availability>Available</availability>
</libraryBook>
```

---

## 📑 Stylesheet Reference

| File | Purpose | Output Format | Key Features |
| :--- | :--- | :--- | :--- |
| `xslt/catalogue.xsl` | Interactive book catalogue cards | HTML | `<xsl:param>`, dynamic XPath filtering, case translation, multi-field sort |
| `xslt/overdue.xsl` | Actionable circulation report | HTML | XPath `book[status = 'Overdue']`, date sort, urgency badges |
| `xslt/category-summary.xsl` | Collection statistics & genre breakdown | HTML | Distinct grouping, count aggregation, mini title list |
| `xslt/external-library.xsl` | Partner system XML export | XML | `<xsl:output method="xml"/>`, schema tag remapping |

---

## 🔮 Future Extension: Java Backend

When migrating from Node.js to Java in the future, the frontend and XSLT stylesheets remain identical.

In Java, replace `server.js` with a Spring Boot controller or Jakarta Servlet using standard JAXP `javax.xml.transform.Transformer`:

```java
import javax.xml.transform.*;
import javax.xml.transform.stream.*;
import java.io.StringWriter;
import java.io.File;

public class LibraryTransformationService {

    public String transformLibrary(String xslName, String searchQuery, String category) throws Exception {
        TransformerFactory factory = TransformerFactory.newInstance();
        Source xslSource = new StreamSource(new File("xslt/" + xslName));
        Transformer transformer = factory.newTransformer(xslSource);

        if (searchQuery != null) transformer.setParameter("searchQuery", searchQuery);
        if (category != null) transformer.setParameter("selectedCategory", category);

        Source xmlSource = new StreamSource(new File("xml/library.xml"));
        StringWriter outputWriter = new StringWriter();
        transformer.transform(xmlSource, new StreamResult(outputWriter));

        return outputWriter.toString();
    }
}
```

---

&copy; 2026 Athenaeum Central Library. Built with standards-compliant XML & XSLT running on Node.js.


whole project flow

👤 USER
   │
   ▼
🌐 HTML/CSS
   "I provide the screen."
   │
   ▼
🧑 JavaScript
   "I'll capture what the user does."
   │
   ▼
🚦 Express.js
   "I'll route the request."
   │
   ▼
⚙️ Node.js
   "I'll read the files and run the XSLT."
   │
   ├───────────────┐
   ▼               ▼
📄 library.xml    📜 XSLT
   │               │
   └───────┬───────┘
           ▼
    ⚙️ XSLT Processor   
           │
      ┌────┴────┐
      ▼         ▼
    HTML       XML
      │         │
      ▼         ▼
  Browser    External
  display     system


app.js
   ↓
"view=overdue"
   ↓
server.js
   ↓
library.xml + overdue.xsl
   ↓
xslt-processor
   ↓
Overdue HTML
   ↓
server.js response
   ↓
app.js
   ↓
Display overdue table
