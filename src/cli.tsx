#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { TitleBox } from './index.js';

interface CliOptions {
  title: string;
  width?: number;
  padding?: number;
  borderColor?: string;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    title: args[0] || 'Default Title',
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--width':
      case '-w':
        options.width = parseInt(args[++i], 10);
        break;
      case '--padding':
      case '-p':
        options.padding = parseInt(args[++i], 10);
        break;
      case '--color':
      case '-c':
        options.borderColor = args[++i];
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
  -w, --width <number>    Set box width (default: 40)
  -p, --padding <number>  Set box padding (default: 1)
  -c, --color <color>     Set border color (default: blue)
  -h, --help              Show this help message

Examples:
  ink-title-box "Hello World"
  ink-title-box "My Title" --width 60 --color green
  ink-title-box "Test" -w 30 -p 2 -c red
`);
    process.exit(0);
  }

  const options = parseArgs(args);

  render(React.createElement(TitleBox, options));
}

// Only run main() when this file is executed directly, not when imported
const isMainModule = process.argv[1] && process.argv[1].endsWith('cli.js');
if (isMainModule) {
  main();
}

export { parseArgs, main };
