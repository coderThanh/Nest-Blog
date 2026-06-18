#!/usr/bin/env node

// const fs = require('fs');
// const path = require('path');
// const { spawnSync } = require('child_process');

import * as fs from 'fs';

import path from 'path';
import { spawnSync } from 'child_process';

const projectRoot = path.resolve(__dirname, '..');
const migrationsDir = path.join(projectRoot, 'prisma', 'migrations');

function parseArgs(argv) {
  const args = {
    action: 'applied',
    dryRun: false,
    deploy: false,
    from: null,
    to: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (arg === '--deploy') {
      args.deploy = true;
      continue;
    }

    if (arg === '--applied') {
      args.action = 'applied';
      continue;
    }

    if (arg === '--rolled-back') {
      args.action = 'rolled-back';
      continue;
    }

    if (arg === '--from') {
      args.from = argv[i + 1] || null;
      i += 1;
      continue;
    }

    if (arg === '--to') {
      args.to = argv[i + 1] || null;
      i += 1;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(
    `
Usage:
  ts-node script/prisma-resolve.ts [options]
  npm run prisma:resolve -- [options]

Options:
  --applied        Mark migrations as applied (default)
  --rolled-back    Mark migrations as rolled back
  --from <name>    Start from this migration name
  --to <name>      Stop at this migration name
  --deploy         Run "npx prisma migrate deploy" after resolve loop
  --dry-run        Print commands without executing them
  --help, -h       Show help

Examples:
  ts-node script/prisma-resolve.ts --dry-run
  npm run prisma:resolve:dry
  ts-node script/prisma-resolve.ts --from 20260617172018_update_file --to 20260617182018_update_search_colum
  ts-node script/prisma-resolve.ts --applied --deploy
  ts-node script/prisma-resolve.ts --rolled-back --from 20260617184520_migrate
`.trim(),
  );
}

function getMigrationDirectories() {
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  return fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function sliceMigrations(migrations, from, to) {
  let startIndex = 0;
  let endIndex = migrations.length - 1;

  if (from) {
    const foundIndex = migrations.indexOf(from);
    if (foundIndex === -1) {
      throw new Error(`Cannot find --from migration: ${from}`);
    }
    startIndex = foundIndex;
  }

  if (to) {
    const foundIndex = migrations.indexOf(to);
    if (foundIndex === -1) {
      throw new Error(`Cannot find --to migration: ${to}`);
    }
    endIndex = foundIndex;
  }

  if (startIndex > endIndex) {
    throw new Error('--from must be before --to');
  }

  return migrations.slice(startIndex, endIndex + 1);
}

function runCommand(command, args, dryRun) {
  const rendered = [command, ...args].join(' ');
  console.log(`\n$ ${rendered}`);

  if (dryRun) {
    return { status: 0 };
  }

  return spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false,
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const allMigrations = getMigrationDirectories();
  const targetMigrations = sliceMigrations(allMigrations, args.from, args.to);

  if (targetMigrations.length === 0) {
    console.log('No migrations to resolve.');
    return;
  }

  console.log(`Project root: ${projectRoot}`);
  console.log(`Migrations dir: ${migrationsDir}`);
  console.log(`Action: --${args.action}`);
  console.log(`Total migrations: ${targetMigrations.length}`);

  for (const migration of targetMigrations) {
    const result = runCommand(
      'npx',
      ['prisma', 'migrate', 'resolve', `--${args.action}`, migration],
      args.dryRun,
    );

    if (result.status !== 0) {
      process.exit(result.status || 1);
    }
  }

  if (args.deploy) {
    const result = runCommand(
      'npx',
      ['prisma', 'migrate', 'deploy'],
      args.dryRun,
    );

    if (result.status !== 0) {
      process.exit(result.status || 1);
    }
  }

  console.log('\nDone.');
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
