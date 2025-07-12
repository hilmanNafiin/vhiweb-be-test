const express = require("express");

const router = express.Router();
const { VendorsController } = require("../../app/");

router.post("/", VendorsController.createController);

module.exports = router;
