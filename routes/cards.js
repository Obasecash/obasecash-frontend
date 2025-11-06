const express = require('express');
const router = express.Router();
const Card = require('../models/cardModel');

// Get all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new card
router.post('/', async (req, res) => {
  const card = new Card({
    userId: req.body.userId,
    accountId: req.body.accountId,
    cardNumber: req.body.cardNumber,
    cardType: req.body.cardType || 'debit',
    expiryDate: req.body.expiryDate,
    cvv: req.body.cvv
  });
  try {
    const newCard = await card.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a card by ID
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
