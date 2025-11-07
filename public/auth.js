// auth.js
// Handles registration and login using global config.js

console.log("✅ auth.js loaded with API:", API_BASE_URL);

// ===== REGISTER =====
const regForm = document.getElementById("registerForm");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!fullname || !email || !password) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(apiEndpoint("/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await res.json();
      document.getElementById("registerMessage").innerText =
        data.message || "Registration complete.";

      if (res.ok && data.message.toLowerCase().includes("success")) {
        alert("✅ Registration successful! Redirecting to login...");
        setTimeout(() => (window.location.href = "login.html"), 1500);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error: " + err.message);
    }
  });
}

// ===== LOGIN =====
const logForm = document.getElementById("loginForm");
if (logForm) {
  logForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch(apiEndpoint("/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "❌ Login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server Error: " + err.message);
    }
  });
}
