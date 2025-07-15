const Order = require("../../models/Order");
const User = require("../../models/User");

exports.getOrdersWithUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    const orders = await Order.find().lean();

    const ordersByUserId = orders.reduce((acc, order) => {
      const userIdStr = order.userId.toString();
      acc[userIdStr] = acc[userIdStr] || [];
      acc[userIdStr].push(order);
      return acc;
    }, {});

    const data = users.map((user) => {
      const userIdStr = user._id.toString();
      return {
        userId: user._id,
        username: user.username,
        email: user.email,
        mobilenumber: user.mobilenumber,
        orders: (ordersByUserId[userIdStr] || []).map((order) => ({
          orderId: order._id,
          date: order.date,
          items: order.items,
        })),
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
