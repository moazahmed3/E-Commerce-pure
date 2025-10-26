let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const currentUser = localStorage.getItem("currentUser");

// Check authentication
if (!currentUser) {
  window.location.href = "login.html";
}

// document.getElementById("userName").textContent = currentUser;

// Update cart and wishlist badges
function updateBadges() {
  if (currentUser) {
    document.getElementById("cartBadge").textContent = cart.length;
    document.getElementById("wishlistBadge").textContent = wishlist.length;
  }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Logout",
    text: "Are you sure you want to logout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Yes, logout",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    }
  });
});

// Display cart items
function displayCart() {
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart text-center py-5">
        <i class="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
        <h3 class="mb-3">Your cart is empty</h3>
        <p class="text-muted mb-4">Add some products to get started!</p>
        <a href="index.html" class="btn btn-primary btn-lg">
          <i class="fas fa-shopping-bag me-2"></i> Start Shopping
        </a>
      </div>
    `;
    updateTotal();
    return;
  }

  const html = cart
    .map(
      (item) => `
        <div class="cart-item mb-3 p-4 bg-white rounded shadow-sm">
          <div class="row g-2 align-items-center">
            
            <!-- Product Image & Details -->
            <div class="col-12 d-flex align-items-start gap-3">
              <div style="flex-shrink: 0; width: 80px; height: 80px;">
                <img src="${item.image}" alt="${item.title}" class="img-fluid rounded" style="width: 100%; height: 100%; object-fit: contain;">
              </div>
              
              <div class="flex-grow-1">
                <h6 class="mb-1" style="font-size: 0.95rem;">${item.title}</h6>
                <small class="text-muted d-block mb-2">${item.category}</small>
                <strong class="text-success">$${item.price}</strong>
              </div>
            </div>
            
            <!-- Quantity Control & Delete -->
            <div class="col-12 d-flex mt-4 justify-content-between align-items-center mt-2 pt-2" style="border-top: 1px solid #eee;">
              
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-danger" onclick="decreaseQuantity(${item.id})" style="width: 35px; height: 35px; padding: 0;">
                  <i class="fas fa-minus fa-xs"></i>
                </button>
                <span class="fw-bold px-3" style="font-size: 1.1rem;">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-success" onclick="increaseQuantity(${item.id})" style="width: 35px; height: 35px; padding: 0;">
                  <i class="fas fa-plus fa-xs"></i>
                </button>
              </div>
              
              <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})" style="width: 35px; height: 35px; padding: 0;">
                <i class="fas fa-trash fa-xs"></i>
              </button>
              
            </div>
          </div>
        </div>
      `
    )
    .join("");

  container.innerHTML = html;
  updateTotal();
}

// Update total
function updateTotal() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  document.getElementById("subtotal").textContent = `${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `${subtotal.toFixed(2)}`;
}

// Increase quantity
function increaseQuantity(productId) {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }
}

// Decrease quantity
function decreaseQuantity(productId) {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
    } else {
      removeFromCart(productId);
    }
  }
}

// Remove from cart
function removeFromCart(productId) {
  Swal.fire({
    title: "Remove Item",
    text: "Are you sure you want to remove this item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Yes, remove it",
  }).then((result) => {
    if (result.isConfirmed) {
      cart = cart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      Swal.fire("Removed!", "Item removed from cart", "success");
    }
  });
}

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    Swal.fire("Cart is empty!", "Add items before checkout", "warning");
    return;
  }

  Swal.fire({
    title: "Checkout",
    text: "Proceed to checkout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Yes, proceed",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Thank you for your purchase!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
      });
    }
  });
});

// Initialize
displayCart();
updateBadges();
