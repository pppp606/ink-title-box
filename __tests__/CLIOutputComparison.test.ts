import { describe, test, expect } from '@jest/globals';
import { execSync } from 'child_process';
import path from 'path';

// Simple display width calculation (duplicated from main implementation)
const getDisplayWidth = (str: string): number => {
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Check for full-width characters
    if (
      (code >= 0x1100 && code <= 0x115f) || // Hangul
      (code >= 0x2e80 && code <= 0x2eff) || // CJK Radicals
      (code >= 0x2f00 && code <= 0x2fdf) || // Kangxi Radicals
      (code >= 0x3000 && code <= 0x303f) || // CJK Symbols and Punctuation
      (code >= 0x3040 && code <= 0x309f) || // Hiragana
      (code >= 0x30a0 && code <= 0x30ff) || // Katakana
      (code >= 0x3100 && code <= 0x312f) || // Bopomofo
      (code >= 0x3200 && code <= 0x32ff) || // Enclosed CJK
      (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
      (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
      (code >= 0xf900 && code <= 0xfaff) // CJK Compatibility
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
};

// Helper to run CLI and capture output
const runCLI = (args: string): string => {
  const cliPath = path.join(__dirname, '../dist/cli.js');
  try {
    const result = execSync(`node "${cliPath}" ${args}`, {
      encoding: 'utf-8',
      timeout: 5000,
    });
    return result.trim();
  } catch (error: any) {
    throw new Error(`CLI execution failed: ${error.message}`);
  }
};

describe('CLI Output Quality Tests', () => {
  describe('Title Embedding Verification', () => {
    test('should embed title in border correctly', () => {
      const output = runCLI('"Test Title" --width 30');

      // Should contain title embedded in border
      expect(output).toContain('Test Title');

      const lines = output.split('\n');
      expect(lines.length).toBeGreaterThan(3); // At least top, content, bottom

      // First line should contain title and border characters
      expect(lines[0]).toMatch(/[┌╭┏╔].*Test Title.*[┐╮┓╗]/);
      expect(lines[0].length).toBe(30);
    });

    test('should handle different border styles', () => {
      const styles = [
        { style: 'single', topLeft: '┌', topRight: '┐' },
        { style: 'double', topLeft: '╔', topRight: '╗' },
        { style: 'round', topLeft: '╭', topRight: '╮' },
        { style: 'bold', topLeft: '┏', topRight: '┓' },
      ];

      styles.forEach(({ style, topLeft, topRight }) => {
        const output = runCLI(
          `"${style} Test" --border-style ${style} --width 25`
        );
        expect(output).toContain(`${style} Test`);

        const firstLine = output.split('\n')[0];
        expect(firstLine.charAt(0)).toBe(topLeft);
        expect(firstLine.charAt(24)).toBe(topRight);
      });
    });
  });

  describe('Title Alignment Verification', () => {
    test('should align title left by default', () => {
      const output = runCLI('"Left" --width 20');
      const firstLine = output.split('\n')[0];

      // Title should appear early in line (after border + space)
      const titleIndex = firstLine.indexOf('Left');
      expect(titleIndex).toBeLessThan(5); // Should be near start
    });

    test('should center align title', () => {
      const output = runCLI('"Center" --title-align center --width 30');
      const firstLine = output.split('\n')[0];

      const titleIndex = firstLine.indexOf('Center');
      const titleEnd = titleIndex + 'Center'.length;

      // Should be roughly centered
      expect(titleIndex).toBeGreaterThan(8);
      expect(titleEnd).toBeLessThan(22);
    });

    test('should right align title', () => {
      const output = runCLI('"Right" --title-align right --width 25');
      const firstLine = output.split('\n')[0];

      const titleIndex = firstLine.indexOf('Right');
      expect(titleIndex).toBeGreaterThan(15); // Should be near end
    });
  });

  describe('Width and Size Verification', () => {
    test('should respect width parameter', () => {
      const widths = [15, 25, 40, 60];

      widths.forEach(width => {
        const output = runCLI(`"Width ${width}" --width ${width}`);
        const lines = output.split('\n');

        // All lines should have exact width
        lines.forEach(line => {
          expect(line.length).toBe(width);
        });
      });
    });

    test('should handle minimum width gracefully', () => {
      const output = runCLI('"Min" --width 10');
      const firstLine = output.split('\n')[0];

      expect(firstLine.length).toBe(10);
      expect(output).toContain('Min');
    });
  });

  describe('International Text Support', () => {
    test('should handle Japanese text correctly', () => {
      const output = runCLI('"こんにちは" --width 25');

      expect(output).toContain('こんにちは');
      const firstLine = output.split('\n')[0];
      expect(getDisplayWidth(firstLine)).toBe(25);
    });

    test('should handle Chinese text correctly', () => {
      const output = runCLI('"你好世界" --width 25');

      expect(output).toContain('你好世界');
      const firstLine = output.split('\n')[0];
      expect(getDisplayWidth(firstLine)).toBe(25);
    });

    test('should handle mixed language text', () => {
      const output = runCLI('"Hello世界" --width 30');

      expect(output).toContain('Hello世界');
      const firstLine = output.split('\n')[0];
      expect(getDisplayWidth(firstLine)).toBe(30);
    });
  });

  describe('Truncation Verification', () => {
    test('should truncate long titles', () => {
      const longTitle = 'This is a very long title that should be truncated';
      const output = runCLI(`"${longTitle}" --width 20 --truncate`);

      expect(output).not.toContain(longTitle); // Full title shouldn't appear
      expect(output).toContain('…'); // Ellipsis should appear

      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(20);
    });

    test('should handle Japanese truncation', () => {
      const longJapanese = '非常に長い日本語のタイトルです';
      const output = runCLI(`"${longJapanese}" --width 15 --truncate`);

      expect(output).toContain('…');
      const firstLine = output.split('\n')[0];
      expect(getDisplayWidth(firstLine)).toBe(15);
    });
  });

  describe('Padding and Content Verification', () => {
    test('should apply padding correctly', () => {
      const output = runCLI('"Padded" --padding 2 --width 30');

      const lines = output.split('\n');
      expect(lines.length).toBeGreaterThan(5); // More lines due to padding

      // Should have empty padding lines
      const paddingLines = lines.filter(
        line => line.match(/^[│║┃]\s+[│║┃]$/) // Vertical borders with only spaces
      );
      expect(paddingLines.length).toBeGreaterThan(0);
    });

    test('should handle different padding values', () => {
      const paddingValues = [0, 1, 3];

      paddingValues.forEach(padding => {
        const output = runCLI(
          `"Pad${padding}" --padding ${padding} --width 25`
        );
        expect(output).toContain(`Pad${padding}`);

        const lines = output.split('\n');
        expect(lines.length).toBeGreaterThanOrEqual(3 + padding * 2); // At least base + padding
      });
    });
  });

  describe('Color Support Verification', () => {
    test('should accept color parameters without crashing', () => {
      const colors = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan'];

      colors.forEach(color => {
        expect(() => {
          runCLI(`"${color}" --color ${color} --width 25`);
        }).not.toThrow();
      });
    });
  });

  describe('Position Verification', () => {
    test('should support bottom title position', () => {
      const output = runCLI('"Bottom" --title-position bottom --width 25');

      expect(output).toContain('Bottom');
      const lines = output.split('\n');
      const lastLine = lines[lines.length - 1];

      // Title should be in last line (bottom border)
      expect(lastLine).toContain('Bottom');
      expect(lastLine).toMatch(/[└╰┗╚].*Bottom.*[┘╯┛╝]/);
    });

    test('should support bottom position with extreme widths', () => {
      const output = runCLI('"BottomWide" --title-position bottom --width 100');

      expect(output).toContain('BottomWide');
      const lines = output.split('\n');
      const lastLine = lines[lines.length - 1];

      // Title should be in last line (bottom border) with correct width
      expect(lastLine).toContain('BottomWide');
      expect(lastLine.length).toBe(100);
      expect(lastLine).toMatch(/[└╰┗╚].*BottomWide.*[┘╯┛╝]/);
    });
  });

  describe('Edge Cases Verification', () => {
    test('should handle empty title gracefully', () => {
      const output = runCLI('"" --width 25');

      const lines = output.split('\n');
      expect(lines.length).toBeGreaterThan(2);

      const firstLine = lines[0];
      expect(firstLine.length).toBe(25);
      // Should be normal border without title
      expect(firstLine).toMatch(/^[┌╭┏╔][─━═─]+[┐╮┓╗]$/);
    });

    test('should handle single character title', () => {
      const output = runCLI('"X" --width 20');

      expect(output).toContain('X');
      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(20);
    });

    test('should handle very wide boxes', () => {
      const output = runCLI('"Wide" --width 100');

      expect(output).toContain('Wide');
      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(100);
    });

    test('should support width up to 200 characters', () => {
      const output = runCLI('"Test" --width 200');

      expect(output).toContain('Test');
      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(200);
    });

    test('should handle extreme widths beyond terminal width', () => {
      // Test the specific case mentioned in Issue #12 - width 100 should give 100, not 80
      const output100 = runCLI('"Width100" --width 100');
      const firstLine100 = output100.split('\n')[0];
      expect(firstLine100.length).toBe(100);

      // Test width 150
      const output150 = runCLI('"Width150" --width 150');
      const firstLine150 = output150.split('\n')[0];
      expect(firstLine150.length).toBe(150);
    });
  });

  describe('Output Structure Verification', () => {
    test('should maintain consistent box structure', () => {
      const output = runCLI('"Structure" --width 30 --padding 1');

      const lines = output.split('\n');
      expect(lines.length).toBeGreaterThan(4);

      // First line should be title border
      expect(lines[0]).toMatch(/^[┌╭┏╔]/);
      expect(lines[0]).toContain('Structure');

      // Last line should be bottom border
      const lastLine = lines[lines.length - 1];
      expect(lastLine).toMatch(/^[└╰┗╚]/);
      expect(lastLine).toMatch(/[┘╯┛╝]$/);

      // All lines should have same width
      lines.forEach(line => {
        expect(line.length).toBe(30);
      });
    });
  });

  describe('Performance and Reliability', () => {
    test('should execute quickly for normal usage', () => {
      const start = Date.now();
      runCLI('"Performance" --width 50');
      const duration = Date.now() - start;

      // Should complete in reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000);
    });

    test('should handle repeated executions reliably', () => {
      // Run multiple times to check for consistency
      const outputs = [];
      for (let i = 0; i < 5; i++) {
        outputs.push(runCLI('"Consistent" --width 25'));
      }

      // All outputs should be identical
      outputs.forEach(output => {
        expect(output).toBe(outputs[0]);
      });
    });
  });
});
