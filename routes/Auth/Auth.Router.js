const express = require("express");

const router = express.Router();
const { AuthController } = require("../../app/");

router.post("/login", AuthController.loginController);
router.post("/register", AuthController.registerController);

module.exports = router;
