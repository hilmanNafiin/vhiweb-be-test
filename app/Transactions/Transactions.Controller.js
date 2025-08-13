const {
  OutParser: { OutSuccess, OutFailed },
} = require("../../utils");
const { VendorsValidation } = require("./Validation");
const { TransactionsService } = require("../../service");
class TransactionsController {
  async createController(req, res) {
    try {
      const validate = VendorsValidation.createValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await TransactionsService.createTransactions(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));
      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      res.send(OutFailed(e, e.message));
    }
  }
  async getListController(req, res) {
    try {
      const validate = VendorsValidation.listValidation(req.query);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await TransactionsService.listTransactions(req.query);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));
      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      res.send(OutFailed(e, e.message));
    }
  }
  async callbackController(req, res) {
    try {
      const response = await TransactionsService.callbackTransactions(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));
      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      res.send(OutFailed(e, e.message));
    }
  }
}

module.exports = new TransactionsController();
