import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { render } from 'ink-testing-library';
import { Box, Text } from 'ink';
import { TitleBox } from '../src/index.js';

// Helper function to render component to string
const renderToString = (component: React.ReactElement): string => {
  const { lastFrame } = render(component);
  return lastFrame() || '';
};

describe('Flexbox Compatibility Tests', () => {
  describe('Flex Direction Compatibility', () => {
    test('should handle flexDirection like Ink Box', () => {
      const directions = [
        'row',
        'column',
        'row-reverse',
        'column-reverse',
      ] as const;

      directions.forEach(direction => {
        const titleBoxOutput = renderToString(
          <TitleBox flexDirection={direction} width={40}>
            <Text>Item 1</Text>
            <Text>Item 2</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' flexDirection={direction} width={40}>
            <Text>Item 1</Text>
            <Text>Item 2</Text>
          </Box>
        );

        // Layout should be identical (ignoring title embedding capability)
        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Justify Content Compatibility', () => {
    test('should handle justifyContent like Ink Box', () => {
      const justifyValues = [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
      ] as const;

      justifyValues.forEach(justify => {
        const titleBoxOutput = renderToString(
          <TitleBox justifyContent={justify} width={50}>
            <Text>A</Text>
            <Text>B</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' justifyContent={justify} width={50}>
            <Text>A</Text>
            <Text>B</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Align Items Compatibility', () => {
    test('should handle alignItems like Ink Box', () => {
      const alignValues = [
        'flex-start',
        'center',
        'flex-end',
        'stretch',
      ] as const;

      alignValues.forEach(align => {
        const titleBoxOutput = renderToString(
          <TitleBox alignItems={align} width={40}>
            <Text>Short</Text>
            <Text>Much longer text content</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' alignItems={align} width={40}>
            <Text>Short</Text>
            <Text>Much longer text content</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Flex Grow/Shrink Compatibility', () => {
    test('should handle flexGrow like Ink Box', () => {
      const flexGrowValues = [0, 1, 2];

      flexGrowValues.forEach(grow => {
        const titleBoxOutput = renderToString(
          <Box width={80}>
            <TitleBox flexGrow={grow}>
              <Text>Growing Box</Text>
            </TitleBox>
            <Text>Static Content</Text>
          </Box>
        );

        const inkBoxOutput = renderToString(
          <Box width={80}>
            <Box borderStyle='single' flexGrow={grow}>
              <Text>Growing Box</Text>
            </Box>
            <Text>Static Content</Text>
          </Box>
        );

        // Layout behavior should be equivalent
        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });

    test('should handle flexShrink like Ink Box', () => {
      const flexShrinkValues = [0, 1, 2];

      flexShrinkValues.forEach(shrink => {
        const titleBoxOutput = renderToString(
          <Box width={20}>
            <TitleBox flexShrink={shrink} width={30}>
              <Text>Shrinking Content</Text>
            </TitleBox>
          </Box>
        );

        const inkBoxOutput = renderToString(
          <Box width={20}>
            <Box borderStyle='single' flexShrink={shrink} width={30}>
              <Text>Shrinking Content</Text>
            </Box>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Flex Basis Compatibility', () => {
    test('should handle numeric flexBasis like Ink Box', () => {
      const basisValues = [10, 20, 30];

      basisValues.forEach(basis => {
        const titleBoxOutput = renderToString(
          <Box width={80}>
            <TitleBox flexBasis={basis}>
              <Text>Basis {basis}</Text>
            </TitleBox>
            <Text>Other content</Text>
          </Box>
        );

        const inkBoxOutput = renderToString(
          <Box width={80}>
            <Box borderStyle='single' flexBasis={basis}>
              <Text>Basis {basis}</Text>
            </Box>
            <Text>Other content</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });

    test('should handle percentage flexBasis like Ink Box', () => {
      const percentageValues = ['25%', '50%', '75%'];

      percentageValues.forEach(basis => {
        const titleBoxOutput = renderToString(
          <Box width={80}>
            <TitleBox flexBasis={basis}>
              <Text>Percentage Basis</Text>
            </TitleBox>
            <Text>Other content</Text>
          </Box>
        );

        const inkBoxOutput = renderToString(
          <Box width={80}>
            <Box borderStyle='single' flexBasis={basis}>
              <Text>Percentage Basis</Text>
            </Box>
            <Text>Other content</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Flex Wrap Compatibility', () => {
    test('should handle flexWrap like Ink Box', () => {
      const wrapValues = ['nowrap', 'wrap', 'wrap-reverse'] as const;

      wrapValues.forEach(wrap => {
        const titleBoxOutput = renderToString(
          <TitleBox flexWrap={wrap} width={30}>
            <Text>Item 1 with long text</Text>
            <Text>Item 2 with long text</Text>
            <Text>Item 3 with long text</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' flexWrap={wrap} width={30}>
            <Text>Item 1 with long text</Text>
            <Text>Item 2 with long text</Text>
            <Text>Item 3 with long text</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Complex Flexbox Scenarios', () => {
    test('should handle combined flex properties like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox
          flexDirection='column'
          justifyContent='space-between'
          alignItems='center'
          width={40}
        >
          <Text>Header</Text>
          <Text>Middle Content</Text>
          <Text>Footer</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box
          borderStyle='single'
          flexDirection='column'
          justifyContent='space-between'
          alignItems='center'
          width={40}
        >
          <Text>Header</Text>
          <Text>Middle Content</Text>
          <Text>Footer</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle nested flex layouts like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox flexDirection='column' width={50}>
          <TitleBox justifyContent='space-between' width={46}>
            <Text>Left</Text>
            <Text>Right</Text>
          </TitleBox>
          <Text>Bottom Content</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' flexDirection='column' width={50}>
          <Box borderStyle='single' justifyContent='space-between' width={46}>
            <Text>Left</Text>
            <Text>Right</Text>
          </Box>
          <Text>Bottom Content</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Self Alignment Compatibility', () => {
    test('should handle alignSelf like Ink Box', () => {
      const selfAlignValues = [
        'flex-start',
        'center',
        'flex-end',
        'auto',
      ] as const;

      selfAlignValues.forEach(alignSelf => {
        const titleBoxOutput = renderToString(
          <Box flexDirection='column' alignItems='flex-start' width={40}>
            <TitleBox alignSelf={alignSelf}>
              <Text>Self-aligned content</Text>
            </TitleBox>
            <Text>Regular content</Text>
          </Box>
        );

        const inkBoxOutput = renderToString(
          <Box flexDirection='column' alignItems='flex-start' width={40}>
            <Box borderStyle='single' alignSelf={alignSelf}>
              <Text>Self-aligned content</Text>
            </Box>
            <Text>Regular content</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });
});
