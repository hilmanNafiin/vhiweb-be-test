const express = require("express");
const { JWT } = require("../../middleware");

const router = express.Router();

router.use("/", require("./Transactions.Router"));

module.exports = router;
