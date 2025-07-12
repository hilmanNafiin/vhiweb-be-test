const _ = require("../../config/DB");

class ImportLog {
  async getOneRepository(params) {
    try {
      const response = await _.from("import_logs").where(params).first();

      if (!response) return this.fail(null, "Data not found");

      return this.success(response, "Data fetched successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async createRepository(params) {
    try {
      const result = await _.insert(params).into("import_logs");

      if (result) return this.success(null, "Data created successfully");

      return this.fail(null, "Failed to create Data");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async updateRepository(params, condition) {
    try {
      const result = await _.from("import_logs")
        .where(condition)
        .update(params);
      if (result > 0) return this.success(null, "Data updated successfully");

      return this.fail(null, "Data update failed");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  // Helper methods
  success(data, message) {
    return { status: true, response: data, messages: message };
  }

  fail(data, message) {
    return { status: false, response: data, messages: message };
  }
}

module.exports = new ImportLog();
