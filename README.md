#### 🍎 E-Procurement API System

This is a backend API system designed for handling core E-Procurement processes such as User Authentication, Vendor Management, and Product Catalog Management, with support for large-scale CSV product import using BullMQ + Redis.

📁 Project Structure

VHIWEB-BE-TEST/
│
├── app/ # (Optional) Core modules or controllers
├── bin/ # Entry point scripts (e.g., www.js)
├── config/ # Config files (database, Redis, AWS, BullMQ, etc.)
├── middleware/ # Express middleware (auth, validators, error handling)
├── node_modules/ # Installed dependencies
├── public/ # Static assets (images, uploads, etc.)
├── repository/ # Data access layer (Knex queries, ORM, etc.)
├── routes/ # API routes (auth, vendor, products, etc.)
├── service/ # Business logic (AuthService, ProductService, etc.)
├── utils/ # Helper functions (token, password, file utilities)
├── views/ # Server-rendered views if needed
├── worker/ # BullMQ workers for background jobs (e.g., CSV import)
│
├── .env # Environment variables (not committed to git)
├── app.js # Express app entry point
├── enum.js # Enum/constants definitions
├── package.json # Project metadata and dependencies
├── package-lock.json
├── README.md # You are here 🚀

🚀 Features

✅ User Authentication (Login/Register with JWT)

✅ Vendor Registration (Linked to authenticated user)

✅ Product CRUD (Per-vendor product catalog)

✅ CSV Product Import (Supports 100K+ rows efficiently)

✅ Background Jobs with BullMQ + Redis

✅ Job Logging with import_jobs and import_logs tracking

✅ S3 / MinIO Integration for CSV file uploads

✅ Fully Modular Clean Architecture

⚙️ Setup Instructions

1. 📦 Clone and Install Dependencies

git clone https://github.com/hilmanNafiin/vhiweb-be-test.git
cd e-procurement-api
npm install

2. 🛠️ Environment Setup

Create a .env file at the root with the following dummy config:

# APP Config

PORT=3000
NODE_ENV="development"

# JWT Config

JWT_SECRET=dummy_jwt_secret_key_for_access_token
JWT_SECRET_REFRESH=dummy_jwt_secret_key_for_refresh_token
JWT_EXPIRATION=1y

# PostgreSQL Config

PGURLW="127.0.0.1"
PGPORT=5432
PGUSER="your_postgres_user"
PGPASSWORD='your_postgres_password'
PGDATABASE="your_database_name"

# AWS S3 / MinIO Config

AWSKEYID=dummy_access_key_id
AWSSECRETKEY=dummy_secret_access_key
AWSREGION=ap-southeast-1
AWSBUCKET=dummy_bucket_name
AWSURL=https://your-storage-provider-url

# Redis Config

REDISHOST="redis://127.0.0.1:6379"

3. 🔧 Run Database Migrations

Use any migration tools or manually run SQL scripts to create the following tables:

users

vendors

products

import_jobs

import_logs

Ensure foreign keys and constraints are defined correctly.

4. 🧠 CSV Import Flow

Step 1: Frontend uploads .csv file to S3 using Multer middleware.

Step 2: Backend saves job metadata to import_jobs table.

Step 3: Job is queued into Redis via BullMQ.

Step 4: Worker (in /worker) reads file buffer, parses CSV rows in stream.

Step 5: Each row is validated → inserted into products → errors logged into import_logs.

Step 6: Import status (success/fail) is updated in import_jobs.

5. 🧪 Start the App

# for development

npm run dev

Make sure:

PostgreSQL is running

Redis is running (e.g. brew services start redis)

MinIO or S3 is accessible

📈 Scalability Notes

Workers run separately (in worker/index.js or within app.js)

Import jobs can be scaled horizontally across multiple worker threads

Log progress into database, so users can track job progress

Monitor Redis queue using tools like Bull Board

# 👨‍💼 Author

Developed by Hilman Nafi’in For test purpose: VHIWEB-BE-TEST
