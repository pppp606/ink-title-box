import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { TitleBox } from '../src/index.js';

// Helper function to render component to string
const renderToString = (component: React.ReactElement): string => {
  const { lastFrame } = render(component);
  return lastFrame() || '';
};

describe('Title Functionality Tests', () => {
  describe('Title Embedding in Borders', () => {
    test('should embed title in top border', () => {
      const output = renderToString(
        <TitleBox title='Test Title' width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      // Should contain title embedded in border
      expect(output).toContain('Test Title');
      // Should not be a separate line, but embedded in border characters
      const lines = output.split('\n');
      expect(lines[0]).toContain('Test Title');
      expect(lines[0]).toMatch(/[┌╭┏╔].*Test Title.*[┐╮┓╗]/);
    });

    test('should embed title in bottom border when titlePosition is bottom', () => {
      const output = renderToString(
        <TitleBox title='Bottom Title' titlePosition='bottom' width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('Bottom Title');
      const lines = output.split('\n');
      const lastLine = lines[lines.length - 1];
      expect(lastLine).toContain('Bottom Title');
      expect(lastLine).toMatch(/[└╰┗╚].*Bottom Title.*[┘╯┛╝]/);
    });
  });

  describe('Title Alignment', () => {
    test('should align title to the left by default', () => {
      const output = renderToString(
        <TitleBox title='Left' width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      const firstLine = output.split('\n')[0];
      // Title should appear near the left side after border character and space
      expect(firstLine).toMatch(/^[┌╭┏╔] Left/);
    });

    test('should center align title', () => {
      const output = renderToString(
        <TitleBox title='Center' titleAlign='center' width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      const firstLine = output.split('\n')[0];
      // Title should be roughly centered with padding on both sides
      expect(firstLine).toContain('Center');

      // Count characters before title
      const beforeTitle = firstLine.indexOf('Center');
      const afterTitle =
        firstLine.length - firstLine.indexOf('Center') - 'Center'.length;
      // Should be approximately balanced (allowing for border chars)
      expect(Math.abs(beforeTitle - afterTitle)).toBeLessThan(5);
    });

    test('should right align title', () => {
      const output = renderToString(
        <TitleBox title='Right' titleAlign='right' width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      const firstLine = output.split('\n')[0];
      // Title should appear near the right side before border character and space
      expect(firstLine).toMatch(/Right [┐╮┓╗]$/);
    });
  });

  describe('Title Truncation', () => {
    test('should truncate long titles when truncate is enabled', () => {
      const longTitle = 'This is a very long title that should be truncated';
      const output = renderToString(
        <TitleBox title={longTitle} width={20} truncate>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).not.toContain(longTitle); // Full title shouldn't appear
      expect(output).toContain('…'); // Ellipsis should appear

      const firstLine = output.split('\n')[0];
      // First line should be exactly 20 characters
      expect(firstLine.length).toBe(20);
    });

    test('should auto-truncate when title is too long even without truncate flag', () => {
      const veryLongTitle =
        'An extremely long title that exceeds box width significantly';
      const output = renderToString(
        <TitleBox title={veryLongTitle} width={15}>
          <Text>Content</Text>
        </TitleBox>
      );

      const firstLine = output.split('\n')[0];
      // Should still render properly and fit within width
      expect(firstLine.length).toBe(15);
      expect(output).toContain('…'); // Should auto-truncate
    });

    test('should not truncate short titles', () => {
      const shortTitle = 'Short';
      const output = renderToString(
        <TitleBox title={shortTitle} width={30} truncate>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain(shortTitle);
      expect(output).not.toContain('…');
    });
  });

  describe('International Text Support', () => {
    test('should handle Japanese titles correctly', () => {
      const japaneseTitle = 'こんにちは世界';
      const output = renderToString(
        <TitleBox title={japaneseTitle} width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain(japaneseTitle);

      const firstLine = output.split('\n')[0];
      // Should render correctly accounting for full-width characters
      expect(firstLine.length).toBe(30);
    });

    test('should handle Chinese titles correctly', () => {
      const chineseTitle = '你好世界测试';
      const output = renderToString(
        <TitleBox title={chineseTitle} width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain(chineseTitle);
      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(25);
    });

    test('should handle mixed language titles correctly', () => {
      const mixedTitle = 'Hello世界Test';
      const output = renderToString(
        <TitleBox title={mixedTitle} width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain(mixedTitle);
      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(30);
    });

    test('should truncate Japanese text correctly', () => {
      const longJapaneseTitle = '非常に長い日本語のタイトルテキスト';
      const output = renderToString(
        <TitleBox title={longJapaneseTitle} width={20} truncate>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('…');
      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(20);
    });
  });

  describe('Title with Multiple Border Styles', () => {
    test('should embed title in single border style', () => {
      const output = renderToString(
        <TitleBox title='Single' borderStyle='single' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('Single');
      const firstLine = output.split('\n')[0];
      expect(firstLine).toMatch(/^┌.*Single.*┐$/);
    });

    test('should embed title in double border style', () => {
      const output = renderToString(
        <TitleBox title='Double' borderStyle='double' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('Double');
      const firstLine = output.split('\n')[0];
      expect(firstLine).toMatch(/^╔.*Double.*╗$/);
    });

    test('should embed title in round border style', () => {
      const output = renderToString(
        <TitleBox title='Round' borderStyle='round' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('Round');
      const firstLine = output.split('\n')[0];
      expect(firstLine).toMatch(/^╭.*Round.*╮$/);
    });

    test('should embed title in bold border style', () => {
      const output = renderToString(
        <TitleBox title='Bold' borderStyle='bold' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('Bold');
      const firstLine = output.split('\n')[0];
      expect(firstLine).toMatch(/^┏.*Bold.*┓$/);
    });
  });

  describe('Title with Color Support', () => {
    test('should render title with border color', () => {
      const output = renderToString(
        <TitleBox title='Colored' borderColor='red' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('Colored');
      // Note: Color testing is limited in text output, but should not crash
    });
  });

  describe('Empty and Edge Case Titles', () => {
    test('should handle empty title gracefully', () => {
      const output = renderToString(
        <TitleBox title='' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      // Should render like a normal box without title
      const firstLine = output.split('\n')[0];
      expect(firstLine).toMatch(/^[┌╭┏╔][─━═─]+[┐╮┓╗]$/);
      expect(firstLine.length).toBe(25);
    });

    test('should handle whitespace-only title', () => {
      const output = renderToString(
        <TitleBox title='   ' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('   ');
      const firstLine = output.split('\n')[0];
      expect(firstLine.length).toBe(25);
    });

    test('should handle single character title', () => {
      const output = renderToString(
        <TitleBox title='X' width={25}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('X');
      const firstLine = output.split('\n')[0];
      expect(firstLine).toMatch(/^[┌╭┏╔] X /);
    });
  });

  describe('Title with Box Features', () => {
    test('should combine title with padding', () => {
      const output = renderToString(
        <TitleBox title='Padded' padding={2} width={30}>
          <Text>Content</Text>
        </TitleBox>
      );

      expect(output).toContain('Padded');
      expect(output).toContain('Content');

      const lines = output.split('\n');
      // Should have extra padding lines
      expect(lines.length).toBeGreaterThan(5); // More lines due to padding
    });

    test('should combine title with custom width', () => {
      const widths = [15, 25, 35, 50];

      widths.forEach(width => {
        const output = renderToString(
          <TitleBox title='Width Test' width={width}>
            <Text>Content</Text>
          </TitleBox>
        );

        const firstLine = output.split('\n')[0];
        expect(firstLine.length).toBe(width);
        expect(output).toContain('Width Test');
      });
    });

    test('should maintain box structure with title', () => {
      const output = renderToString(
        <TitleBox title='Structure' width={25} padding={1}>
          <Text>Line 1</Text>
          <Text>Line 2</Text>
        </TitleBox>
      );

      expect(output).toContain('Structure');
      expect(output).toContain('Line 1');
      expect(output).toContain('Line 2');

      const lines = output.split('\n');
      // Should have proper box structure: title border + padding + content + padding + bottom border
      expect(lines.length).toBeGreaterThan(5);

      // First and last lines should be borders
      expect(lines[0]).toMatch(/^[┌╭┏╔]/);
      expect(lines[lines.length - 1]).toMatch(/^[└╰┗╚]/);
    });
  });
});
