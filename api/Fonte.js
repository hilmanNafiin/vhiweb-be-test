const axios = require("axios");
const { API_FONTE } = process.env;
exports.SendWhatsApp = async (params) => {
  console.log(API_FONTE);
  const config = {
    method: "get",
    url: `https://api.fonnte.com/send`,
    params: {
      token: API_FONTE,
      target: params.phone,
      message: params.messages,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(config);
    return {
      status: true,
      response: { data: response.data },
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: false,
      response: error.response ? error.response.data : error.message,
      messages: error.message,
    };
  }
};
