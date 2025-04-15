#!/usr/bin/env tsx
import { execSync } from 'child_process';

/**
 * Reset database script
 * Can be run with: pnpm tsx reset-db.ts
 */

function executeCommand(command: string): void {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

function resetDatabase(): void {
  // Check if running in Vercel production
  if (process.env.VERCEL_ENV === 'production') {
    console.error('This script cannot be run on a Vercel production instance.');
    process.exit(1);
  }

  console.log('[db:reset] Resetting dev database...');
  
  console.log('[db:reset] * resetting schema');
  executeCommand('pnpm prisma migrate reset --force --preview-feature');
  
  console.log('[db:reset] * triggering migrations');
  executeCommand('pnpm prisma migrate deploy --preview-feature');
  
  console.log('[db:reset] * loading services');
  executeCommand('pnpm sync:services');
  
  console.log('[db:reset] done');
}

// Run the script
resetDatabase();