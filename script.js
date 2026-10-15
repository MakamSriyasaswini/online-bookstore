
const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", price: 12.99, stock: true, icon: "📕" },
    { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "Technology", price: 34.99, stock: true, icon: "💻" },
    { id: 3, title: "Atomic Habits", author: "James Clear", category: "Personal Growth", price: 18.50, stock: true, icon: "🌱" },
    { id: 4, title: "Gone Girl", author: "Gillian Flynn", category: "Mystery", price: 15.99, stock: false, icon: "🔍" },
    { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", price: 16.75, stock: true, icon: "🐉" },
    { id: 6, title: "The Pragmatic Programmer", author: "David Thomas", category: "Technology", price: 39.99, stock: true, icon: "📘" },
    { id: 7, title: "Deep Work", author: "Cal Newport", category: "Personal Growth", price: 17.25, stock: true, icon: "🧠" },
    { id: 8, title: "Sherlock Holmes", author: "Arthur Conan Doyle", category: "Mystery", price: 14.50, stock: true, icon: "🕵️" },
    { id: 9, title: "The Name of the Wind", author: "Patrick Rothfuss", category: "Fantasy", price: 19.99, stock: false, icon: "✨" }
];

let cart = [];
let orders = [];

const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");

function renderBooks() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;

    const filtered = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query);
        const matchesCategory =
            category === "All" || book.category === category;

        return matchesSearch && matchesCategory;
    });

    document.getElementById("result-count").textContent =
        `${filtered.length} book(s) found`;

    bookGrid.replaceChildren();

    if (filtered.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No books found. Try another search.";
        bookGrid.appendChild(message);
        return;
    }

    filtered.forEach(book => {
        const card = document.createElement("article");
        card.className = "book-card";

        const cover = document.createElement("div");
        cover.className = "book-cover";
        cover.textContent = book.icon;
        cover.setAttribute("aria-hidden", "true");

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "author";
        author.textContent = `By ${book.author}`;

        const categoryLabel = document.createElement("p");
        categoryLabel.className = "category-label";
        categoryLabel.textContent = book.category;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = `$${book.price.toFixed(2)}`;

        const availability = document.createElement("p");
        availability.className = `availability ${book.stock ? "available" : "unavailable"}`;
        availability.textContent = book.stock ? "● In Stock" : "● Out of Stock";

        const button = document.createElement("button");
        button.textContent = book.stock ? "Add to Cart" : "Unavailable";
        button.disabled = !book.stock;
        button.addEventListener("click", () => addToCart(book.id));

        card.append(cover, title, author, categoryLabel, price, availability, button);
        bookGrid.appendChild(card);
    });
}

function addToCart(bookId) {
    const book = books.find(item => item.id === bookId);
    if (!book || !book.stock) return;

    const existing = cart.find(item => item.id === bookId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.replaceChildren();

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("span");
        details.textContent =
            `${item.title} × ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`;

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.setAttribute("aria-label", `Remove ${item.title}`);
        remove.addEventListener("click", () => {
            cart = cart.filter(book => book.id !== item.id);
            renderCart();
        });

        row.append(details, remove);
        cartItems.appendChild(row);
    });

    document.getElementById("cart-count").textContent = count;
    document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
}

function toggleCart(open) {
    cartPanel.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    cartPanel.setAttribute("aria-hidden", String(!open));
}

document.getElementById("cart-toggle").addEventListener("click", () => toggleCart(true));
document.getElementById("cart-close").addEventListener("click", () => toggleCart(false));
overlay.addEventListener("click", () => toggleCart(false));

document.getElementById("checkout").addEventListener("click", () => {
    const message = document.getElementById("checkout-message");

    if (cart.length === 0) {
        message.textContent = "Your cart is empty. Add a book first.";
        return;
    }

    const orderId = `BK${Date.now().toString().slice(-8)}`;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    orders.push({ id: orderId, total, status: "Order placed" });
    cart = [];
    renderCart();

    message.textContent = `Demo order placed! Your order ID is ${orderId}.`;
    document.getElementById("order-id").value = orderId;
    toggleCart(false);
});

document.getElementById("tracking-form").addEventListener("submit", event => {
    event.preventDefault();

    const requestedId = document.getElementById("order-id").value.trim();
    const order = orders.find(item => item.id === requestedId);
    const result = document.getElementById("tracking-result");

    if (!order) {
        result.textContent = "Order not found in this session. Place a demo order first.";
        return;
    }

    result.textContent =
        `Order ${order.id}: ${order.status}. Total: $${order.total.toFixed(2)}.`;
});

searchInput.addEventListener("input", renderBooks);
categorySelect.addEventListener("change", renderBooks);

renderBooks();
renderCart();
