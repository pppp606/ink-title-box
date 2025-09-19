#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { fileURLToPath } from 'url';
import { TitleBox } from './index.js';
import stringWidth from 'string-width';

type BorderStyle = 'single' | 'double' | 'round' | 'bold' | 'ascii';
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

const VALID_BORDER_STYLES = ['single', 'double', 'round', 'bold', 'ascii'];
const VALID_TITLE_ALIGNS = ['left', 'center', 'right', 'space-between'];
const VALID_TITLE_POSITIONS = ['top', 'bottom'];

// Text truncation helper for CLI direct output
const truncateTextCLI = (text: string, maxWidth: number): string => {
  if (!maxWidth) return text;

  const textWidth = stringWidth(text);
  if (textWidth <= maxWidth) return text;

  let truncated = '';
  let currentWidth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWidth = stringWidth(char);

    // Reserve space for ellipsis (width = 1)
    if (currentWidth + charWidth > maxWidth - 1) {
      break;
    }

    truncated += char;
    currentWidth += charWidth;
  }

  return truncated + '…';
};

// Direct text output generation for extreme widths (bypasses Ink)
function generateDirectOutput(options: CliOptions): string {
  const {
    title = '',
    titles,
    width = 40,
    borderStyle = 'round',
    titleAlign = 'left',
    titlePosition = 'top',
    truncate = false,
    // fullWidthSafe could be used for future enhancement
    padding = 1,
  } = options;

  // Simplified border characters mapping
  const borderChars = {
    single: {
      topLeft: '┌',
      topRight: '┐',
      bottomLeft: '└',
      bottomRight: '┘',
      horizontal: '─',
      vertical: '│',
    },
    double: {
      topLeft: '╔',
      topRight: '╗',
      bottomLeft: '╚',
      bottomRight: '╝',
      horizontal: '═',
      vertical: '║',
    },
    round: {
      topLeft: '╭',
      topRight: '╮',
      bottomLeft: '╰',
      bottomRight: '╯',
      horizontal: '─',
      vertical: '│',
    },
    bold: {
      topLeft: '┏',
      topRight: '┓',
      bottomLeft: '┗',
      bottomRight: '┛',
      horizontal: '━',
      vertical: '┃',
    },
    ascii: {
      topLeft: '+',
      topRight: '+',
      bottomLeft: '+',
      bottomRight: '+',
      horizontal: '-',
      vertical: '|',
    },
  };

  const chars =
    borderChars[borderStyle as keyof typeof borderChars] || borderChars.round;
  const effectiveTitle = title || titles?.[0] || '';

  // Create title border
  const createBorder = (isBottom: boolean) => {
    const leftCorner = isBottom ? chars.bottomLeft : chars.topLeft;
    const rightCorner = isBottom ? chars.bottomRight : chars.topRight;

    if (!effectiveTitle) {
      return leftCorner + chars.horizontal.repeat(width - 2) + rightCorner;
    }

    const maxTitleWidth = width - 4; // Space for corners and spaces around title
    const titleText =
      truncate && stringWidth(effectiveTitle) > maxTitleWidth
        ? truncateTextCLI(effectiveTitle, maxTitleWidth)
        : effectiveTitle;

    const remainingSpace = width - stringWidth(titleText) - 4; // -4 for corners and spaces

    let leftPadding = 0,
      rightPadding = remainingSpace;
    if (titleAlign === 'center') {
      leftPadding = Math.floor(remainingSpace / 2);
      rightPadding = remainingSpace - leftPadding;
    } else if (titleAlign === 'right') {
      leftPadding = remainingSpace;
      rightPadding = 0;
    }

    return (
      leftCorner +
      chars.horizontal.repeat(leftPadding) +
      ` ${titleText} ` +
      chars.horizontal.repeat(rightPadding) +
      rightCorner
    );
  };

  // Create content lines
  const emptyLine = chars.vertical + ' '.repeat(width - 2) + chars.vertical;
  const lines: string[] = [];

  // Top border
  if (titlePosition === 'top') {
    lines.push(createBorder(false));
  } else {
    lines.push(
      chars.topLeft + chars.horizontal.repeat(width - 2) + chars.topRight
    );
  }

  // Content with padding
  for (let i = 0; i < padding; i++) {
    lines.push(emptyLine);
  }

  // Bottom border
  if (titlePosition === 'bottom') {
    lines.push(createBorder(true));
  } else {
    lines.push(
      chars.bottomLeft + chars.horizontal.repeat(width - 2) + chars.bottomRight
    );
  }

  return lines.join('\n');
}

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

    // Handle extreme widths that might exceed terminal capabilities
    const terminalWidth = process.stdout.columns || 80;
    const requestedWidth = options.width || 40;

    if (requestedWidth > terminalWidth) {
      // For widths exceeding terminal size, generate output directly
      // This bypasses Ink's terminal width limiting
      try {
        const directOutput = generateDirectOutput(options);
        console.log(directOutput);
        return;
      } catch {
        // Fall back to regular Ink rendering if direct output fails
        console.warn(
          'Warning: Direct rendering failed, falling back to Ink (output may be truncated)'
        );
      }
    }

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
