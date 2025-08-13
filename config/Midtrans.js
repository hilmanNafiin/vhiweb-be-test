const midtransClient = require("midtrans-client");
const { MIDTRANS_IS_PRODUCTION, MIDTRANS_SERVER, MIDTRANS_CLIENT } =
  process.env;

exports.midtransConfigCoreAPI = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: MIDTRANS_SERVER,
  clientKey: MIDTRANS_CLIENT,
});
