const express = require("express");

const router = express.Router();
const auth = require("./Auth");
const products = require("./Products");
const vendors = require("./Vendors");
const Transactions = require("./Transactions");

router.use("/auth", auth);
router.use("/products", products);
router.use("/vendors", vendors);
router.use("/transactions", Transactions);

module.exports = router;
