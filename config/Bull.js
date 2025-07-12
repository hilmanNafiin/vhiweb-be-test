const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { handleProductImport } = require("../worker/Products.Worker");

const connection = new IORedis(process.env.REDISHOST, {
  maxRetriesPerRequest: null,
});

const worker = new Worker("product-import-queue", handleProductImport, {
  connection,
});

console.log("BullMQ Worker for product-import-queue is running.");

module.exports = worker;
