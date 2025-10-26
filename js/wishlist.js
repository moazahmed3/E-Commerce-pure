let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProducts = [];
const currentUser = localStorage.getItem("currentUser");

// Check authentication
if (!currentUser) {
  window.location.href = "login.html";
}

document.getElementById("cartBadge").textContent = cart.length;



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

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    allProducts = await response.json();
    displayWishlist();
  } catch (error) {
    document.getElementById("wishlistContainer").innerHTML =
      '<div class="alert alert-danger">Error loading wishlist!</div>';
  }
}

// Display wishlist items
function displayWishlist() {
  const container = document.getElementById("wishlistContainer");

  if (wishlist.length === 0) {
    container.innerHTML = `
                    <div class="empty-wishlist">
                        <i class="fas fa-heart-broken"></i>
                        <h3 class="mt-3">Your wishlist is empty</h3>
                        <p class="text-muted">Save your favorite items here!</p>
                        <a href="index.html" class="btn btn-primary mt-3">
                            <i class="fas fa-shopping-bag"></i> Start Shopping
                        </a>
                    </div>
                `;
    return;
  }

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const html = `
                <div class="row">
                    ${wishlistProducts
                      .map(
                        (product) => `
                        <div class="col-md-4 mb-4">
                            <div class="card product-card position-relative">
                                <button class="btn btn-sm btn-danger remove-btn" onclick="removeFromWishlist(${product.id})">
                                    <i class="fas fa-times"></i>
                                </button>
                                <img src="${product.image}" class="card-img-top product-img" alt="${product.title}">
                                <div class="card-body">
                                    <h5 class="card-title" style="height: 48px; overflow: hidden;">${product.title}</h5>
                                    <p class="text-muted">${product.category}</p>
                                    <p class="price">$${product.price}</p>
                                    <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">
                                        <i class="fas fa-cart-plus"></i> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;

  container.innerHTML = html;
}

// Add to cart
function addToCart(productId) {
  if (cart.find((item) => item.id === productId)) {
    Swal.fire("Already in cart!", "", "info");
    return;
  }

  const product = allProducts.find((p) => p.id === productId);
  cart.push({ ...product, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  document.getElementById("cartBadge").textContent = cart.length;

  Swal.fire({
    icon: "success",
    title: "Added to Cart!",
    text: product.title,
    timer: 1500,
    showConfirmButton: false,
  });
}

// Remove from wishlist
function removeFromWishlist(productId) {
  Swal.fire({
    title: "Remove from Wishlist",
    text: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Yes, remove it",
    
  }).then((result) => {
    if (result.isConfirmed) {
      wishlist = wishlist.filter((id) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      displayWishlist();
      Swal.fire("Removed!", "Item removed from wishlist", "success");
      updateBadges()
    }
  });
}

// Clear all wishlist
document
  .getElementById("clearWishlistBtn")
  .addEventListener("click", function () {
    if (wishlist.length === 0) {
      Swal.fire("Wishlist is empty!", "", "info");
      return;
    }

    Swal.fire({
      title: "Clear Wishlist",
      text: "Remove all items from wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, clear all",
    }).then((result) => {
      if (result.isConfirmed) {
        wishlist = [];
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        displayWishlist();
        Swal.fire("Cleared!", "Wishlist cleared successfully", "success");
      }
    });
  });

// Initialize
fetchProducts();
updateBadges()