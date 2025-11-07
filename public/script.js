
const api = "https://obasecash-api.onrender.com/api";

// Create Account
document.getElementById("createAccountForm").addEventListener("submit", async e => {
  e.preventDefault();
  const userId = document.getElementById("userId").value;
  const currency = document.getElementById("currency").value;
  const res = await fetch(`${apiBase}/accounts/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, currency })
  });
  const data = await res.json();
  alert(data.message || "Account created");
});

// Deposit
document.getElementById("depositForm").addEventListener("submit", async e => {
  e.preventDefault();
  const accountNumber = document.getElementById("accountNumber").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const res = await fetch(`${apiBase}/accounts/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountNumber, amount })
  });
  const data = await res.json();
  alert(data.message || "Deposit complete");
});

// Check Balance
document.getElementById("balanceForm").addEventListener("submit", async e => {
  e.preventDefault();
  const acc = document.getElementById("balanceAccountNumber").value;
  const res = await fetch(`${apiBase}/accounts/balance/${acc}`);
  const data = await res.json();
  document.getElementById("balanceResult").innerText = 
    data.balance ? `Balance: ${data.balance} ${data.currency}` : data.message;
});

// Transfer
document.getElementById("transferForm").addEventListener("submit", async e => {
  e.preventDefault();
  const fromAccount = document.getElementById("fromAccount").value;
  const toAccount = document.getElementById("toAccount").value;
  const amount = parseFloat(document.getElementById("transferAmount").value);
  const res = await fetch(`${apiBase}/transfers/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromAccount, toAccount, amount })
  });
  const data = await res.json();
  document.getElementById("transferResult").innerText =
    data.message || "Transfer complete";
});
