
const api = "https://obasecash-api.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));

// Redirect if user not logged in
if (!user) {
  alert("Please log in first.");
  window.location.href = "index.html";
}

// Display user info
document.getElementById("accNumber").textContent = user.account_number || "N/A";

// Load account balance
async function loadBalance() {
  const res = await fetch(`${api}/balance/${user.account_number}`);
  const data = await res.json();
  document.getElementById("accBalance").textContent =
    data.balance !== undefined ? `$${data.balance.toFixed(2)}` : "$0.00";
}

// Load transactions
async function loadTransactions() {
  const res = await fetch(`${api}/transactions/${user.account_number}`);
  const data = await res.json();
  const list = document.getElementById("transactionsList");

  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = "<li>No recent transactions</li>";
    return;
  }

  data.forEach((tx) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${tx.from_account === user.account_number ? "Sent" : "Received"}</strong> 
      $${tx.amount} 
      <em>(${tx.date})</em>
      → ${tx.to_account}
    `;
    list.appendChild(item);
  });
}

// Handle transfer form
document.getElementById("quickTransferForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const to_account = document.getElementById("toAccount").value;
  const amount = parseFloat(document.getElementById("transferAmount").value);

  const res = await fetch(`${api}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from_account: user.account_number,
      to_account,
      amount,
    }),
  });

  const data = await res.json();
  document.getElementById("transferMessage").textContent = data.message;
  loadBalance();
  loadTransactions();
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "index.html";
});

// Load data on page start
loadBalance();
loadTransactions();
