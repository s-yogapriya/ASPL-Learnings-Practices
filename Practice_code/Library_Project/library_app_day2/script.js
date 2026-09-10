// ======================================================
// DIGITAL LIBRARY AUTOMATION LAB
// XML + DOMParser + JavaScript
// ======================================================


// ======================================================
// GLOBAL VARIABLES
// ======================================================

let xmlDocument = null;

let allBooks = [];


// ======================================================
// 1. LOAD XML FILE
// ======================================================

fetch("library.xml")

    .then(response => {

        // Check whether library.xml was loaded
        if (!response.ok) {

            throw new Error(
                `Could not load library.xml. Status: ${response.status}`
            );

        }

        // Convert XML file into text
        return response.text();

    })


    // ==================================================
    // 2. CONVERT XML TEXT INTO XML DOM
    // ==================================================

    .then(xmlText => {

        const parser = new DOMParser();

        xmlDocument =
            parser.parseFromString(
                xmlText,
                "application/xml"
            );


        // Check XML syntax error

        const parserError =
            xmlDocument.getElementsByTagName(
                "parsererror"
            );


        if (parserError.length > 0) {

            throw new Error(
                "XML Parsing Error: " +
                parserError[0].textContent
            );

        }


        console.log(
            "✅ library.xml loaded successfully"
        );


        // Read all books from XML

        readBooksFromXML();


        console.log(
            "Total XML books:",
            allBooks.length
        );


        // Create all UI views

        renderTable(allBooks);

        renderCards(allBooks);

        renderCategories(allBooks);


        // Fill category dropdown

        populateCategoryDropdown();


        // Update statistics

        updateStatistics();


        // Setup search/filter/sort buttons

        setupControls();


        // Update result count

        updateResultCount(
            allBooks.length
        );

    })


    // ==================================================
    // 3. ERROR HANDLING
    // ==================================================

    .catch(error => {

        console.error(
            "❌ XML Loading Error:",
            error
        );


        const container =
            document.getElementById(
                "library-container"
            );


        if (container) {

            container.innerHTML = `

                <div style="
                    background:#fff;
                    padding:30px;
                    border-radius:10px;
                    color:#c0392b;
                    text-align:center;
                ">

                    <h2>
                        ❌ Unable to Load Library
                    </h2>

                    <p>
                        ${error.message}
                    </p>

                    <p>
                        Make sure library.xml,
                        index.html and script.js
                        are in the same folder.
                    </p>

                </div>

            `;

        }

    });


// ======================================================
// 4. READ BOOKS FROM XML
// ======================================================

function readBooksFromXML() {

    // Select all <book> elements

    const bookNodes =
        Array.from(
            xmlDocument.getElementsByTagName(
                "book"
            )
        );


    // Convert XML nodes into JavaScript objects

    allBooks =
        bookNodes.map(book => {


            // ------------------------------
            // PRICE NODE
            // ------------------------------

            const priceNode =
                book.getElementsByTagName(
                    "price"
                )[0];


            // ------------------------------
            // PARTNER CODE
            // ------------------------------

            const partnerCodeNode =
                book.getElementsByTagName(
                    "partner:storeCode"
                )[0];


            // ------------------------------
            // BOOK OBJECT
            // ------------------------------

            return {

                id:
                    book.getAttribute("id")
                    || "",


                status:
                    book.getAttribute("status")
                    || "",


                title:
                    getElementText(
                        book,
                        "title"
                    ),


                author:
                    getElementText(
                        book,
                        "author"
                    ),


                category:
                    getElementText(
                        book,
                        "category"
                    ),


                pages:
                    parseInt(
                        getElementText(
                            book,
                            "pages"
                        )
                    ) || 0,


                price:
                    priceNode
                        ? parseFloat(
                            priceNode.textContent
                        )
                        : 0,


                currency:
                    priceNode
                        ? priceNode.getAttribute(
                            "currency"
                        )
                        : "",


                partnerCode:
                    partnerCodeNode
                        ? partnerCodeNode.textContent.trim()
                        : "N/A"

            };

        });

}


// ======================================================
// 5. HELPER FUNCTION
// ======================================================

function getElementText(
    parent,
    tagName
) {

    const element =
        parent.getElementsByTagName(
            tagName
        )[0];


    if (!element) {

        return "";

    }


    return element.textContent.trim();

}


// ======================================================
// 6. TABLE VIEW
// ======================================================

