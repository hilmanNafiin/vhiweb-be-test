const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const { S3 } = require("@aws-sdk/client-s3");
require("dotenv").config();

exports.MulterBucket = (uniqueKeyFile) => {
  console.log(process.env.AWSKEYID);
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWSKEYID,
      secretAccessKey: process.env.AWSSECRETKEY,
    },
    region: process.env.AWSREGION,
    endpoint: process.env.AWSURL,
    forcePathStyle: true,
  });

  const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWSBUCKET,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const uniqueKey = `${uniqueKeyFile}_${Date.now()}_${file.originalname}`;
        cb(null, uniqueKey);
      },
      acl: "public-read",
    }),
    limits: {
      fileSize: 1024 * 1024 * 1024, // 1 GB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
        "application/csv",
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error("Invalid file type. Only Excel or CSV files are allowed."),
          false
        );
      }
    },
  });

  return upload;
};

exports.getFileFromS3 = async (bucket, key) => {
  // Update AWS config with credentials
  AWS.config.update({
    accessKeyId: process.env.AWSKEYID, // Preferably use environment variables for security
    secretAccessKey: process.env.AWSSECRETKEY,
    region: process.env.AWSREGION,
  });

  // Parameters for the S3 getObject operation
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const s3 = new AWS.S3({
    endpoint: process.env.AWSURL,
    s3ForcePathStyle: true,
  });

  try {
    // Get the file from S3
    const fileData = await s3.getObject(params).promise();
    console.log("File fetched successfully:", fileData.Body); // File data (buffer)

    // If you need to return the file as a buffer (e.g., for further processing)
    return fileData.Body;
  } catch (error) {
    console.error("Error fetching file from S3:", error);
    throw new Error("Failed to retrieve file from S3.");
  }
};
