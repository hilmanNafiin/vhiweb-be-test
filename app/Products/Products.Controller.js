const {
  OutParser: { OutSuccess, OutFailed },
} = require("../../utils");
const { ProductsValidation } = require("./Validation");
const { ProductsService } = require("../../service");
class ProductsController {
  async listProductsController(req, res) {
    try {
      const validate = ProductsValidation.listProductsValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ProductsService.listProductsService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }

  async createProductsController(req, res) {
    try {
      const validate = ProductsValidation.createProductsValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ProductsService.createProductsService(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }

  async uploadProductsController(req, res) {
    try {
      const response = await ProductsService.uploadProductsService(req.file);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }

  async updateProductsController(req, res) {
    try {
      const validate = ProductsValidation.updateProductsValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ProductsService.updateProductsService(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }

  async deleteProductsController(req, res) {
    try {
      const validate = ProductsValidation.deleteProductsValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await ProductsService.deleteProductsService(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));

      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
}

module.exports = new ProductsController();
