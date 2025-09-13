#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { fileURLToPath } from 'url';
import { TitleBox } from './index.js';

type BorderStyle = 'single' | 'double' | 'round' | 'bold';
type TitleAlign = 'left' | 'center' | 'right' | 'space-between';
type TitlePosition = 'top' | 'bottom';

interface CliOptions {
  title?: string;
  titles?: string[];
  width?: number;
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  borderColor?: string;
  borderStyle?: BorderStyle;
  titleAlign?: TitleAlign;
  titlePosition?: TitlePosition;
  truncate?: boolean;
  fullWidthSafe?: boolean;
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

const VALID_BORDER_STYLES = ['single', 'double', 'round', 'bold'];
const VALID_TITLE_ALIGNS = ['left', 'center', 'right', 'space-between'];
const VALID_TITLE_POSITIONS = ['top', 'bottom'];

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  let titleSet = false;

  for (let i = 0; i < args.length; i++) {
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

      case '--padding-x':
      case '-px': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        const paddingX = parseInt(nextArg, 10);
        if (isNaN(paddingX) || paddingX < 0) {
          throw new Error(
            `PaddingX must be a non-negative number, got: ${nextArg}`
          );
        }
        options.paddingX = Math.min(paddingX, 10);
        i++;
        break;
      }

      case '--padding-y':
      case '-py': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        const paddingY = parseInt(nextArg, 10);
        if (isNaN(paddingY) || paddingY < 0) {
          throw new Error(
            `PaddingY must be a non-negative number, got: ${nextArg}`
          );
        }
        options.paddingY = Math.min(paddingY, 10);
        i++;
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

      case '--border-style':
      case '-b': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        if (!VALID_BORDER_STYLES.includes(nextArg as BorderStyle)) {
          throw new Error(
            `Invalid border style '${nextArg}'. Valid styles: ${VALID_BORDER_STYLES.join(', ')}`
          );
        }
        options.borderStyle = nextArg as BorderStyle;
        i++;
        break;
      }

      case '--title-align':
      case '-ta': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        if (!VALID_TITLE_ALIGNS.includes(nextArg as TitleAlign)) {
          throw new Error(
            `Invalid title alignment '${nextArg}'. Valid alignments: ${VALID_TITLE_ALIGNS.join(', ')}`
          );
        }
        options.titleAlign = nextArg as TitleAlign;
        i++;
        break;
      }

      case '--title-position':
      case '-tp': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        if (!VALID_TITLE_POSITIONS.includes(nextArg as TitlePosition)) {
          throw new Error(
            `Invalid title position '${nextArg}'. Valid positions: ${VALID_TITLE_POSITIONS.join(', ')}`
          );
        }
        options.titlePosition = nextArg as TitlePosition;
        i++;
        break;
      }

      case '--titles': {
        if (!nextArg) {
          throw new Error(`${arg} requires a value`);
        }
        options.titles = nextArg.split(',').map(t => t.trim());
        delete options.title; // Use titles instead of single title
        titleSet = true;
        i++;
        break;
      }

      case '--truncate': {
        options.truncate = true;
        break;
      }

      case '--full-width-safe': {
        options.fullWidthSafe = true;
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
        } else if (!titleSet && !options.titles) {
          // First non-option argument is the title
          options.title = arg;
          titleSet = true;
        }
        break;
    }
  }

  // Set default title if none provided
  if (!titleSet && !options.titles) {
    options.title = 'Default Title';
  }

  return options;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: ink-title-box "Your Title" [options]

Options:
  -w, --width <number>         Set box width (default: 40, max: 200)
  -p, --padding <number>       Set box padding (default: 1, max: 10)
  -px, --padding-x <number>    Set horizontal padding (overrides padding)
  -py, --padding-y <number>    Set vertical padding (overrides padding)
  -c, --color <color>          Set border color (default: blue)
  -b, --border-style <style>   Set border style (default: round)
  -ta, --title-align <align>   Set title alignment (default: left)
  -tp, --title-position <pos>  Set title position (default: top)
  --titles <list>              Comma-separated list of titles
  --truncate                   Enable title truncation with ellipsis
  --full-width-safe            Enable full-width character support
  -h, --help                   Show this help message

Valid colors:
  ${VALID_COLORS.join(', ')}

Valid border styles:
  ${VALID_BORDER_STYLES.join(', ')}

Valid title alignments:
  ${VALID_TITLE_ALIGNS.join(', ')}

Valid title positions:
  ${VALID_TITLE_POSITIONS.join(', ')}

Examples:
  ink-title-box "Hello World"
  ink-title-box "My Title" --width 60 --color green --border-style double
  ink-title-box "Test" -w 30 -px 3 -py 1 -c red --title-align center
  ink-title-box --titles "Left,Right" --title-align space-between
  ink-title-box "Long Title" --width 20 --truncate
  ink-title-box "日本語" --full-width-safe
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
