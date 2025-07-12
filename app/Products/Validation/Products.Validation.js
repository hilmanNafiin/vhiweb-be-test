const Joi = require("joi");

exports.listProductsValidation = (req) => {
  const schema = Joi.object({
    size: Joi.number().required(),
    page: Joi.number().required(),
    search: Joi.string().allow("", null),
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
exports.createProductsValidation = (req) => {
  const schema = Joi.object({
    vendor_id: Joi.number().required(),
    user_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
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
exports.updateProductsValidation = (req) => {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    user_id: Joi.number().required(),
    vendor_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
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
exports.deleteProductsValidation = (req) => {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    user_id: Joi.number().required(),
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
