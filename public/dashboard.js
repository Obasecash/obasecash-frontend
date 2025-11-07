// dashboard.js
// Handles user dashboard actions (balance, transactions, transfers)

console.log("✅ dashboard.js loaded with API:", API_BASE_URL);

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  alert("⚠️ Please log in first.");
  window.location.href = "index.html";
}

document.getElementById("userName").innerText = user.fullname;
document.getElementById("accNumber").innerText = user.account_number;

// ===== LOAD BALANCE =====
async function loadBalance() {
  try {
    const res = await fetch(apiEndpoint(`/accounts/balance/${user.account_number}`));
    const data = await res.json();

    if (res.ok && data.balance !== undefined) {
      document.getElementById("balance").innerText = data.balance.toFixed(2);
      document.getElementById("currency").innerText = data.currency || "USD";
    } else {
      alert("⚠️ Failed to load balance.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error loading balance: " + err.message);
  }
}

// ===== LOAD TRANSACTIONS =====
async function loadTransactions() {
  try {
    const res = await fetch(apiEndpoint(`/transactions/${user.account_number}`));
    const txs = await res.json();

    const history = document.getElementById("history");
    history.innerHTML = "";

    if (txs.length === 0) {
      history.innerHTML = "<tr><td colspan='4'>No transactions yet.</td></tr>";
    } else {
      txs.forEach((tx) => {
        const row = `<tr>
          <td>${tx.from}</td>
          <td>${tx.to}</td>
          <td>${tx.amount}</td>
          <td>${new Date(tx.date).toLocaleString()}</td>
        </tr>`;
        history.innerHTML += row;
      });
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error loading transactions: " + err.message);
  }
}

// ===== TRANSFER FUNDS =====
const transferForm = document.getElementById("transferForm");
if (transferForm) {
  transferForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const to = document.getElementById("toAccount").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);

    if (!to || !amount) {
      alert("⚠️ Please fill all transfer fields.");
      return;
    }

    try {
      const res = await fetch(apiEndpoint("/transactions/transfer"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: user.account_number,
          to,
          amount,
        }),
      });

      const data = await res.json();
      alert(data.message || "Transfer complete.");
      loadBalance();
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    }
  });
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("user");
  alert("✅ Logged out successfully.");
  window.location.href = "index.html";
}

// Auto-load when page opens
window.onload = () => {
  loadBalance();
  loadTransactions();
};
