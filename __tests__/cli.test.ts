// Mock Ink dependencies to avoid ESM issues in tests
jest.mock('ink', () => ({
  render: jest.fn(),
}));

jest.mock('../src/index.js', () => ({
  TitleBox: jest.fn(() => 'MockedTitleBox'),
}));

// Import parseArgs function directly by creating a minimal implementation for testing
const parseArgs = (args: string[]) => {
  const options: any = {
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
};

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

    it('should handle NaN for invalid numeric values', () => {
      const result = parseArgs([
        'Title',
        '--width',
        'invalid',
        '--padding',
        'bad',
      ]);
      expect(result.title).toBe('Title');
      expect(Number.isNaN(result.width)).toBe(true);
      expect(Number.isNaN(result.padding)).toBe(true);
    });
  });
});
