const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminController");

router.get("/orders-with-users", adminController.getOrdersWithUsers);

module.exports = router;
