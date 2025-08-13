const moment = require("moment");
const momenttz = require("moment-timezone");
exports.dateTimeNow = () => {
  let date = momenttz(new Date())
    .tz("Asia/Jakarta")
    .format("YYYY-MM-DD HH:mm:ss ZZ");
  return date;
};

exports.dateTimeAdd = (number, type) => {
  const date = momenttz(new Date())
    .tz("Asia/Jakarta")
    .add(number.toString(), type)
    .format("YYYY-MM-DD HH:mm:ss ZZ");
  return date;
};
