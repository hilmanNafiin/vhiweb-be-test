const csv = require("fast-csv");
const { Readable } = require("stream");
const { ImportJob, ProductsRepository, ImportLog } = require("../repository");
const { Upload } = require("../enum");

exports.handleProductImport = async (job) => {
  const { buffer, filename, jobId } = job.data;

  console.log("Start import:", filename, "Job ID:", jobId);

  let total = 0;
  let success = 0;
  let failed = 0;

  const stream = Readable.from(buffer);

  // Make sure jobId is valid in import_jobs
  const jobExists = await ImportJob.getOneRepository({ id: jobId });
  if (!jobExists) {
    console.error("Job ID tidak ditemukan di import_jobs:", jobId);
    return;
  }

  return new Promise((resolve, reject) => {
    const rows = [];

    // Step 1: Collect all the rows first (so you don't race with async/await)
    csv
      .parseStream(stream, { headers: true })
      .on("error", reject)
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        for (const row of rows) {
          total++;
          try {
            // Validasi minimal
            if (!row.name || !row.price) {
              throw new Error("Missing required fields");
            }
            // Insert to tabel products
            await ProductsRepository.createRepository({
              vendor_id: parseInt(row.vendor_id),
              name: row.name,
              description: row.description,
              price: parseFloat(row.price),
              stock: row.stock ? parseInt(row.stock) : 0,
              created_by: Upload.importProducts,
            });

            success++;
          } catch (e) {
            failed++;

            // Insert log fail
            await ImportLog.createRepository({
              job_id: jobId,
              row_number: total,
              error_message: e.message,
            });
          }
        }

        // Step 2: Update status import_jobs
        await ImportJob.updateRepository(
          {
            status: failed > 0 ? "failed" : "success",
            total_rows: total,
            success_rows: success,
            failed_rows: failed,
            updated_at: new Date(),
          },
          { id: jobId }
        );

        console.log(`Import done to: ${filename}`);
        console.log(
          `✔️ Success: ${success}, ❌ Fail: ${failed}, Total: ${total}`
        );

        resolve();
      });
  });
};
