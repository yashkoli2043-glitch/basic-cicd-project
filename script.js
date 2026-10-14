
const products = [
  { id: 1, name: "Classic T-Shirt", category: "Fashion", price: 499, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Running Sneakers", category: "Fashion", price: 1499, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Smart Watch", category: "Electronics", price: 2499, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { id: 4, name: "Wireless Headphones", category: "Electronics", price: 1999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "Denim Jacket", category: "Fashion", price: 1799, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" },
  { id: 6, name: "Sunglasses", category: "Fashion", price: 699, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" },
  { id: 7, name: "Bluetooth Speaker", category: "Electronics", price: 1299, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80" },
  { id: 8, name: "Digital Camera", category: "Electronics", price: 5999, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" }
];

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");

let cart = [];
let category = "All";
let searchTerm = "";
let sortMode = "featured";

const money = (amount) =>
  amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

function renderProducts() {
  let filtered = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  if (sortMode === "low") filtered.sort((a, b) => a.price - b.price);
  if (sortMode === "high") filtered.sort((a, b) => b.price - a.price);
  if (sortMode === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  productGrid.replaceChildren();

  $("#resultsCount").textContent =
    `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

  if (!filtered.length) {
    productGrid.textContent = "No products found. Try another search.";
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const type = document.createElement("p");
    type.className = "category";
    type.textContent = product.category;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = money(product.price);

    const addButton = document.createElement("button");
    addButton.className = "add-to-cart";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    info.append(name, type, price, addButton);
    card.append(image, info);
    productGrid.append(card);
  });
}

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();
  showToast("Product added to cart!");
}

function changeQuantity(id, amount) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.quantity += amount;
  cart = cart.filter((entry) => entry.quantity > 0);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = count;
  $("#subtotal").textContent = money(total);
  $("#checkoutTotal").textContent = money(total);

  const cartItems = $("#cartItems");
  cartItems.replaceChildren();

  if (!cart.length) {
    cartItems.textContent = "Your cart is empty.";
    return;
  }

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = `${money(product.price)} × ${item.quantity}`;

    const controls = document.createElement("div");

    const minus = document.createElement("button");
    minus.className = "remove-item";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    minus.addEventListener("click", () => changeQuantity(item.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = ` ${item.quantity} `;

    const plus = document.createElement("button");
    plus.className = "remove-item";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Increase ${product.name} quantity`);
    plus.addEventListener("click", () => changeQuantity(item.id, 1));

    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeFromCart(item.id));

    controls.append(minus, quantity, plus, remove);
    details.append(name, price, controls);
    row.append(details);
    cartItems.append(row);
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = $("#searchInput").value.trim().toLowerCase();
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  renderProducts();
});

$("#sortSelect").addEventListener("change", (event) => {
  sortMode = event.target.value;
  renderProducts();
});

$("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  category = button.dataset.category;

  document.querySelectorAll("#filters .filter").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

document.querySelectorAll(".nav [data-category]").forEach((link) => {
  link.addEventListener("click", () => {
    category = link.dataset.category;

    document.querySelectorAll("#filters .filter").forEach((filter) => {
      filter.classList.toggle(
        "active",
        filter.dataset.category === category
      );
    });

    renderProducts();
  });
});

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

$("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  $("#checkoutModal").hidden = false;
});

$("#closeCheckout").addEventListener("click", () => {
  $("#checkoutModal").hidden = true;
});

$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    $("#checkoutModal").hidden = true;
    showToast("Your cart is empty.");
    return;
  }

  const orderCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cart = [];
  renderCart();
  $("#checkoutForm").reset();
  $("#checkoutModal").hidden = true;
  closeCart();
  showToast(`Demo order placed! ${orderCount} item(s).`);
});

renderProducts();
renderCart();
