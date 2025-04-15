#!/usr/bin/env tsx
import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

/**
 * Database restore script
 * Can be run with: pnpm tsx restore-prod-db.ts
 */

function executeCommand(command: string): void {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

function restoreDatabase(): void {
  // Check if running in Vercel
  if (process.env.VERCEL === "1") {
    console.log("This script is intended for local development only. Exiting...");
    process.exit(0);
  }

  const DB_NAME = "gitwallet_prod";
  const DUMP_FILE = path.join("..", "gitwallet_prod.dump");
  const OWNERSHIP_SCRIPT = path.join("scripts", "dev-assign-ownership.sql");

  // Verify dump file exists
  if (!existsSync(DUMP_FILE)) {
    console.error(`Dump file not found: ${DUMP_FILE}`);
    process.exit(1);
  }

  // Verify ownership script exists
  if (!existsSync(OWNERSHIP_SCRIPT)) {
    console.error(`Ownership script not found: ${OWNERSHIP_SCRIPT}`);
    process.exit(1);
  }

  // Drop database if exists
  try {
    executeCommand(`dropdb ${DB_NAME}`);
  } catch (error) {
    console.log(`Database ${DB_NAME} doesn't exist yet, proceeding to create it.`);
  }

  // Create database
  executeCommand(`createdb ${DB_NAME}`);

  // Restore from dump
  executeCommand(`pg_restore -d ${DB_NAME} ${DUMP_FILE}`);

  // Run ownership script
  executeCommand(`psql ${DB_NAME} < ${OWNERSHIP_SCRIPT}`);

  console.log(`Database ${DB_NAME} has been successfully restored!`);
}

// Run the script
restoreDatabase();
