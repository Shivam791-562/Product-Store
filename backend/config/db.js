// backend/config/db.js
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Candidate .env locations (backend/.env preferred)
const candidates = [
  path.resolve(__dirname, "./.env"),         
  path.resolve(__dirname, "./backend/.env"),
  path.resolve(__dirname, "../.env"),      
  path.resolve(process.cwd(), ".env"),  
];

let loadedPath = null;
for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    loadedPath = p;
    break;
  }
}

if (!loadedPath) {
  console.warn(
    "No .env file found in expected locations. Checked:\n" + candidates.join("\n")
  );
} else {
  console.log("Loaded .env from:", loadedPath);
}

// Build connection string
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, DATABASE_URL } = process.env;
let connectionString = DATABASE_URL;
if (!connectionString) {
  if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
    throw new Error(
      "Missing DB creds. Set DATABASE_URL or PGHOST, PGDATABASE, PGUSER, PGPASSWORD in backend/.env"
    );
  }
  connectionString = `postgresql://${encodeURIComponent(PGUSER)}:${encodeURIComponent(
    PGPASSWORD
  )}@${PGHOST}/${PGDATABASE}?sslmode=require`;
}

export const sql = neon(connectionString);