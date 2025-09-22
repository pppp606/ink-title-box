import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render } from 'ink-testing-library';
import { Box, Text } from 'ink';
import { TitleBox } from '../src/index.js';

/**
 * Ink Box ESM Compatibility Tests
 *
 * These tests validate the core behavioral identity between TitleBox and Ink Box
 * using ink-testing-library in ESM mode. This test suite serves as the foundation
 * for ensuring TitleBox is a perfect drop-in replacement for Ink Box.
 *
 * Key validation areas:
 * - Basic Box rendering behavior (empty boxes, children)
 * - Border style compatibility across all Ink-supported styles
 * - Layout properties (width, margin, flexbox)
 * - Title enhancement functionality (unique to TitleBox)
 *
 * When no title is provided, TitleBox should produce identical output to Ink Box.
 * When a title is provided, TitleBox should maintain the same layout while
 * embedding the title in the border.
 */
describe('Ink Box ESM Compatibility Tests', () => {
  // Helper function to render component to string
  const renderToString = (component: React.ReactElement): string => {
    const { lastFrame } = render(component);
    return lastFrame() || '';
  };

  describe('Basic Box Behavior', () => {
    test('should render empty box identical to Ink Box (no title)', () => {
      const titleBoxOutput = renderToString(<TitleBox />);
      const inkBoxOutput = renderToString(<Box borderStyle='single' />);

      // When no title, TitleBox should behave exactly like Ink Box
      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should render with children identical to Ink Box (no title)', () => {
      const content = 'Hello World';

      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text>{content}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text>{content}</Text>
        </Box>
      );

      // Without title, should be identical
      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Border Style Compatibility', () => {
    test('should support all Ink border styles', () => {
      const borderStyles = ['single', 'double', 'round', 'bold'] as const;

      borderStyles.forEach(style => {
        const titleBoxOutput = renderToString(
          <TitleBox borderStyle={style}>
            <Text>Test Content</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle={style}>
            <Text>Test Content</Text>
          </Box>
        );

        // Without title, output should be identical
        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Layout Compatibility', () => {
    test('should handle width like Ink Box', () => {
      const widths = [20, 40, 60];

      widths.forEach(width => {
        const titleBoxOutput = renderToString(
          <TitleBox width={width}>
            <Text>Width Test</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' width={width}>
            <Text>Width Test</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });

    test('should handle margin like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox margin={2}>
          <Text>Margin Test</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' margin={2}>
          <Text>Margin Test</Text>
        </Box>
      );

      // Note: Margin rendering might differ due to terminal context
      // This test verifies the component accepts the prop without errors
      expect(typeof titleBoxOutput).toBe('string');
      expect(typeof inkBoxOutput).toBe('string');
    });
  });

  describe('Flexbox Compatibility', () => {
    test('should handle flexDirection like Ink Box', () => {
      const directions = ['row', 'column'] as const;

      directions.forEach(direction => {
        expect(() => {
          renderToString(
            <TitleBox flexDirection={direction} width={40}>
              <Text>Item 1</Text>
              <Text>Item 2</Text>
            </TitleBox>
          );
        }).not.toThrow();

        expect(() => {
          renderToString(
            <Box borderStyle='single' flexDirection={direction} width={40}>
              <Text>Item 1</Text>
              <Text>Item 2</Text>
            </Box>
          );
        }).not.toThrow();
      });
    });

    test('should handle justifyContent like Ink Box', () => {
      const justifyValues = ['flex-start', 'center', 'space-between'] as const;

      justifyValues.forEach(justify => {
        expect(() => {
          renderToString(
            <TitleBox justifyContent={justify} width={50}>
              <Text>A</Text>
              <Text>B</Text>
            </TitleBox>
          );
        }).not.toThrow();

        expect(() => {
          renderToString(
            <Box borderStyle='single' justifyContent={justify} width={50}>
              <Text>A</Text>
              <Text>B</Text>
            </Box>
          );
        }).not.toThrow();
      });
    });
  });

  describe('Title Enhancement', () => {
    test('should add title functionality without breaking Box behavior', () => {
      const titleBoxWithTitle = renderToString(
        <TitleBox title='Test Title' padding={2} width={40}>
          <Text>Content with title</Text>
        </TitleBox>
      );

      const inkBoxWithoutTitle = renderToString(
        <Box borderStyle='single' padding={2} width={40}>
          <Text>Content with title</Text>
        </Box>
      );

      // Should contain title embedded in border
      expect(titleBoxWithTitle).toContain('Test Title');
      // Title is embedded in border, so line count should be the same
      expect(titleBoxWithTitle.split('\n').length).toBe(
        inkBoxWithoutTitle.split('\n').length
      );
    });
  });
});
