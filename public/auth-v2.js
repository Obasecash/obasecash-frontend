// ✅ Correct API base URL for Render
const api = "https://obasecash-api.onrender.com/api";

// Wait until the page loads
document.addEventListener("DOMContentLoaded", () => {

  // ===== REGISTER =====
  const regForm = document.getElementById("registerForm");
  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!fullname || !email || !password) {
        alert("Please fill all fields.");
        return;
      }

      try {
        const res = await fetch(`${api}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullname, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("✅ Registration successful! Redirecting to login...");
          setTimeout(() => (window.location.href = "login.html"), 1500);
        } else {
          alert(`❌ Registration failed: ${data.message || "Unknown error"}`);
        }
      } catch (err) {
        alert("Server error: " + err.message);
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
        alert("Enter both email and password.");
        return;
      }

      try {
        const res = await fetch(`${api}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("✅ Login successful!");
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => (window.location.href = "dashboard.html"), 1200);
        } else {
          alert(`❌ Login failed: ${data.message || "Invalid credentials"}`);
        }
      } catch (err) {
        alert("Server error: " + err.message);
      }
    });
  }

});
