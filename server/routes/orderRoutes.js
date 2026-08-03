const express = require("express");
const {
  createOrder,
} = require("../controllers/orderController");
const optionalAuth = require(
  "../middleware/optionalAuthMiddleware"
);

const router = express.Router();

router.post("/", optionalAuth, createOrder);

module.exports = router;