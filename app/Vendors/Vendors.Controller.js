const {
  OutParser: { OutSuccess, OutFailed },
} = require("../../utils");
const { VendorsValidation } = require("./Validation");
const { VendorsService } = require("../../service");
class VendorsController {
  async createController(req, res) {
    try {
      const validate = VendorsValidation.createValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await VendorsService.createVendor(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));
      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      res.send(OutFailed(e, e.message));
    }
  }
}

module.exports = new VendorsController();
