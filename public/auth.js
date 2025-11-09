// ===== ObaseCash Auth.js =====
const API_BASE = "https://obasecash-api.onrender.com/api";

// REGISTER
async function register() {
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!fullname || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Registration successful!");
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      alert("❌ " + (data.message || "Registration failed."));
    }
  } catch (err) {
    console.error("Register Error:", err);
    alert("⚠️ Network error during registration.");
  }
}

// LOGIN
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Login successful!");
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      alert("❌ " + (data.message || "Login failed."));
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert("⚠️ Network error during login.");
  }
}
