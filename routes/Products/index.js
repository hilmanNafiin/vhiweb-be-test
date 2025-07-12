const express = require("express");
const { JWT } = require("../../middleware");

const router = express.Router();

router.use("/", JWT.JWTVerify, require("./Products.Router"));

module.exports = router;
