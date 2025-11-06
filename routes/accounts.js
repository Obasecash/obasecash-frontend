// routes/accounts.js
const express = require('express');
const router = express.Router();
const Account = require('../models/accountModel');

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new account
router.post('/', async (req, res) => {
  const account = new Account({
    userId: req.body.userId,
    balance: req.body.balance || 0,
    accountType: req.body.accountType || 'checking',
  });
  try {
    const newAccount = await account.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
