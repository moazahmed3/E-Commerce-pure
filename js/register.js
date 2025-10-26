// Check if already logged in
if (localStorage.getItem("currentUser")) {
  window.location.href = "index.html";
}

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match!",
      });
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.find((u) => u.email === email)) {
      Swal.fire({
        icon: "error",
        title: "Email Exists",
        text: "This email is already registered!",
      });
      return;
    }

    // Add new user
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      text: "Your account has been created. Please login.",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "login.html";
    });
  });
