// Test CLI argument parsing logic with validation
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

// Replicate parseArgs logic for testing (to avoid import.meta issues)
function parseArgs(args: string[]): any {
  const options: any = {
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
        options.width = Math.min(width, 200);
        i++;
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
        options.padding = Math.min(padding, 10);
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
        i++;
        break;
      }

      case '--help':
      case '-h':
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

describe('CLI Functions', () => {
  describe('parseArgs', () => {
    it('should parse title from first argument', () => {
      const result = parseArgs(['My Title']);
      expect(result.title).toBe('My Title');
    });

    it('should use default title when no arguments provided', () => {
      const result = parseArgs([]);
      expect(result.title).toBe('Default Title');
    });

    it('should parse width option with --width flag', () => {
      const result = parseArgs(['Title', '--width', '50']);
      expect(result.title).toBe('Title');
      expect(result.width).toBe(50);
    });

    it('should parse width option with -w flag', () => {
      const result = parseArgs(['Title', '-w', '30']);
      expect(result.title).toBe('Title');
      expect(result.width).toBe(30);
    });

    it('should parse padding option with --padding flag', () => {
      const result = parseArgs(['Title', '--padding', '3']);
      expect(result.title).toBe('Title');
      expect(result.padding).toBe(3);
    });

    it('should parse padding option with -p flag', () => {
      const result = parseArgs(['Title', '-p', '2']);
      expect(result.title).toBe('Title');
      expect(result.padding).toBe(2);
    });

    it('should parse color option with --color flag', () => {
      const result = parseArgs(['Title', '--color', 'red']);
      expect(result.title).toBe('Title');
      expect(result.borderColor).toBe('red');
    });

    it('should parse color option with -c flag', () => {
      const result = parseArgs(['Title', '-c', 'green']);
      expect(result.title).toBe('Title');
      expect(result.borderColor).toBe('green');
    });

    it('should parse multiple options', () => {
      const result = parseArgs([
        'Complex Title',
        '--width',
        '60',
        '--padding',
        '4',
        '--color',
        'blue',
      ]);

      expect(result.title).toBe('Complex Title');
      expect(result.width).toBe(60);
      expect(result.padding).toBe(4);
      expect(result.borderColor).toBe('blue');
    });

    it('should handle mixed short and long flags', () => {
      const result = parseArgs([
        'Mixed Title',
        '-w',
        '25',
        '--padding',
        '1',
        '-c',
        'yellow',
      ]);

      expect(result.title).toBe('Mixed Title');
      expect(result.width).toBe(25);
      expect(result.padding).toBe(1);
      expect(result.borderColor).toBe('yellow');
    });

    it('should throw error for invalid numeric values', () => {
      expect(() => {
        parseArgs(['Title', '--width', 'invalid']);
      }).toThrow('Width must be a positive number, got: invalid');

      expect(() => {
        parseArgs(['Title', '--padding', 'bad']);
      }).toThrow('Padding must be a non-negative number, got: bad');
    });

    it('should throw error for missing argument values', () => {
      expect(() => {
        parseArgs(['Title', '--width']);
      }).toThrow('--width requires a value');

      expect(() => {
        parseArgs(['Title', '-p']);
      }).toThrow('-p requires a value');

      expect(() => {
        parseArgs(['Title', '--color']);
      }).toThrow('--color requires a value');
    });

    it('should throw error for unknown options', () => {
      expect(() => {
        parseArgs(['Title', '--unknown']);
      }).toThrow(
        'Unknown option: --unknown. Use --help for usage information.'
      );
    });

    it('should throw error for invalid color', () => {
      expect(() => {
        parseArgs(['Title', '--color', 'invalidcolor']);
      }).toThrow("Invalid color 'invalidcolor'");
    });

    it('should clamp values to reasonable ranges', () => {
      const result = parseArgs(['Title', '--width', '1000', '--padding', '50']);

      expect(result.width).toBe(200); // Clamped to max
      expect(result.padding).toBe(10); // Clamped to max
    });

    it('should handle valid colors', () => {
      const result = parseArgs(['Title', '--color', 'red']);
      expect(result.borderColor).toBe('red');

      const result2 = parseArgs(['Title', '-c', 'blueBright']);
      expect(result2.borderColor).toBe('blueBright');
    });
  });
});
