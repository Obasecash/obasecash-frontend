// controllers/transferController.js
const Account = require("../models/accountModel");
const Transaction = require("../models/transactionModel");

exports.transferFunds = async (req, res) => {
  try {
    const { fromAccount, toAccount, amount } = req.body;

    const sender = await Account.findOne({ accountNumber: fromAccount });
    const receiver = await Account.findOne({ accountNumber: toAccount });

    if (!sender || !receiver)
      return res.status(404).json({ message: "Invalid account number(s)" });

    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    sender.balance -= amount;
    receiver.balance += amount;

    const txn = new Transaction({
      fromAccount,
      toAccount,
      amount,
      type: "TRANSFER",
      status: "SUCCESS",
    });
    await txn.save();
    await sender.save();
    await receiver.save();

    res.json({ message: "Transfer successful", transaction: txn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