function renderTable(
    books
) {

    const tableBody =
        document.getElementById(
            "library-table-body"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    books.forEach(book => {


        // ------------------------------
        // QUICK READ BADGE
        // ------------------------------

        let titleBadge = "";


        if (book.pages < 300) {

            titleBadge = `
                <span class="badge">
                    Quick Read
                </span>
            `;

        }


        // ------------------------------
        // STATUS HTML
        // ------------------------------

        const statusHtml =
            getStatusHTML(
                book.status
            );


        // ------------------------------
        // CREATE ROW
        // ------------------------------

        const row =
            document.createElement(
                "tr"
            );


        row.dataset.bookId =
            book.id;


        row.innerHTML = `

            <td>
                ${escapeHTML(book.id)}
            </td>

            <td>
                ${escapeHTML(book.title)}
                ${titleBadge}
            </td>

            <td>
                ${escapeHTML(book.author)}
            </td>

            <td>
                ${escapeHTML(book.category)}
            </td>

            <td>
                ${book.pages} pages
            </td>

            <td>
                $${book.price.toFixed(2)}
                (${escapeHTML(book.currency)})
            </td>

            <td>
                ${statusHtml}
            </td>

            <td>
                ${escapeHTML(book.partnerCode)}
            </td>

        `;


        tableBody.appendChild(
            row
        );

    });

}


// ======================================================
// 7. CARD VIEW
// ======================================================

function renderCards(
    books
) {

    const cardContainer =
        document.getElementById(
            "library-card-container"
        );


    if (!cardContainer) {

        return;

    }


    cardContainer.innerHTML = "";


    books.forEach(book => {


        // Quick read

        let titleBadge = "";


        if (book.pages < 300) {

            titleBadge = `
                <span class="badge">
                    Quick Read
                </span>
            `;

        }


        // Status

        const statusHtml =
            getStatusHTML(
                book.status
            );


        // Card

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "book-card";


        card.dataset.bookId =
            book.id;


        card.dataset.category =
            book.category;


        card.innerHTML = `

            <div class="card-header">

                <div>

                    <div class="book-id">

                        ${escapeHTML(book.id)}

                    </div>


                    <div class="book-title">

                        ${escapeHTML(book.title)}

                        ${titleBadge}

                    </div>


                    <div class="book-author">

                        by
                        ${escapeHTML(book.author)}

                    </div>

                </div>


                <div>

                    ${statusHtml}

                </div>

            </div>


            <div class="card-info">


                <div class="info-row">

                    <span class="info-label">
                        Category
                    </span>

                    <span class="info-value">
                        ${escapeHTML(book.category)}
                    </span>

                </div>


                <div class="info-row">

                    <span class="info-label">
                        Pages
                    </span>

                    <span class="info-value">
                        ${book.pages}
                    </span>

                </div>


                <div class="info-row">

                    <span class="info-label">
                        Price
                    </span>

                    <span class="info-value">

                        $${book.price.toFixed(2)}
                        ${escapeHTML(book.currency)}

                    </span>

                </div>


                <div class="info-row">

                    <span class="info-label">
                        Partner Code
                    </span>

                    <span class="info-value">
                        ${escapeHTML(book.partnerCode)}
                    </span>

                </div>


            </div>

        `;


        cardContainer.appendChild(
            card
        );

    });

}


// ======================================================
// 8. CATEGORY VIEW
// ======================================================

function renderCategories(
    books
) {

    const container =
        document.getElementById(
            "category-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    // Group books by category

    const groupedBooks = {};


    books.forEach(book => {

        if (!groupedBooks[book.category]) {

            groupedBooks[
                book.category
            ] = [];

        }


        groupedBooks[
            book.category
        ].push(book);

    });


    // Sort categories alphabetically

    const categories =
        Object.keys(
            groupedBooks
        ).sort(
            (a, b) =>
                a.localeCompare(b)
        );


    // Create category cards

    categories.forEach(category => {


        const categoryCard =
            document.createElement(
                "div"
            );


        categoryCard.className =
            "category-card";


        categoryCard.dataset.category =
            category;


        let booksHTML = "";


        groupedBooks[
            category
        ]
        .sort(
            (a, b) =>
                a.title.localeCompare(
                    b.title
                )
        )
        .forEach(book => {

            booksHTML += `

                <div
                    class="category-book"
                    data-book-id="${escapeHTML(book.id)}"
                >

                    <strong>
                        ${escapeHTML(book.title)}
                    </strong>

                    <span>

                        ${escapeHTML(book.author)}

                        • ${book.pages} pages

                    </span>

                </div>

            `;

        });


        categoryCard.innerHTML = `

            <div class="category-title">

                📁
                ${escapeHTML(category)}

            </div>


            ${booksHTML}

        `;


        container.appendChild(
            categoryCard
        );

    });

}


// ======================================================
// 9. STATUS HTML
// ======================================================

function getStatusHTML(
    status
) {

    if (status === "available") {

        return `
            <span class="status-available">
                Available
            </span>
        `;

    }


    if (status === "borrowed") {

        return `
            <span class="status-borrowed">
                Checked Out
            </span>
        `;

    }


    return `
        <span class="status-unknown">
            Unknown
        </span>
    `;

}


// ======================================================
// 10. CATEGORY DROPDOWN
// ======================================================

function populateCategoryDropdown() {

    const select =
        document.getElementById(
            "categoryFilter"
        );


    if (!select) {

        return;

    }


    // Get unique categories

    const categories =
        [
            ...new Set(
                allBooks.map(
                    book =>
                        book.category
                )
            )
        ];


    // Sort alphabetically

    categories.sort(
        (a, b) =>
            a.localeCompare(b)
    );


    // Add options

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            category;


        option.textContent =
            category;


        select.appendChild(
            option
        );

    });

}


