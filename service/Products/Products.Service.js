const {
  UsersRepository,
  VendorsRepository,
  ImportJob,
} = require("../../repository");
const { Auth, AccountType } = require("../../enum");
const {
  Hash: { PasswordEncrypt, PasswordCompare },
  Uuid: { uuids },
  JWT: { JWTGenerate, JWTRefreshGenerate },
  Paginate: { PaginationsGenerate },
  UploadFile: { getFileFromS3 },
  Queues,
} = require("../../utils");
const { ProductsRepository } = require("../../repository");

class ProductsService {
  async listProductsService(params) {
    try {
      const paginate = PaginationsGenerate(params);
      const vendor = await VendorsRepository.getOneRepository({
        user_id: params.id,
        deleted_at: null,
      });

      if (!vendor.status)
        return this.fail(null, "This vendor or account is unknow");
      paginate.vendor_id = vendor.response.id;
      const omset = await ProductsRepository.getOmsetByVendorRepository({
        vendor_id: vendor.response.id,
      });

      const products = await ProductsRepository.getRepository(paginate);
      return this.success(
        {
          products: products.response,
          omset: omset.response.total,
        },
        "Products fetched successfully"
      );
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async createProductsService(params) {
    try {
      console.log(params);
      const vendor = await VendorsRepository.getOneRepository({
        id: params.vendor_id,
        user_id: params.user_id,
        deleted_at: null,
      });

      if (!vendor.status)
        return this.fail(null, "This vendor or account is unknow");
      delete params.user_id;

      return await ProductsRepository.createRepository({
        ...params,
        created_by: vendor.response.user_id,
      });
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async uploadProductsService(params) {
    try {
      if (!params.bucket || !params.key) {
        throw new Error("Bucket and key are required.");
      }

      const fileBuffer = await getFileFromS3(params.bucket, params.key);
      const jobId = uuids();
      await ImportJob.createRepository({
        id: jobId,
        filename: params.key,
        status: "processing",
      });
      await Queues.add("product-import-queue", {
        buffer: fileBuffer.toString("utf-8"),
        source: "s3",
        filename: params.key,
        jobId,
      });

      return {
        status: true,
        messages: "Import job successfully added to queue.",
        response: { jobId },
      };
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async updateProductsService(params) {
    try {
      const vendor = await VendorsRepository.getOneRepository({
        id: params.vendor_id,
        user_id: params.user_id,
        deleted_at: null,
      });
      if (!vendor.status)
        return this.fail(null, "This vendor or account not found");

      const productID = params.product_id;

      delete params.product_id;
      delete params.user_id;

      return await ProductsRepository.updateRepository(
        {
          ...params,
          updated_by: vendor.response.user_id,
          updated_at: new Date(),
        },
        {
          id: productID,
        }
      );
    } catch (e) {
      return this.fail(e, e.message);
    }
  }

  async deleteProductsService(params) {
    try {
      // check account
      const account = await UsersRepository.getOneRepository({
        id: params.id,
        deleted_at: null,
      });

      if (!account.status) return this.fail(null, "This account is unknown");
      // check product
      const product = await ProductsRepository.getOneRepository({
        id: params.product_id,
      });
      if (!product.status) return this.success(null, "Product not found");

      await ProductsRepository.updateRepository(
        { deleted_at: new Date(), deleted_by: params.id },
        { id: params.product_id }
      ); // soft delete = update `deleted_at`
      return this.success(null, "Product deleted successfully");
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

module.exports = new ProductsService();
