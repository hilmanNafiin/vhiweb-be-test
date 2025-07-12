const express = require("express");
const { JWT } = require("../../middleware");

const router = express.Router();

router.use("/", JWT.JWTVerify, require("./Vendors.Router"));

module.exports = router;
