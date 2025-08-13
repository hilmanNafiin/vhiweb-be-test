const _ = require("../../config/DB");

class ProductsRepository {
  async getRepository({ search, size, page, vendor_id }) {
    try {
      const response = await _.select(
        _.raw("count(*) over() AS total_data"),
        "p.id",
        "v.name as vendor_name",
        "p.vendor_id",
        "p.name",
        "p.description",
        "p.price",
        "p.stock",
        "p.created_at"
      )
        .from("products as p")
        .join("vendors as v", "v.id", "p.vendor_id")
        .where((qb) => {
          if (vendor_id) {
            qb.where("p.vendor_id", vendor_id);
          }
          if (search) {
            qb.where("p.name", "ilike", `%${search}%`).orWhere(
              "v.name",
              "ilike",
              `%${search}%`
            );
          }
        })
        .whereNull("p.deleted_at")
        .orderBy("p.created_at", "desc")
        .limit(size)
        .offset(page);

      return this.success(response, "Products fetched successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getUsersRepository({ search, size, page }) {
    try {
      const response = await _.select(
        _.raw("count(*) over() AS total_data"),
        "p.id",
        "v.name as vendor_name",
        "p.vendor_id",
        "p.name",
        "p.description",
        "p.price",
        "p.stock",
        "p.created_at"
      )
        .from("products as p")
        .join("vendors as v", "v.id", "p.vendor_id")
        .where((qb) => {
          if (search) {
            qb.where("p.name", "ilike", `%${search}%`).orWhere(
              "v.name",
              "ilike",
              `%${search}%`
            );
          }
        })
        .whereNull("p.deleted_at")
        .orderBy("p.created_at", "desc")
        .limit(size)
        .offset(page);

      return this.success(response, "Products fetched successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async getOneRepository(params) {
    try {
      const response = await _.from("products").where(params).first();

      if (!response) return this.fail(null, "Products not found");

      return this.success(response, "Products fetched successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOmsetByVendorRepository(params) {
    try {
      const response = await _.select(
        _.raw("coalesce(sum(price * stock), 0) as total")
      )
        .from("products")
        .where(params)
        .whereNull("deleted_at");

      if (!response) return this.fail(null, "Products not found");

      return this.success(response[0], "Products fetched successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async createRepository(params) {
    console.log(params);
    try {
      const result = await _.insert(params).into("products");

      if (result) return this.success(null, "Products created successfully");

      return this.fail(null, "Failed to create Products");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async updateRepository(params, condition) {
    try {
      const result = await _.from("products").where(condition).update(params);
      if (result > 0)
        return this.success(null, "Products updated successfully");

      return this.fail(null, "Products update failed");
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

module.exports = new ProductsRepository();
