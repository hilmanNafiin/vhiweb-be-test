const { SendWhatsApp } = require("../api/Fonte");

exports.SendSettlement = (params) => {
  const sendMessage = {
    messages: `
    Hallo ${params.name} ,
    Pembayaran Anda telah dikonfirmasi.

    Data Transaksi :

    NO VA : ${params.va_number}
    INV : ${params.inv_code}
    Jumlah : ${params.amount}
    Status : "*Success*"
    Metode Pembayaran : ${params.payment_type}

    Terimakasih telah melakukan pembayaran.
  `,
    phone: params.phone,
  };
  return SendWhatsApp(sendMessage);
};
exports.SendPending = (params) => {
  console.log(params, "pending");
  const sendMessage = {
    messages: `
    Hallo ${params.name} ,

    Pembayaran Anda masih dalam proses.
    batas waktu pembayaran anda adalah ${params.expire_at}

    Data Transaksi :
    NO VA : ${params.va_number}
    INV : ${params.inv_code}
    Jumlah : ${params.amount}
    Status : *Pending*
    Metode Pembayaran : ${params.payment_type}



    Terimakasih telah melakukan pembayaran.

  `,
    phone: params.phone,
  };
  return SendWhatsApp(sendMessage);
};
exports.SendExpire = (params) => {
  const sendMessage = {
    messages: `
    Hallo ${params.name} ,

    Pembayaran Anda telah di batalkan.

    Data Transaksi :
    NO VA : ${params.va_number}
    INV : ${params.inv_code}
    Jumlah : ${params.amount}
    Status : *Expire*
    Metode Pembayaran : ${params.payment_type}


    Terimakasih telah melakukan Checkout.
  `,
    phone: params.phone,
  };
  return SendWhatsApp(sendMessage);
};
