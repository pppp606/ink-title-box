import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render } from 'ink-testing-library';
import { Box, Text } from 'ink';
import { TitleBox } from '../src/index.js';

/**
 * Ink Box Complete Compatibility Tests
 *
 * This comprehensive test suite validates that TitleBox (without title) behaves
 * identically to Ink's Box component across all features and edge cases.
 *
 * Test coverage includes:
 * - Basic rendering and children handling
 * - All padding variations (uniform, directional, individual)
 * - All border styles and colors supported by Ink
 * - Dimension handling (width, height, percentage, minWidth/Height)
 * - Complete flexbox layout system (direction, justify, align, wrap, gaps)
 * - Margin system with priority rules
 * - Border visibility controls
 * - Complex nested layouts and compositions
 *
 * Each test compares TitleBox output against Ink Box output using
 * ink-testing-library to ensure pixel-perfect compatibility.
 */
describe('Ink Box Complete Compatibility Tests', () => {
  const renderToString = (component: React.ReactElement): string => {
    const { lastFrame } = render(component);
    return lastFrame() || '';
  };

  describe('Basic Box Rendering', () => {
    test('empty box - should be identical', () => {
      const inkBox = renderToString(<Box borderStyle='single' />);
      const titleBox = renderToString(<TitleBox />);
      expect(titleBox).toBe(inkBox);
    });

    test('with fixed width - should be identical', () => {
      const inkBox = renderToString(<Box borderStyle='single' width={40} />);
      const titleBox = renderToString(<TitleBox width={40} />);
      expect(titleBox).toBe(inkBox);
    });

    test('with Text children - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40}>
          <Text>Hello World</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40}>
          <Text>Hello World</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('with multiple Text children - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40}>
          <Text>Line 1</Text>
          <Text>Line 2</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40}>
          <Text>Line 1</Text>
          <Text>Line 2</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });
  });

  describe('Padding Tests', () => {
    test('uniform padding - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} padding={2}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} padding={2}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('paddingX - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} paddingX={3}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} paddingX={3}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('paddingY - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} paddingY={2}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} paddingY={2}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('individual padding - should be identical', () => {
      const inkBox = renderToString(
        <Box
          borderStyle='single'
          width={40}
          paddingTop={1}
          paddingBottom={2}
          paddingLeft={3}
          paddingRight={4}
        >
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox
          width={40}
          paddingTop={1}
          paddingBottom={2}
          paddingLeft={3}
          paddingRight={4}
        >
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });
  });

  describe('Border Styles', () => {
    const borderStyles = ['single', 'double', 'round', 'bold'] as const;

    borderStyles.forEach(style => {
      test(`${style} border - should be identical`, () => {
        const inkBox = renderToString(
          <Box borderStyle={style} width={40}>
            <Text>Content</Text>
          </Box>
        );
        const titleBox = renderToString(
          <TitleBox borderStyle={style} width={40}>
            <Text>Content</Text>
          </TitleBox>
        );
        expect(titleBox).toBe(inkBox);
      });
    });
  });

  describe('Border Colors', () => {
    const colors = [
      'red',
      'green',
      'blue',
      'yellow',
      'magenta',
      'cyan',
    ] as const;

    colors.forEach(color => {
      test(`${color} border - should be identical`, () => {
        const inkBox = renderToString(
          <Box borderStyle='single' borderColor={color} width={40}>
            <Text>Content</Text>
          </Box>
        );
        const titleBox = renderToString(
          <TitleBox borderColor={color} width={40}>
            <Text>Content</Text>
          </TitleBox>
        );
        expect(titleBox).toBe(inkBox);
      });
    });
  });

  describe('Dimensions', () => {
    test('width and height - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={50} height={10}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={50} height={10}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('minWidth - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' minWidth={30}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox minWidth={30}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('percentage width - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width='50%'>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width='50%'>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });
  });

  describe('Flexbox Layout', () => {
    test('flexDirection row - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} flexDirection='row'>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} flexDirection='row'>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('flexDirection column - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} flexDirection='column'>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} flexDirection='column'>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('justifyContent center - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} justifyContent='center'>
          <Text>Centered</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} justifyContent='center'>
          <Text>Centered</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('alignItems center - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} height={5} alignItems='center'>
          <Text>Centered</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} height={5} alignItems='center'>
          <Text>Centered</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('gap property - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} gap={2}>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} gap={2}>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });
  });

  describe('Margins', () => {
    test('uniform margin - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} margin={2}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} margin={2}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('marginX and marginY - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} marginX={3} marginY={2}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} marginX={3} marginY={2}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });
  });

  describe('Border Control', () => {
    test('no top border - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} borderTop={false}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} borderTop={false}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('no bottom border - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={40} borderBottom={false}>
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} borderBottom={false}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('only left and right borders - should be identical', () => {
      const inkBox = renderToString(
        <Box
          borderStyle='single'
          width={40}
          borderTop={false}
          borderBottom={false}
        >
          <Text>Content</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={40} borderTop={false} borderBottom={false}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });
  });

  describe('Complex Layouts', () => {
    test('nested boxes - should be identical', () => {
      const inkBox = renderToString(
        <Box borderStyle='single' width={50} padding={2}>
          <Box borderStyle='double' padding={1}>
            <Text>Nested content</Text>
          </Box>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox width={50} padding={2}>
          <Box borderStyle='double' padding={1}>
            <Text>Nested content</Text>
          </Box>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });

    test('mixed flexbox and padding - should be identical', () => {
      const inkBox = renderToString(
        <Box
          borderStyle='single'
          width={60}
          padding={2}
          flexDirection='row'
          justifyContent='space-between'
        >
          <Text>Left</Text>
          <Text>Right</Text>
        </Box>
      );
      const titleBox = renderToString(
        <TitleBox
          width={60}
          padding={2}
          flexDirection='row'
          justifyContent='space-between'
        >
          <Text>Left</Text>
          <Text>Right</Text>
        </TitleBox>
      );
      expect(titleBox).toBe(inkBox);
    });
  });

  describe('Title Functionality (unique to TitleBox)', () => {
    test('with title - should embed in border', () => {
      const output = renderToString(
        <TitleBox title='My Title' width={40}>
          <Text>Content</Text>
        </TitleBox>
      );
      expect(output).toContain('My Title');
      expect(output).toContain('─'); // Border character
      expect(output.split('\n')[0]).toContain('My Title'); // Title in first line
    });

    test('title with different alignments', () => {
      const leftAligned = renderToString(
        <TitleBox title='Title' titleAlign='left' width={40}>
          <Text>Content</Text>
        </TitleBox>
      );

      const centerAligned = renderToString(
        <TitleBox title='Title' titleAlign='center' width={40}>
          <Text>Content</Text>
        </TitleBox>
      );

      const rightAligned = renderToString(
        <TitleBox title='Title' titleAlign='right' width={40}>
          <Text>Content</Text>
        </TitleBox>
      );

      // All should contain the title
      expect(leftAligned).toContain('Title');
      expect(centerAligned).toContain('Title');
      expect(rightAligned).toContain('Title');

      // Title position should differ
      const leftTitleIndex = leftAligned.split('\n')[0].indexOf('Title');
      const centerTitleIndex = centerAligned.split('\n')[0].indexOf('Title');
      const rightTitleIndex = rightAligned.split('\n')[0].indexOf('Title');

      expect(leftTitleIndex).toBeLessThan(centerTitleIndex);
      expect(centerTitleIndex).toBeLessThan(rightTitleIndex);
    });
  });
});
