const { UsersRepository } = require("../../repository");
const { AccountType } = require("../../enum");
const {
  Hash: { PasswordEncrypt, PasswordCompare },
  Uuid: { uuids },
  JWT: { JWTGenerate, JWTRefreshGenerate },
} = require("../../utils");

class AuthService {
  async loginService(params) {
    try {
      const user = await UsersRepository.getOneRepository({
        email: params.email,
      });

      if (!user.status) return this.fail(null, "This account not registered");

      const passwordMatch = await PasswordCompare(
        params.password,
        user.response.password
      );
      if (!passwordMatch.status)
        return this.fail(null, "Check email or password");

      // Remove sensitive data
      const { password, ...userData } = user.response;

      const accessToken = JWTGenerate({ id: userData.id, data: userData });
      const refreshToken = JWTRefreshGenerate({
        id: userData.id,
        data: userData,
      });

      const response = {
        tokens: `Bearer ${accessToken}`,
        refresh: `Refresh ${refreshToken}`,
      };
      return this.success(response, "Successfully Login");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }

  async registerService(params) {
    try {
      const existing = await UsersRepository.getOneRepository({
        email: params.email,
      });
      if (existing.status)
        return { status: false, messages: "account is already registered" };

      const encryptedPassword = await PasswordEncrypt(params.password);

      const created = await UsersRepository.createUsersRepository({
        name: params.name,
        email: params.email,
        password: encryptedPassword,
        type: AccountType.active,
      });

      if (!created.status) return created;

      let account = created.response;

      delete account.password;

      const accessToken = JWTGenerate({ id: account.id, data: account });
      const refreshToken = JWTRefreshGenerate({
        id: account.id,
        data: account,
      });
      const response = {
        tokens: `Bearer ${accessToken}`,
        refresh: `Refresh ${refreshToken}`,
      };
      return this.success(response, "Successfully Register");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  success(data, message) {
    return { status: true, response: data, messages: message };
  }

  fail(data, message) {
    return { status: false, response: data, messages: message };
  }
}

module.exports = new AuthService();
