/* PageTurner Online Bookstore - Application Logic */

"use strict";

const books = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Technology",
        price: 32.99,
        available: true,
        icon: "💻",
        description: "Learn principles for writing clean, readable software."
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Personal Growth",
        price: 18.50,
        available: true,
        icon: "🌱",
        description: "Build better habits through small daily improvements."
    },
    {
        id: 3,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        category: "Mystery",
        price: 14.99,
        available: true,
        icon: "🔎",
        description: "A psychological mystery full of unexpected twists."
    },
    {
        id: 4,
        title: "The Hobbit",
        author: "J. R. R. Tolkien",
        category: "Fantasy",
        price: 16.75,
        available: true,
        icon: "🐉",
        description: "Join an unforgettable adventure through Middle-earth."
    },
    {
        id: 5,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Fiction",
        price: 12.25,
        available: true,
        icon: "📖",
        description: "A classic story of love, family, and first impressions."
    },
    {
        id: 6,
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        category: "Personal Growth",
        price: 15.99,
        available: true,
        icon: "💰",
        description: "Explore ideas about money and financial education."
    },
    {
        id: 7,
        title: "The Girl with the Dragon Tattoo",
        author: "Stieg Larsson",
        category: "Mystery",
        price: 17.49,
        available: false,
        icon: "🕵️",
        description: "Investigate a complex mystery filled with secrets."
    },
    {
        id: 8,
        title: "The Martian",
        author: "Andy Weir",
        category: "Fiction",
        price: 19.25,
        available: true,
        icon: "🚀",
        description: "A stranded astronaut fights to survive on Mars."
    }
];

const cart = new Map();
const orders = new Map();
let nextOrderNumber = 1001;

const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const resultCount = document.getElementById("result-count");
const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutMessage = document.getElementById("checkout-message");
const trackingResult = document.getElementById("tracking-result");

function formatPrice(price) {
    return "$" + price.toFixed(2);
}

function renderBooks() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;

    const filteredBooks = books.filter(function (book) {
        const matchesSearch =
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query);

        const matchesCategory =
            category === "All" || book.category === category;

        return matchesSearch && matchesCategory;
    });

    resultCount.textContent =
        filteredBooks.length + (filteredBooks.length === 1
            ? " book found"
            : " books found");

    bookGrid.replaceChildren();

    if (filteredBooks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent =
            "No books found. Try another title, author, or category.";
        bookGrid.appendChild(emptyMessage);
        return;
    }

    filteredBooks.forEach(function (book) {
        const card = document.createElement("article");
        card.className = "book-card";

        const cover = document.createElement("div");
        cover.className = "book-cover";
        cover.setAttribute("aria-hidden", "true");
        cover.textContent = book.icon;

        const categoryLabel = document.createElement("span");
        categoryLabel.className = "book-category";
        categoryLabel.textContent = book.category;

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "book-author";
        author.textContent = "By " + book.author;

        const description = document.createElement("p");
        description.className = "book-description";
        description.textContent = book.description;

        const price = document.createElement("p");
        price.className = "book-price";
        price.textContent = formatPrice(book.price);

        const availability = document.createElement("p");
        availability.className = book.available
            ? "availability"
            : "availability unavailable";
        availability.textContent = book.available
            ? "✓ In Stock"
            : "Currently Unavailable";

        const addButton = document.createElement("button");
        addButton.className = "add-button";
        addButton.type = "button";
        addButton.textContent = book.available
            ? "Add to Cart"
            : "Out of Stock";
        addButton.disabled = !book.available;
        addButton.addEventListener("click", function () {
            addToCart(book.id);
        });

        card.append(
            cover,
            categoryLabel,
            title,
            author,
            description,
            price,
            availability,
            addButton
        );

        bookGrid.appendChild(card);
    });
}

function addToCart(bookId) {
    const book = books.find(function (item) {
        return item.id === bookId;
    });

    if (!book || !book.available) {
        return;
    }

    const currentQuantity = cart.get(bookId) || 0;
    cart.set(bookId, currentQuantity + 1);

    checkoutMessage.textContent = "";
    renderCart();
}

function removeFromCart(bookId) {
    cart.delete(bookId);
    renderCart();
}

function renderCart() {
    cartItems.replaceChildren();

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(function (quantity, bookId) {
        const book = books.find(function (item) {
            return item.id === bookId;
        });

        if (!book) {
            return;
        }

        totalQuantity += quantity;
        totalPrice += book.price * quantity;

        const item = document.createElement("div");
        item.className = "cart-item";

        const details = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = book.title;

        const quantityText = document.createElement("p");
        quantityText.textContent =
            quantity + " × " + formatPrice(book.price);

        details.append(title, quantityText);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label",
            "Remove " + book.title + " from cart"
        );

        removeButton.addEventListener("click", function () {
            removeFromCart(bookId);
        });

        item.append(details, removeButton);
        cartItems.appendChild(item);
    });

    if (totalQuantity === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your cart is empty. Browse our books!";
        cartItems.appendChild(emptyMessage);
    }

    cartCount.textContent = String(totalQuantity);
    cartTotal.textContent = formatPrice(totalPrice);
}

function openCart() {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    overlay.classList.add("visible");
    document.getElementById("cart-toggle").setAttribute(
        "aria-expanded", "true"
    );
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    overlay.classList.remove("visible");
    document.getElementById("cart-toggle").setAttribute(
        "aria-expanded", "false"
    );
}

function checkout() {
    if (cart.size === 0) {
        checkoutMessage.textContent =
            "Your cart is empty. Add a book before placing an order.";
        return;
    }

    const orderId = "PT" + nextOrderNumber++;
    const orderItems = [];
    let total = 0;

    cart.forEach(function (quantity, bookId) {
        const book = books.find(function (item) {
            return item.id === bookId;
        });

        if (book) {
            orderItems.push({
                title: book.title,
                quantity: quantity
            });
            total += book.price * quantity;
        }
    });

    orders.set(orderId, {
        status: "Confirmed — Demo Order",
        items: orderItems,
        total: total
    });

    cart.clear();
    renderCart();

    checkoutMessage.textContent =
        "Order placed! Your demo order ID is " + orderId +
        ". Save this ID to track your order.";

    document.getElementById("order-id").value = orderId;
    trackingResult.textContent = "";
}

function trackOrder(event) {
    event.preventDefault();

    const orderId = document.getElementById("order-id")
        .value.trim().toUpperCase();

    if (!orderId) {
        trackingResult.textContent = "Please enter an order ID.";
        return;
    }

    const order = orders.get(orderId);

    if (order) {
        const itemSummary = order.items.map(function (item) {
            return item.title + " × " + item.quantity;
        }).join(", ");

        trackingResult.textContent =
            "Order " + orderId + ": " + order.status +
            ". Items: " + itemSummary +
            ". Total: " + formatPrice(order.total) + ".";
        return;
    }

    if (orderId === "PT1001") {
        trackingResult.textContent =
            "Order PT1001: Shipped — Sample tracking record.";
        return;
    }

    trackingResult.textContent =
        "Order not found in this demo session. Place a demo order " +
        "first and use the order ID provided at checkout.";
}

searchInput.addEventListener("input", renderBooks);
categorySelect.addEventListener("change", renderBooks);

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", checkout);
document.getElementById("tracking-form").addEventListener("submit", trackOrder);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeCart();
    }
});

renderBooks();
renderCart();
