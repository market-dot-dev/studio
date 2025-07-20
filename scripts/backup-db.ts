import "dotenv/config";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function backup() {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING;
  console.log("CSTRING", connectionString);

  if (!connectionString) {
    throw new Error("DATABASE_URL not found in environment");
  }

  const url = new URL(connectionString);
  process.env.PGPASSWORD = url.password;

  const dateStr = new Date().toISOString().split("T")[0];
  const dumpPath = `./backups/backup-${dateStr}.dump`;
  const sqlPath = `./backups/backup-${dateStr}.sql`;

  // Custom format (binary, compressed, fast restore)
  const dumpCommand = `pg_dump -v -d ${connectionString} -F c -f ${dumpPath}`;

  // Plain SQL format (human readable)
  const sqlCommand = `pg_dump -v -d ${connectionString} -f ${sqlPath}`;

  try {
    console.log("Creating custom format backup...");
    await execAsync(dumpCommand);
    console.log(`Custom backup created at ${dumpPath}`);

    console.log("Creating SQL format backup...");
    await execAsync(sqlCommand);
    console.log(`SQL backup created at ${sqlPath}`);
  } catch (error) {
    console.error("Backup failed:", error);
    process.exit(1);
  }
}

backup();
