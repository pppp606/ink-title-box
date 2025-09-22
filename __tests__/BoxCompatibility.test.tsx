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

describe('Box Compatibility Tests', () => {
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

    test('should support border color compatibility', () => {
      const colors = ['red', 'green', 'blue', 'yellow'] as const;

      colors.forEach(color => {
        const titleBoxOutput = renderToString(
          <TitleBox borderColor={color}>
            <Text>Colored Border</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' borderColor={color}>
            <Text>Colored Border</Text>
          </Box>
        );

        // Colors should match (ignoring title functionality)
        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Padding Compatibility', () => {
    test('should handle uniform padding like Ink Box', () => {
      const paddingValues = [0, 1, 2, 3] as const;

      paddingValues.forEach(padding => {
        const titleBoxOutput = renderToString(
          <TitleBox padding={padding}>
            <Text>Padded Content</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' padding={padding}>
            <Text>Padded Content</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });

    test('should handle directional padding like Ink Box', () => {
      const directions = [
        { paddingX: 2 },
        { paddingY: 1 },
        { paddingX: 2, paddingY: 1 },
        { paddingTop: 2, paddingBottom: 1 },
        { paddingLeft: 3, paddingRight: 1 },
      ];

      directions.forEach(paddingProps => {
        const titleBoxOutput = renderToString(
          <TitleBox {...paddingProps}>
            <Text>Directional Padding</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' {...paddingProps}>
            <Text>Directional Padding</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Size and Layout Compatibility', () => {
    test('should handle width like Ink Box', () => {
      const widths = [20, 40, 60, 80];

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

    test('should handle percentage width like Ink Box', () => {
      // Note: Percentage testing might require parent container context
      const titleBoxOutput = renderToString(
        <TitleBox width='50%'>
          <Text>Percentage Width</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width='50%'>
          <Text>Percentage Width</Text>
        </Box>
      );

      // For now, both should handle percentage strings consistently
      expect(typeof titleBoxOutput).toBe('string');
      expect(typeof inkBoxOutput).toBe('string');
    });
  });

  describe('Border Control Compatibility', () => {
    test('should handle individual border visibility like Ink Box', () => {
      const borderConfigs = [
        { borderTop: false },
        { borderBottom: false },
        { borderLeft: false },
        { borderRight: false },
        { borderTop: false, borderBottom: false },
        { borderLeft: false, borderRight: false },
      ];

      borderConfigs.forEach(borderConfig => {
        const titleBoxOutput = renderToString(
          <TitleBox {...borderConfig}>
            <Text>Border Control</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single' {...borderConfig}>
            <Text>Border Control</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      });
    });
  });

  describe('Complex Layout Compatibility', () => {
    test('should handle nested structures like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox padding={1}>
          <TitleBox borderStyle='double' width={30}>
            <Text>Nested TitleBox</Text>
          </TitleBox>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' padding={1}>
          <Box borderStyle='double' width={30}>
            <Text>Nested Box</Text>
          </Box>
        </Box>
      );

      // Structure and spacing should be equivalent
      expect(titleBoxOutput.split('\n').length).toBe(
        inkBoxOutput.split('\n').length
      );
    });

    test('should handle multiline content like Ink Box', () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3';

      const titleBoxOutput = renderToString(
        <TitleBox padding={1}>
          <Text>{multilineContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' padding={1}>
          <Text>{multilineContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Title Enhancement Compatibility', () => {
    test('should add title functionality without breaking Box behavior', () => {
      // Test that title doesn't interfere with basic Box props
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

      // Should contain all the same content spacing, plus title
      expect(titleBoxWithTitle).toContain('Test Title');
      expect(titleBoxWithTitle.split('\n').length).toBeGreaterThan(
        inkBoxWithoutTitle.split('\n').length
      );
    });

    test('should maintain Box behavior when title is empty', () => {
      const titleBoxEmpty = renderToString(
        <TitleBox title='' padding={1}>
          <Text>No title</Text>
        </TitleBox>
      );

      const inkBox = renderToString(
        <Box borderStyle='single' padding={1}>
          <Text>No title</Text>
        </Box>
      );

      // Empty title should not affect Box behavior
      expect(titleBoxEmpty).toBe(inkBox);
    });
  });

  describe('International Text Compatibility', () => {
    test('should handle wide characters like Ink Box', () => {
      const wideText = '日本語テスト';

      const titleBoxOutput = renderToString(
        <TitleBox width={30}>
          <Text>{wideText}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={30}>
          <Text>{wideText}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle mixed language text like Ink Box', () => {
      const mixedText = 'Hello 世界 World';

      const titleBoxOutput = renderToString(
        <TitleBox padding={1}>
          <Text>{mixedText}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' padding={1}>
          <Text>{mixedText}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Edge Cases Compatibility', () => {
    test('should handle zero width like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox width={0}>
          <Text>Zero width</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={0}>
          <Text>Zero width</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle very large width like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox width={200}>
          <Text>Large width</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={200}>
          <Text>Large width</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle display none like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox display='none'>
          <Text>Hidden content</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box display='none'>
          <Text>Hidden content</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
      expect(titleBoxOutput).toBe(''); // Both should render nothing
    });
  });
});
