const express = require("express");
const {
  UploadFile: { MulterBucket },
} = require("../../utils");
const router = express.Router();
const { ProductsController } = require("../../app/");

router.get("/", ProductsController.listProductsUsersController);
router.post(
  "/import",
  MulterBucket(`products-shopping/${Date.now()}`).single("file"),
  ProductsController.uploadProductsController
);
router.post("/", ProductsController.createProductsController);
router.patch("/", ProductsController.updateProductsController);
router.delete("/", ProductsController.deleteProductsController);

module.exports = router;
