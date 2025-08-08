const Joi = require("joi");

exports.createValidation = (req) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user_id: Joi.number().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
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
exports.updateValidation = (req) => {
  const schema = Joi.object({
    vendor_id: Joi.number().required(),
    user_id: Joi.number().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
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