// ======================================================
// 11. STATISTICS
// ======================================================

function updateStatistics() {

    const total =
        allBooks.length;


    const available =
        allBooks.filter(
            book =>
                book.status ===
                "available"
        ).length;


    const borrowed =
        allBooks.filter(
            book =>
                book.status ===
                "borrowed"
        ).length;


    const quickReads =
        allBooks.filter(
            book =>
                book.pages < 300
        ).length;


    setText(
        "totalBooks",
        total
    );


    setText(
        "availableBooks",
        available
    );


    setText(
        "borrowedBooks",
        borrowed
    );


    setText(
        "quickReads",
        quickReads
    );

}


// ======================================================
// 12. HELPER FOR TEXT
// ======================================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}


// ======================================================
// 13. SETUP CONTROLS
// ======================================================

function setupControls() {


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const sortSelect =
        document.getElementById(
            "sortSelect"
        );


    const resetButton =
        document.getElementById(
            "resetButton"
        );


    // ------------------------------
    // SEARCH
    // ------------------------------

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    // ------------------------------
    // CATEGORY
    // ------------------------------

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    // ------------------------------
    // STATUS
    // ------------------------------

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    // ------------------------------
    // SORT
    // ------------------------------

    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            applyFilters
        );

    }


    // ------------------------------
    // RESET
    // ------------------------------

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilters
        );

    }


    // ------------------------------
    // VIEW BUTTONS
    // ------------------------------

    const viewButtons =
        document.querySelectorAll(
            ".view-btn"
        );


    viewButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const view =
                    button.dataset.view;


                switchView(view);

            }
        );

    });

}


// ======================================================
// 14. FILTER + SORT
// ======================================================

function applyFilters() {


    // Get search value

    const search =
        document.getElementById(
            "searchInput"
        )
        ?.value
        .toLowerCase()
        .trim()
        || "";


    // Get category

    const category =
        document.getElementById(
            "categoryFilter"
        )
        ?.value
        || "all";


    // Get status

    const status =
        document.getElementById(
            "statusFilter"
        )
        ?.value
        || "all";


    // Get sort

    const sort =
        document.getElementById(
            "sortSelect"
        )
        ?.value
        || "category";


    // ==================================================
    // FILTER BOOKS
    // ==================================================

    let filteredBooks =
        allBooks.filter(book => {


            // ------------------------------
            // SEARCH MATCH
            // ------------------------------

            const searchMatch =

                book.id
                    .toLowerCase()
                    .includes(search)

                ||

                book.title
                    .toLowerCase()
                    .includes(search)

                ||

                book.author
                    .toLowerCase()
                    .includes(search)

                ||

                book.category
                    .toLowerCase()
                    .includes(search);


            // ------------------------------
            // CATEGORY MATCH
            // ------------------------------

            const categoryMatch =

                category === "all"

                ||

                book.category ===
                category;


            // ------------------------------
            // STATUS MATCH
            // ------------------------------

            let statusMatch = true;


            if (
                status === "available"
            ) {

                statusMatch =
                    book.status ===
                    "available";

            }


            else if (
                status === "borrowed"
            ) {

                statusMatch =
                    book.status ===
                    "borrowed";

            }


            else if (
                status === "unknown"
            ) {

                statusMatch =
                    book.status === "";

            }


            return (

                searchMatch

                &&

                categoryMatch

                &&

                statusMatch

            );

        });


    // ==================================================
    // SORT
    // ==================================================

    filteredBooks.sort(
        (a, b) => {


            // Category

            if (
                sort === "category"
            ) {

                const categoryResult =
                    a.category.localeCompare(
                        b.category
                    );


                if (
                    categoryResult !== 0
                ) {

                    return categoryResult;

                }


                // Same category
                // → sort by title

                return a.title.localeCompare(
                    b.title
                );

            }


            // Title

            if (
                sort === "title"
            ) {

                return a.title.localeCompare(
                    b.title
                );

            }


            // Author

            if (
                sort === "author"
            ) {

                return a.author.localeCompare(
                    b.author
                );

            }


            // Pages

            if (
                sort === "pages"
            ) {

                return a.pages - b.pages;

            }


            // Price

            if (
                sort === "price"
            ) {

                return a.price - b.price;

            }


            return 0;

        }
    );


    // ==================================================
    // UPDATE DISPLAY
    // ==================================================

    updateTableVisibility(
        filteredBooks
    );


    updateCardVisibility(
        filteredBooks
    );


    updateCategoryVisibility(
        filteredBooks
    );


    // Update count

    updateResultCount(
        filteredBooks.length
    );


    // No results

    showNoResults(
        filteredBooks.length === 0
    );

}


