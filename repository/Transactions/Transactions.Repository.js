const _ = require("../../config/DB");

class TransactionsRepository {
  async getOneRepository(params) {
    try {
      const response = await _.from("transactions").where(params).first();

      if (!response) return this.fail(null, "Data not found");

      return this.success(response, "Data fetched successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async listRepository({ search, size, page, status, vendor_id }) {
    try {
      const response = await _.select(
        "t.id",
        "tp.amount",
        "t.status",
        "t.name as customer_name",
        "t.phone as customer_phone",
        "t.inv_code",
        "p.name as product_name",
        "td.quantity",
        "td.price",
        "tp.bank_value",
        "tp.va_status",
        "td.total",
        "t.created_at",
        _.raw("count(*) over() AS total_data")
      )
        .from("transactions as t")
        .join("transactionspayments as tp", "t.id", "tp.transaction_id")
        .join("transactionsdetails as td", "t.id", "td.transaction_id")
        .join("products as p", "p.id", "td.product_id")
        .join("vendors as v", "v.id", "p.vendor_id")
        .whereNotNull("td.product_id")
        .where("v.id", vendor_id)
        .where((qb) => {
          if (status) {
            qb.where("t.status", parseInt(status));
          }
          if (search) {
            qb.where("t.name", "ilike", `%${search}%`).orWhere(
              "t.phone",
              "ilike",
              `%${search}%`
            );
          }
        })
        .limit(size)
        .offset(page);

      if (!response) return this.fail(null, "Data not found");

      return this.success(response, "Data fetched successfully");
    } catch (e) {
      console.log(e);
      return this.fail(e, e.message);
    }
  }

  async createRepository(params) {
    try {
      const result = await _.insert(params).into("transactions");

      if (result) return this.success(null, "Data created successfully");

      return this.fail(null, "Failed to create Data");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async getOmsetByProductIDRepository(params) {
    try {
      const response = await _.select(
        _.raw("coalesce(sum(td.total), 0) as total")
      )
        .from("transactions as t")
        .join("transactionspayments as tp", "t.id", "tp.transaction_id")
        .join("transactionsdetails as td", "t.id", "td.transaction_id")
        .join("products as p", "p.id", "td.product_id")
        .join("vendors as v", "v.id", "p.vendor_id")
        .whereNotNull("td.product_id")
        .where("t.status", 1) // success
        .where("v.id", params.vendor_id);

      if (!response) return this.fail(null, "Products not found");

      return this.success(response[0], "Products fetched successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async updateRepository(params, condition) {
    try {
      const result = await _.from("transactions")
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

module.exports = new TransactionsRepository();
