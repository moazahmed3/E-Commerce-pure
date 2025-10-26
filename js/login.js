// Check if already logged in
if (localStorage.getItem("currentUser")) {
  window.location.href = "index.html";
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Get registered users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find user
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", user.name);
    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      text: `Welcome back, ${user.name}!`,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "index.html";
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid email or password!",
    });
  }
});