// ======================================================
// 15. TABLE FILTERING
// ======================================================

function updateTableVisibility(
    books
) {

    const rows =
        document.querySelectorAll(
            "#library-table-body tr"
        );


    rows.forEach(row => {

        const id =
            row.dataset.bookId;


        const exists =
            books.some(
                book =>
                    book.id === id
            );


        row.style.display =
            exists
                ? ""
                : "none";

    });

}


// ======================================================
// 16. CARD FILTERING
// ======================================================

function updateCardVisibility(
    books
) {

    const cards =
        document.querySelectorAll(
            ".book-card"
        );


    cards.forEach(card => {

        const id =
            card.dataset.bookId;


        const exists =
            books.some(
                book =>
                    book.id === id
            );


        card.style.display =
            exists
                ? ""
                : "none";

    });

}


// ======================================================
// 17. CATEGORY FILTERING
// ======================================================

function updateCategoryVisibility(
    books
) {

    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    categoryCards.forEach(
        categoryCard => {


            const category =
                categoryCard.dataset.category;


            const visibleBooks =
                books.filter(
                    book =>
                        book.category ===
                        category
                );


            // Hide entire category
            // if no books exist

            if (
                visibleBooks.length === 0
            ) {

                categoryCard.style.display =
                    "none";

                return;

            }


            categoryCard.style.display =
                "";


            // Show/hide individual books

            const bookElements =
                categoryCard.querySelectorAll(
                    ".category-book"
                );


            bookElements.forEach(
                bookElement => {


                    const bookId =
                        bookElement.dataset.bookId;


                    const exists =
                        visibleBooks.some(
                            book =>
                                book.id ===
                                bookId
                        );


                    bookElement.style.display =
                        exists
                            ? ""
                            : "none";

                }
            );

        }
    );

}


// ======================================================
// 18. RESULT COUNT
// ======================================================

function updateResultCount(
    count
) {

    const tableCount =
        document.getElementById(
            "tableResultCount"
        );


    const cardCount =
        document.getElementById(
            "cardResultCount"
        );


    if (tableCount) {

        tableCount.textContent =
            `${count} books`;

    }


    if (cardCount) {

        cardCount.textContent =
            `${count} books`;

    }

}


// ======================================================
// 19. NO RESULTS MESSAGE
// ======================================================

function showNoResults(
    show
) {

    const element =
        document.getElementById(
            "noResults"
        );


    if (!element) {

        return;

    }


    if (show) {

        element.classList.add(
            "show"
        );

    } else {

        element.classList.remove(
            "show"
        );

    }

}


// ======================================================
// 20. VIEW SWITCHING
// ======================================================

function switchView(
    viewId
) {


    // Hide all views

    const views =
        document.querySelectorAll(
            ".library-view"
        );


    views.forEach(view => {

        view.classList.remove(
            "active-view"
        );

    });


    // Show selected view

    const selectedView =
        document.getElementById(
            viewId
        );


    if (selectedView) {

        selectedView.classList.add(
            "active-view"
        );

    }


    // Update active button

    const buttons =
        document.querySelectorAll(
            ".view-btn"
        );


    buttons.forEach(button => {

        button.classList.remove(
            "active"
        );


        if (
            button.dataset.view ===
            viewId
        ) {

            button.classList.add(
                "active"
            );

        }

    });

}


// ======================================================
// 21. RESET FILTERS
// ======================================================

function resetFilters() {


    // Search

    const search =
        document.getElementById(
            "searchInput"
        );


    if (search) {

        search.value = "";

    }


    // Category

    const category =
        document.getElementById(
            "categoryFilter"
        );


    if (category) {

        category.value = "all";

    }


    // Status

    const status =
        document.getElementById(
            "statusFilter"
        );


    if (status) {

        status.value = "all";

    }


    // Sort

    const sort =
        document.getElementById(
            "sortSelect"
        );


    if (sort) {

        sort.value = "category";

    }


    // Show all books

    updateTableVisibility(
        allBooks
    );


    updateCardVisibility(
        allBooks
    );


    updateCategoryVisibility(
        allBooks
    );


    updateResultCount(
        allBooks.length
    );


    showNoResults(false);

}


// ======================================================
// 22. ESCAPE HTML
// ======================================================
//
// This prevents XML text from accidentally
// being interpreted as HTML.
// ======================================================

function escapeHTML(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
