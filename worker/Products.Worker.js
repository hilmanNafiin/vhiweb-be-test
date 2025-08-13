const csv = require("fast-csv");
const { Readable } = require("stream");
const { ImportJob, ProductsRepository, ImportLog } = require("../repository");
const { Upload } = require("../enum");
const AWS = require("aws-sdk");
const xlsx = require("node-xlsx");
exports.handleProductImport = async (job) => {
  const { buffer, filename, jobId } = job.data;

  console.log("Start import:", filename, "Job ID:", jobId);

  let total = 0;
  let success = 0;
  let failed = 0;

  const stream = Readable.from(buffer.toString("utf-8"));

  // Make sure jobId is valid in import_jobs
  const jobExists = await ImportJob.getOneRepository({ id: jobId });
  if (!jobExists) {
    console.error("Job ID tidak ditemukan di import_jobs:", jobId);
    return;
  }

  if (filename.endsWith(".csv")) {
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
                vendor_id: jobExists.response.vendor_id,
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
  } else {
    var params = {
      Bucket: "bucket-dev-mc",
      Key: jobExists.response.filename,
    };

    const s3 = new AWS.S3({
      endpoint: process.env.AWSURL, // contoh: https://s3.idcloudhost.com
      s3ForcePathStyle: true,
      signatureVersion: "v4",
      region: "us-east-1", // pastikan valid
    });

    var file = s3.getObject(params).createReadStream();
    var buffers = [];

    file.on("data", (chunk) => {
      console.log(`📦 Received chunk of size: ${chunk.length}`);
      buffers.push(chunk);
    });

    file.on("error", (err) => {
      console.error("Error reading file from S3:", err);
      reject(err);
    });

    return new Promise((resolve, reject) => {
      file.on("end", async () => {
        const buffer = Buffer.concat(buffers);

        console.log("📊 Parsing XLSX...");
        const parseStart = Date.now();
        const workbook = xlsx.parse(buffer);

        if (!workbook.length) {
          return resolve([]);
        }

        const DataImport = workbook[0].data;

        // Skip header
        const rows = DataImport.slice(1);

        for (const row of rows) {
          total++;
          try {
            const rowData = {
              name: row[0],
              description: row[1],
              price: parseFloat(row[2]),
              stock: row[3] ? parseInt(row[3]) : 0,
            };

            if (!rowData.name || !rowData.price) {
              throw new Error("Missing required fields");
            }

            await ProductsRepository.createRepository({
              vendor_id: jobExists.response.vendor_id,
              ...rowData,
              created_by: Upload.importProducts,
            });

            success++;
          } catch (e) {
            failed++;

            await ImportLog.createRepository({
              job_id: jobId,
              row_number: total,
              error_message: e.message,
            });
          }
        }

        // Update status import_jobs
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

        console.log(
          `✔️ Success: ${success}, ❌ Fail: ${failed}, Total: ${total}`
        );
        resolve();
      });
    });
  }
};

// const csv = require("fast-csv");
// const xlsx = require("node-xlsx");
// const { Readable } = require("stream");
// const { ImportJob, ProductsRepository, ImportLog } = require("../repository");
// const { Upload } = require("../enum");

// exports.handleProductImport = async (job) => {
//   const { buffer, filename, jobId } = job.data;

//   console.log("📂 Start import:", filename, "Job ID:", jobId);

//   let total = 0;
//   let success = 0;
//   let failed = 0;

//   // Pastikan job valid
//   const jobExists = await ImportJob.getOneRepository({ id: jobId });
//   if (!jobExists) {
//     console.error("❌ Job ID tidak ditemukan:", jobId);
//     return;
//   }

//   let rows = [];

//   // === 1. Deteksi file type ===
//   if (filename.endsWith(".csv")) {
//     console.log("📄 Parsing CSV...");
//     rows = await parseCsvBuffer(buffer.toSring("utf-8"));
//   } else if (filename.toLowerCase().endsWith(".xlsx")) {
//     console.log("📊 Parsing XLSX (node-xlsx)...");
//     const sheets = xlsx.parse(buffer);
//     console.log(sheets);
//     const parseStart = new Date();

//     console.log(`✅ XLSX parsed in ${new Date() - parseStart}ms`);

//     if (!sheets.length) {
//       console.error("❌ Tidak ada sheet di file ini.");
//       return;
//     }

//     const sheetName = sheets[0].name;
//     const data = sheets[0].data;

//     console.log(`📄 Sheet: ${sheetName}`);
//     console.log("🔢 Total Rows:", data.length);
//     console.log("📝 Sample Data:", data.slice(0, 5));
//     // rows = parseNodeXlsxBuffer(buffer);
//   } else {
//     console.error("❌ Format file tidak didukung:", filename);
//     return;
//   }

//   console.log("📝 Parsed Rows:", rows);
//   console.log("🔢 Total Rows:", rows.length);

//   // === 2. Proses tiap row ===
//   for (const row of rows) {
//     total++;
//     try {
//       if (!row.name || !row.price) {
//         throw new Error("Missing required fields");
//       }
//       await ProductsRepository.createRepository({
//         vendor_id: jobExists.response.vendor_id,
//         name: row.name,
//         description: row.description,
//         price: parseFloat(row.price),
//         stock: row.stock ? parseInt(row.stock) : 0,
//         created_by: Upload.importProducts,
//       });
//       success++;
//     } catch (e) {
//       failed++;
//       await ImportLog.createRepository({
//         job_id: jobId,
//         row_number: total,
//         error_message: e.message,
//       });
//     }
//   }

//   // === 3. Update status import_jobs ===
//   await ImportJob.updateRepository(
//     {
//       status: failed > 0 ? "failed" : "success",
//       total_rows: total,
//       success_rows: success,
//       failed_rows: failed,
//       updated_at: new Date(),
//     },
//     { id: jobId }
//   );

//   console.log(`✅ Import selesai: ${success} sukses, ❌ ${failed} gagal`);
// };

// // ============ Helpers ============

// // Parsing CSV pakai fast-csv
// function parseCsvBuffer(buffer) {
//   return new Promise((resolve, reject) => {
//     const rows = [];
//     const stream = Readable.from(buffer);
//     csv
//       .parseStream(stream, { headers: true, ignoreEmpty: true, trim: true })
//       .on("error", reject)
//       .on("data", (row) => rows.push(cleanRow(row)))
//       .on("end", () => resolve(rows));
//   });
// }

// // Parsing XLSX pakai node-xlsx
// function parseNodeXlsxBuffer(buffer) {
//   const sheets = xlsx.parse(buffer);
//   const data = sheets[0].data;
//   console.log(data);
//   if (!sheets.length || !sheets[0].data.length) return [];

//   // Ambil header (baris pertama)
//   // const header = data[0].map((h) => cleanHeader(h));
//   // const body = data.slice(1);

//   // return body
//   //   .filter((row) => row.some((cell) => cell !== null && cell !== ""))
//   //   .map((row) => {
//   //     const obj = {};
//   //     header.forEach((h, i) => {
//   //       obj[h] = row[i] !== undefined ? row[i] : "";
//   //     });
//   //     return cleanRow(obj);
//   //   });
// }

// // Bersihkan header (trim spasi & karakter aneh)
// function cleanHeader(str) {
//   return String(str || "")
//     .trim()
//     .replace(/\uFEFF/g, ""); // hapus BOM
// }

// // Bersihkan setiap row (trim semua kolom)
// function cleanRow(row) {
//   const newRow = {};
//   for (let key in row) {
//     newRow[key.trim()] =
//       typeof row[key] === "string" ? row[key].trim() : row[key];
//   }
//   return newRow;
// }
