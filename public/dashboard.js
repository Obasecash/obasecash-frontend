
const api = "https://obasecash-api.onrender.com/api";
const accountNumber = "ACC-1001"; // Example static account (replace with dynamic login data)

async function loadDashboard() {
  const res = await fetch(`${apiBase}/accounts/balance/${accountNumber}`);
  const data = await res.json();

  if (data.balance) {
    document.getElementById("accNumber").textContent = accountNumber;
    document.getElementById("accBalance").textContent = `${data.balance} ${data.currency}`;
    document.getElementById("accCurrency").textContent = data.currency;
  }

  const txRes = await fetch(`${apiBase}/accounts/transactions/${accountNumber}`);
  const txData = await txRes.json();
  const list = document.getElementById("transactionsList");
  list.innerHTML = "";
  if (txData.length === 0) {
    list.innerHTML = "<li>No transactions yet</li>";
  } else {
    txData.forEach(tx => {
      const li = document.createElement("li");
      li.textContent = `${tx.date} - ${tx.type.toUpperCase()} - ${tx.amount} ${tx.currency}`;
      list.appendChild(li);
    });
  }
}

document.getElementById("quickTransferForm").addEventListener("submit", async e => {
  e.preventDefault();
  const toAccount = document.getElementById("toAccount").value;
  const amount = parseFloat(document.getElementById("transferAmount").value);

  const res = await fetch(`${apiBase}/transfers/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromAccount: accountNumber, toAccount, amount })
  });

  const data = await res.json();
  document.getElementById("transferMessage").innerText = data.message || "Transfer complete!";
  loadDashboard(); // refresh balance
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

loadDashboard();


// ==== AUTO BALANCE REFRESH AFTER PAYMENT ====
async function refreshBalance() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) return;

    const res = await fetch(`/api/balance/${user.email}`);
    const data = await res.json();

    // update balance on dashboard
    const balanceElement = document.getElementById("accBalance");
    if (balanceElement) balanceElement.textContent = `$${data.balance.toFixed(2)}`;
  } catch (err) {
    console.error("Balance refresh failed:", err);
  }
}

// Check balance every 10 seconds
setInterval(refreshBalance, 10000);

