const { VendorsRepository, UsersRepository } = require("../../repository");

const {
  Hash: { PasswordEncrypt, PasswordCompare },
  Uuid: { uuids },
  JWT: { JWTGenerate, JWTRefreshGenerate },
} = require("../../utils");

class VendorsService {
  async createVendor(params) {
    try {
      const account = await UsersRepository.getOneRepository({
        id: params.user_id,
        deleted_at: null,
      });

      if (!account.status) return this.fail(null, "This account is unknown");
      return await VendorsRepository.createRepository({
        ...params,
        created_by: params.user_id,
      });
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

module.exports = new VendorsService();
