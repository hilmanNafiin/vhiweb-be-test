const {
  OutParser: { OutSuccess, OutFailed },
} = require("../../utils");
const { AuthValidation } = require("./Validation");
const { AuthService } = require("../../service");
class AuthController {
  async loginController(req, res) {
    try {
      const validate = AuthValidation.loginValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.loginService(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));
      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
  async registerController(req, res) {
    try {
      const validate = AuthValidation.registerValidation(req.body);
      if (!validate.status)
        return res.send(OutFailed(validate.data, validate.messages));

      const response = await AuthService.registerService(req.body);
      if (!response.status)
        return res.send(OutFailed(response.response, response.messages));
      return res.send(OutSuccess(response.response, response.messages));
    } catch (e) {
      return res.send(OutFailed(e, e.message));
    }
  }
}

module.exports = new AuthController();
