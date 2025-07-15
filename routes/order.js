const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/orders", orderController.placeOrder);
router.get("/orders/:userId", orderController.getUserOrders);
router.get("/admin/orders-with-users", orderController.getOrdersWithUsers);

module.exports = router;
