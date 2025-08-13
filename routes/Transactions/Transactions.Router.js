const express = require("express");

const router = express.Router();
const { TransactionsController } = require("../../app/");
const { JWT } = require("../../middleware");

router.post("/", TransactionsController.createController);
router.get("/", JWT.JWTVerify, TransactionsController.getListController);
router.post("/callback", TransactionsController.callbackController);

module.exports = router;
