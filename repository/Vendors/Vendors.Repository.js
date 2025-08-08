const _ = require("../../config/DB");
class VendorsRepository {
  async getOneRepository(params) {
    try {
      const response = await _.select().from("vendors").where(params).first();
      if (response) return this.success(response, "Vendor get successfully");

      return this.fail(null, "Failed to get vendor");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async createRepository(params) {
    try {
      const response = await _.insert(params).into("vendors");
      if (response) return this.success(null, "Vendor created successfully");

      return this.fail(null, "Failed to create vendor");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async updateRepository(params, condition) {
    try {
      const response = await _.update(params).from("vendors").where(condition);
      if (response) return this.success(null, "Vendor Updated successfully");

      return this.fail(null, "Failed to create vendor");
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
module.exports = new VendorsRepository();
