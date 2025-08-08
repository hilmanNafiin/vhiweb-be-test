const jwt = require("jsonwebtoken");

exports.JWTVerify = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (e, decode) => {
        if (e) {
          return res.status(203).json({
            status: false,
            code: 203,
            data: "Sorry you don't have access to this server.",
            messages: "Sorry you must have verified access token this server",
            key: null,
          });
        }
        req.decode = decode;

        next();
      });
    } else {
      return res.status(203).json({
        status: false,
        code: 203,
        data: "Sorry you don't have access to this server.",
        messages: "Sorry you must have verified access token this server",
        key: null,
      });
    }
  } else {
    return res.status(203).json({
      status: false,
      code: 203,
      data: "Sorry you don't have access to this server.",
      messages: "Sorry you must have verified access token this server",
      key: null,
    });
  }
};
