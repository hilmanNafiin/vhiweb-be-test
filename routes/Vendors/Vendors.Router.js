const express = require("express");

const router = express.Router();
const { VendorsController } = require("../../app/");

router.post("/", VendorsController.createController);
router.patch("/", VendorsController.updateController);
router.get("/private", VendorsController.getOneController);

module.exports = router;
