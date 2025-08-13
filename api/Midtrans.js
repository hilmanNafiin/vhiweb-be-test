const { midtransConfigCoreAPI } = require("../config/Midtrans");
const { MIDTRANS_EXPIRE_DURATION, MIDTRANS_EXPIRE_UNIT } = process.env;

const configuratePaymentType = ({ bank_value }) => {
  if (bank_value === "mandiri") {
    return {
      payment_type: "echannel",
      echannel: {
        bill_info1: "Payment:",
        bill_info2: "Online purchase",
      },
    };
  } else if (bank_value === "permata") {
    return {
      payment_type: "permata",
    };
  } else if (bank_value === "gopay") {
    return {
      payment_type: "qris",
    };
  } else {
    return {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: bank_value,
      },
    };
  }
};

exports.MidtransAPI = async (params) => {
  const paymentConfig = configuratePaymentType(params);

  const custom_expiry = {
    order_time: params.start_time,
    unit: MIDTRANS_EXPIRE_UNIT,
    expiry_duration: MIDTRANS_EXPIRE_DURATION,
  };
  delete params.start_time;
  console.log(custom_expiry);

  let parameters = { ...params, ...paymentConfig, custom_expiry };
  // return;
  let response = await midtransConfigCoreAPI.charge(parameters);
  let data;
  if (params.bank_value === "permata" && response.status_code === "201") {
    data = {
      status_code: 201,
      order_id: response.order_id,
      gross_amount: response.gross_amount,
      currency: "IDR",
      payment_type: "bank_transfer",
      transaction_time: response.transaction_time,
      transaction_status: "pending",
      fraud_status: "accept",
      va_numbers: [
        {
          bank: params.bank_value,
          va_number: response.permata_va_number,
        },
      ],
      expiry_time: response.expiry_time,
    };
  } else if (
    params.bank_value === "mandiri" &&
    response.status_code === "201"
  ) {
    data = {
      status_code: 201,
      order_id: response.order_id,
      gross_amount: response.gross_amount,
      currency: "IDR",
      payment_type: "bank_transfer",
      transaction_time: response.transaction_time,
      transaction_status: "pending",
      fraud_status: "accept",
      va_numbers: [
        {
          bank: params.bank_value,
          bill_key: response.bill_key,
          biller_code: response.biller_code,
        },
      ],
      expiry_time: response.expiry_time,
    };
  } else if (params.bank_value === "bni" && response.status_code === "201") {
    data = response;
  } else if (params.bank_value === "bca" && response.status_code === "201") {
    data = response;
  } else {
    data = response;
  }
  return data;
};
