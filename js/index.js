let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let currentUser = localStorage.getItem("currentUser");

// Check if user is logged in
function checkAuth() {
  if (currentUser) {
    document.getElementById("navLinks").classList.add("d-none");
    document.getElementById("userLinks").classList.remove("d-none");
    document.getElementById("userName").textContent = currentUser;
    document.querySelector(".header").classList.add("d-block");
    document.querySelector(".header").classList.remove("d-none");
    updateBadges();
  } else {
    document.getElementById("navLinks").classList.remove("d-none");
    document.getElementById("userLinks").classList.add("d-none");
 document.querySelector(".header").classList.remove("d-block");
    document.querySelector(".header").classList.add("d-none");  }
}

// Update cart and wishlist badges
function updateBadges() {
  if (currentUser) {
    document.getElementById("cartBadge").textContent = cart.length;
    document.getElementById("wishlistBadge").textContent = wishlist.length;
  }
}

// Logout function
document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Logout",
    text: "Are you sure you want to logout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        timer: 1000,

        showConfirmButton: false,
      }).then(() => {
        window.location.href = "index.html";
      });
    }
  });
});

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    allProducts = await response.json();
    displayProducts(allProducts);
    loadCategories();
  } catch (error) {
    document.getElementById("productsContainer").innerHTML =
      '<div class="alert alert-danger "><i class="fas fa-exclamation-circle"></i> Error loading products! Please try again later.</div>';
  }
}

// Load categories
function loadCategories() {
  const categories = [...new Set(allProducts.map((p) => p.category))];
  const categoryFilter = document.getElementById("categoryFilter");
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Display products
function displayProducts(products) {
  const container = document.getElementById("productsContainer");
  if (products.length === 0) {
    container.innerHTML =
      '<div class="alert alert-info"><i class="fas fa-info-circle"></i> No products found</div>';
    return;
  }

  const content = `
                <div class="row">
                    ${products
                      .map(
                        (product) => `
                        <div class="col-md-4 mb-4">
                            <div class="card product-card">
                                <img src="${
                                  product.image
                                }" class="card-img-top product-img" alt="${
                          product.title
                        }">
                                <div class="card-body">
                                    <h5 class="card-title">${product.title}</h5>
                                    <p class="text-muted text-capitalize">${
                                      product.category
                                    }</p>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <p class="price mb-0">$${
                                          product.price
                                        }</p>
                                        <div class="text-warning">
                                            <i class="fas fa-star"></i> ${
                                              product.rating.rate
                                            } (${product.rating.count})
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between mt-4 align-items-center">
                                        <button class="btn btn-primary px-4 py-2 btn-sm" onclick="addToCart(${
                                          product.id
                                        })">
                                            <i class="fas fa-cart-plus"></i> Add to Cart
                                        </button>
                                        <i class="fav-icon ${
                                          wishlist.includes(product.id)
                                            ? "fas"
                                            : "far"
                                        } fa-heart" 
                                           id="fav-${product.id}" 
                                           onclick="toggleWishlist(${
                                             product.id
                                           })"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
  container.innerHTML = content;
}

// Add to cart
function addToCart(productId) {
  if (!currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to add items to cart",
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-sign-in-alt"></i> Go to Login',
      cancelButtonText: "Cancel",
      confirmButtonColor: "#007bff",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "login.html";
      }
    });
    return;
  }

  if (cart.find((item) => item.id === productId)) {
    Swal.fire({
      icon: "info",
      title: "Already in cart!",
      text: "This item is already in your cart",
      timer: 1000,

      showConfirmButton: false,
    });
    return;
  }

  const product = allProducts.find((p) => p.id === productId);
  cart.push({ ...product, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBadges();

  Swal.fire({
    icon: "success",
    title: "Added to Cart!",
    text: product.title,
    timer: 1000,

    showConfirmButton: false,
  });
}

// Toggle wishlist
function toggleWishlist(productId) {
  if (!currentUser) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to add items to wishlist",
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-sign-in-alt"></i> Go to Login',
      cancelButtonText: "Cancel",
      confirmButtonColor: "#007bff",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "login.html";
      }
    });
    return;
  }

  const icon = document.getElementById(`fav-${productId}`);
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    icon.classList.remove("fas");
    icon.classList.add("far");
    Swal.fire({
      icon: "info",
      title: "Removed from wishlist!",
      timer: 1000,

      showConfirmButton: false,
    });
  } else {
    wishlist.push(productId);
    icon.classList.remove("far");
    icon.classList.add("fas");
    Swal.fire({
      icon: "success",
      title: "Added to wishlist!",
      timer: 1000,

      showConfirmButton: false,
    });
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateBadges();
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
  );
  displayProducts(filtered);
});

// Category filter
document
  .getElementById("categoryFilter")
  .addEventListener("change", function (e) {
    const category = e.target.value;
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();

    let filtered = category
      ? allProducts.filter((p) => p.category === category)
      : allProducts;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    displayProducts(filtered);
  });

// Initialize
checkAuth();
fetchProducts();
