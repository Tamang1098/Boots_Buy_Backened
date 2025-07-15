const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");

exports.placeOrder = async (req, res) => {
  let { userId, items } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ message: "userId and items are required" });
  }

  try {
    userId = new mongoose.Types.ObjectId(userId);
    const order = new Order({ userId, items });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to get orders", error: err.message });
  }
};

exports.getOrdersWithUsers = async (req, res) => {
  try {
    const users = await User.find();

    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ userId: user._id });
                console.log(`Orders for user ${user.username}:`, orders);
        return {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            mobileNumber: user.mobileNumber,
          },
          orders,
        };
      })
    );

    res.status(200).json(usersWithOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders with users", error: err.message });
  }
};
