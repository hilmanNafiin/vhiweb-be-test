const { randomUUID } = require("crypto");

exports.InvGenerate = () => {
  return `inv-${randomUUID()}`;
};
