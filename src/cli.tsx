#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { fileURLToPath } from 'url';
import { TitleBox } from './index.js';

interface CliOptions {
  title: string;
  width?: number;
  padding?: number;
  borderColor?: string;
}

const VALID_COLORS = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'grey',
  'blackBright',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
];

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    title: args[0] || 'Default Title',
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--width':
      case '-w': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        const width = parseInt(nextArg, 10);
        if (isNaN(width) || width < 1) {
          throw new Error(`Width must be a positive number, got: ${nextArg}`);
        }
        options.width = Math.min(width, 200); // Clamp to reasonable max
        i++; // Skip the next argument since we consumed it
        break;
      }

      case '--padding':
      case '-p': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        const padding = parseInt(nextArg, 10);
        if (isNaN(padding) || padding < 0) {
          throw new Error(
            `Padding must be a non-negative number, got: ${nextArg}`
          );
        }
        options.padding = Math.min(padding, 10); // Clamp to reasonable max
        i++; // Skip the next argument since we consumed it
        break;
      }

      case '--color':
      case '-c': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        if (!VALID_COLORS.includes(nextArg)) {
          throw new Error(
            `Invalid color '${nextArg}'. Valid colors: ${VALID_COLORS.join(', ')}`
          );
        }
        options.borderColor = nextArg;
        i++; // Skip the next argument since we consumed it
        break;
      }

      case '--help':
      case '-h':
        // Help is handled in main(), but we should recognize it here
        break;

      default:
        if (arg.startsWith('-')) {
          throw new Error(
            `Unknown option: ${arg}. Use --help for usage information.`
          );
        }
        break;
    }
  }

  return options;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: ink-title-box "Your Title" [options]

Options:
  -w, --width <number>    Set box width (default: 40, max: 200)
  -p, --padding <number>  Set box padding (default: 1, max: 10)
  -c, --color <color>     Set border color (default: blue)
  -h, --help              Show this help message

Valid colors:
  ${VALID_COLORS.join(', ')}

Examples:
  ink-title-box "Hello World"
  ink-title-box "My Title" --width 60 --color green
  ink-title-box "Test" -w 30 -p 2 -c red
`);
    process.exit(0);
  }

  try {
    const options = parseArgs(args);
    render(React.createElement(TitleBox, options));
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
    console.error('Use --help for usage information.');
    process.exit(1);
  }
}

// Only run main() when this file is executed directly, not when imported
const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  main();
}

export { parseArgs, main };
