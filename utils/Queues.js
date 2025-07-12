const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis("redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

// ✅ Export Queue instance langsung (singleton)
const productImportQueue = new Queue("product-import-queue", { connection });

module.exports = productImportQueue;
