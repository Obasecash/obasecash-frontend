// controllers/transferController.js

exports.getAllTransfers = async (req, res) => {
  res.json({ message: "All transfers retrieved successfully" });
};

exports.createTransfer = async (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;
  res.json({
    message: "Transfer created successfully",
    data: { fromAccount, toAccount, amount },
  });
};

