#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the CLI executable file
const cliPath = join(__dirname, 'dist', 'cli.js');

function runDemo(args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args], {
      stdio: 'inherit',
      cwd: __dirname,
    });

    child.on('close', code => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);

  console.log('🎯 ink-title-box Demo');
  console.log('Running with args:', args.length > 0 ? args : ['(default)']);
  console.log('─'.repeat(50));

  try {
    if (args.length === 0) {
      // Default demo
      await runDemo(['Hello, ink-title-box!']);
    } else {
      // Run demo with custom arguments
      await runDemo(args);
    }

    console.log('─'.repeat(50));
    console.log('✅ Demo completed successfully!');
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

main();
