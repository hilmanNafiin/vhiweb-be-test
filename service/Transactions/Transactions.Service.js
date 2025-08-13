const {
  SendWhatsApp: { SendExpire, SendSettlement, SendPending },
} = require("../../template");
const { midtransConfigCoreAPI } = require("../../config/Midtrans");
const { MidtransAPI } = require("../../api/Midtrans");
const {
  TransactionsRepository,
  TransactionsDetailsRepository,
  ProductsRepository,
  TransactionsPaymentsRepository,
} = require("../../repository");
const { CustomersRepository } = require("../../repository/Customers");
const {
  Hash: { PasswordEncrypt, PasswordCompare },
  Uuid: { uuids },
  Inv: { InvGenerate },
} = require("../../utils");
const { dateTimeNow, dateTimeAdd } = require("../../utils/Moment");
const { PaginationsGenerate } = require("../../utils/Paginate");
const { MIDTRANS_EXPIRE_DURATION, MIDTRANS_EXPIRE_UNIT } = process.env;
class TransactionsService {
  async createTransactions(params) {
    try {
      const customer = await CustomersRepository.getOneRepository({
        phone: params.phone,
      });
      const product = await ProductsRepository.getOneRepository({
        id: params.product_id,
      });

      if (!product.status) return this.fail(null, "Product not found");
      //   create table customers
      if (!customer.status)
        await CustomersRepository.createCustomersRepository({
          name: params.name,
          phone: params.phone,
          type: 0,
          created_at: new Date(),
        });

      const ID = uuids();
      const inv_code = InvGenerate();
      const { price, stock } = product.response;
      const gross_amount = price * parseInt(params.quantity) + 4440;

      const customerNew = await CustomersRepository.getOneRepository({
        phone: params.phone,
      });
      // parameter midtrans
      let paramsMidtrans = {
        transaction_details: {
          order_id: ID,
          gross_amount,
        },
        bank_value: params.bank_value,
        start_time: dateTimeNow(),
      };
      // create table transactions
      await TransactionsRepository.createRepository({
        id: ID,
        name: params.name,
        phone: params.phone,
        inv_code: inv_code,
        user_id: customerNew.response.id,
        status: 0,
        expire_at: dateTimeAdd(MIDTRANS_EXPIRE_DURATION, MIDTRANS_EXPIRE_UNIT),
        created_at: new Date(),
      });
      // create transactionsdetail
      await TransactionsDetailsRepository.createRepository([
        {
          transaction_id: ID,
          price: 4440,
          total: 4440,
          name: "Admin Bank",
          created_at: new Date(),
        },
        {
          transaction_id: ID,
          price: price,
          total: price * parseInt(params.quantity),
          product_id: params.product_id,
          quantity: params.quantity,
          created_at: new Date(),
        },
      ]);

      const checkout = await MidtransAPI(paramsMidtrans);
      if (Number(checkout.status_code) !== 201)
        return this.fail(checkout, "There is something wrong Payment Gateway");

      // create transactionspayments
      await TransactionsPaymentsRepository.createRepository({
        transaction_id: ID,
        bank_value: params.bank_value,
        va_number:
          checkout?.permata_va_number ||
          checkout?.va_numbers?.[0]?.va_number ||
          null,
        va_status: checkout.transaction_status,
        va_fraud: checkout.fraud_status,
        data: checkout,
        amount: gross_amount,
        type: 0,
        status: 0,
        active: true,
        created_at: dateTimeNow(),
      });

      return this.success(checkout, "Transaction created successfully");
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async callbackTransactions(params) {
    try {
      console.log(params);
      const statusResponse =
        await midtransConfigCoreAPI.transaction.notification(params);

      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;
      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );
      const getTransaction = await TransactionsRepository.getOneRepository({
        id: orderId,
      });
      // console.log(getTransaction, "getTransaction");

      if (!getTransaction.status)
        return this.fail(null, "Transaction not found");

      if (transactionStatus == "settlement") {
        await this.onSettlement(statusResponse);
      } else if (transactionStatus == "expire") {
        await this.onExpire(statusResponse);
      } else if (transactionStatus == "pending") {
        await this.onPending(statusResponse);
      }
      return this.success(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`,
        "Callback Midtrans"
      );
    } catch (e) {
      return this.fail(e, e.message);
    }
  }
  async onSettlement(statusResponse) {
    const getTransaction = await TransactionsRepository.getOneRepository({
      id: statusResponse.order_id,
    });
    if (!getTransaction.status) return this.fail(null, "Transaction not found");
    const getTransactionPayment =
      await TransactionsPaymentsRepository.getOneRepository({
        transaction_id: statusResponse.order_id,
      });
    const getTransactionDetail =
      await TransactionsDetailsRepository.getOneProductRepository({
        transaction_id: statusResponse.order_id,
      });
    console.log(getTransactionDetail);
    const product = await ProductsRepository.getOneRepository({
      id: getTransactionDetail.response.product_id,
    });
    const { stock, id: product_id } = product.response;
    // update product quantity
    await ProductsRepository.updateRepository(
      { stock: stock - parseInt(getTransactionDetail.response.quantity) },
      { id: product_id }
    );
    // update settlement transaction
    await TransactionsRepository.updateRepository(
      { status: 1 }, // 1 = success paid
      { id: statusResponse.order_id }
    );
    // update settlement transaction
    await TransactionsPaymentsRepository.updateRepository(
      { va_status: "settlement" }, // success paid
      { transaction_id: statusResponse.order_id }
    );

    // blast notification WhatsApp
    SendSettlement({
      name: getTransaction.response.name,
      phone: getTransaction.response.phone,
      va_number: statusResponse.va_numbers[0].va_number,
      inv_code: getTransaction.response.inv_code,
      amount: getTransactionPayment.response.amount,
      payment_type: getTransactionPayment.response.bank_value,
    });
  }
  async onPending(statusResponse) {
    console.log(statusResponse, "pending");
    const getTransaction = await TransactionsRepository.getOneRepository({
      id: statusResponse.order_id,
    });
    console.log(getTransaction, "okw");
    if (!getTransaction.status) return this.fail(null, "Transaction not found");
    const getTransactionPayment =
      await TransactionsPaymentsRepository.getOneRepository({
        transaction_id: statusResponse.order_id,
      });
    console.log(getTransactionPayment, "pending");
    await SendPending({
      name: getTransaction.response.name,
      phone: getTransaction.response.phone,
      va_number: statusResponse.va_numbers[0].va_number,
      inv_code: getTransaction.response.inv_code,
      amount: getTransactionPayment.response.amount,
      payment_type: getTransactionPayment.response.bank_value,
      expire_at: getTransaction.response.expire_at,
    });
  }
  async onExpire(statusResponse) {
    const getTransaction = await TransactionsRepository.getOneRepository({
      id: statusResponse.order_id,
    });
    if (!getTransaction.status) return this.fail(null, "Transaction not found");
    const getTransactionPayment =
      await TransactionsPaymentsRepository.getOneRepository({
        transaction_id: statusResponse.order_id,
      });
    SendExpire({
      name: getTransaction.response.name,
      phone: getTransaction.response.phone,
      va_number: statusResponse.va_numbers[0].va_number,
      inv_code: getTransaction.response.inv_code,
      amount: getTransactionPayment.response.amount,
      payment_type: getTransactionPayment.response.bank_value,
    });

    await TransactionsRepository.updateRepository(
      { status: 2 }, // 2 = expired
      { id: statusResponse.order_id }
    );
    await TransactionsPaymentsRepository.updateRepository(
      { va_status: "expire" }, // expire trx
      { transaction_id: statusResponse.order_id }
    );
  }
  async listTransactions(params) {
    try {
      const paginate = PaginationsGenerate(params);
      const response = await TransactionsRepository.listRepository(paginate);
      if (!response.status) return this.fail(null, "Data not found");
      return this.success(response.response, response.messages);
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

module.exports = new TransactionsService();
