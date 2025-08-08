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
  async updateVendor(params) {
    try {
      const account = await UsersRepository.getOneRepository({
        id: params.user_id,
        deleted_at: null,
      });

      if (!account.status) return this.fail(null, "This account is unknown");
      return await VendorsRepository.updateRepository(
        {
          user_id: params.user_id,
          name: params.name,
          address: params.address,
          phone: params.phone,
          updated_by: params.user_id,
          updated_at: new Date(),
        },
        { id: params.vendor_id }
      );
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOneVendor(params) {
    try {
      console.log({
        user_id: params.id,
        deleted_at: null,
      });
      const myVendor = await VendorsRepository.getOneRepository({
        user_id: params.id,
        deleted_at: null,
      });

      if (!myVendor.status) myVendor;
      return myVendor;
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
