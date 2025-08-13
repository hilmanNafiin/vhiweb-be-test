const Joi = require("joi");

exports.createValidation = (req) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.number().required(),
    product_id: Joi.number().required(),
    quantity: Joi.number().required(),
    bank_value: Joi.string().required(),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
exports.listValidation = (req) => {
  const schema = Joi.object({
    size: Joi.number().required(),
    page: Joi.number().required(),
    vendor_id: Joi.number().required(),
    search: Joi.string().allow("", null),
    status: Joi.number().allow("", null),
  });
  const validate = schema.validate(req);
  if (validate.error)
    return {
      status: false,
      code: 201,
      data: null,
      messages: validate.error.message,
    };
  return { status: true };
};
