const express = require("express");

const router = express.Router();
const { AuthController } = require("../../app/");
const { JWTVerify } = require("../../middleware/JWT.Middleware");

router.post("/login", AuthController.loginController);
router.post("/register", AuthController.registerController);
router.post("/sesion", JWTVerify, AuthController.sesionController);

module.exports = router;
