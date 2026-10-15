const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "script.js"), "utf8");

test("Homepage contains the bookstore title", () => {
    assert.match(html, /PageTurner Bookstore/);
});

test("Homepage loads CSS and JavaScript", () => {
    assert.match(html, /href="styles\.css"/);
    assert.match(html, /src="script\.js"/);
});

test("Book catalog, search, categories and order tracking exist", () => {
    assert.match(html, /id="book-grid"/);
    assert.match(html, /id="search"/);
    assert.match(html, /id="category"/);
    assert.match(html, /id="tracking-form"/);
});

test("Shopping cart and checkout controls exist", () => {
    assert.match(html, /id="cart-items"/);
    assert.match(html, /id="cart-total"/);
    assert.match(html, /id="checkout"/);
});

test("JavaScript defines at least six books", () => {
    const match = js.match(/const books = \[([\s\S]*?)\n\];/);
    assert.ok(match, "Book catalog must be defined");

    const bookCount = (match[1].match(/\bid:\s*\d+/g) || []).length;
    assert.ok(bookCount >= 6, `Expected at least 6 books, found ${bookCount}`);
});

test("JavaScript includes search, cart and tracking functionality", () => {
    assert.match(js, /function renderBooks/);
    assert.match(js, /function addToCart/);
    assert.match(js, /function renderCart/);
    assert.match(js, /tracking-form/);
});

test("Styles include responsive layout", () => {
    assert.match(css, /@media/);
    assert.match(css, /\.book-grid/);
});

test("Required health check file exists", () => {
    assert.ok(fs.existsSync(path.join(root, "healthz")));
});
