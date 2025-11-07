
document.addEventListener("DOMContentLoaded", () => {
// ✅ Correct API base URL
const api = "https://obasecash-api.onrender.com/api";


// ====== REGISTER ======
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
      const res = await fetch(api + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await res.json();
      document.getElementById("registerMessage").innerText =
        data.message || "Registration completed.";

      if (data.message && data.message.includes("successful")) {
        setTimeout(() => (window.location.href = "login.html"), 1500);
      }
    } catch (err) {
      document.getElementById("registerMessage").innerText =
        "Server error: " + err.message;
    }
  });
}

// ====== LOGIN ======
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
      const res = await fetch(api + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.message && data.message.includes("Login successful")) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "welcome.html";
      } else {
        document.getElementById("loginMessage").innerText =
          data.message || "Login failed.";
      }
    } catch (err) {
      document.getElementById("loginMessage").innerText =
        "Server error: " + err.message;
    }
  });
}
