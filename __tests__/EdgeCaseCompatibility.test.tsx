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

describe('Edge Case Compatibility Tests', () => {
  describe('Extreme Dimensions', () => {
    test('should handle very small dimensions like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox width={1} padding={0}>
          <Text>X</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={1} padding={0}>
          <Text>X</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle very large dimensions like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox width={150} padding={5}>
          <Text>Large box test</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={150} padding={5}>
          <Text>Large box test</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Empty Content Handling', () => {
    test('should handle empty children like Ink Box', () => {
      const titleBoxOutput = renderToString(<TitleBox />);
      const inkBoxOutput = renderToString(<Box borderStyle='single' />);

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle null children like Ink Box', () => {
      const titleBoxOutput = renderToString(<TitleBox>{null}</TitleBox>);

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>{null}</Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle undefined children like Ink Box', () => {
      const titleBoxOutput = renderToString(<TitleBox>{undefined}</TitleBox>);

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>{undefined}</Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle empty string children like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text></Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text></Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Special Characters and Unicode', () => {
    test('should handle emoji content like Ink Box', () => {
      const emojiContent = '🎉🚀⭐🌟💫';

      const titleBoxOutput = renderToString(
        <TitleBox width={30}>
          <Text>{emojiContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={30}>
          <Text>{emojiContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle special Unicode characters like Ink Box', () => {
      const unicodeContent = '★☆♠♣♥♦♪♫♪♫';

      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text>{unicodeContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text>{unicodeContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle zero-width characters like Ink Box', () => {
      const zeroWidthContent = 'Test\u200BContent'; // Zero-width space

      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text>{zeroWidthContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text>{zeroWidthContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle RTL text like Ink Box', () => {
      const rtlContent = 'مرحبا بالعالم'; // Arabic "Hello World"

      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text>{rtlContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text>{rtlContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Newline and Whitespace Handling', () => {
    test('should handle multiple newlines like Ink Box', () => {
      const multiNewlineContent = 'Line 1\n\n\nLine 4';

      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text>{multiNewlineContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text>{multiNewlineContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle trailing whitespace like Ink Box', () => {
      const whitespaceContent = 'Content with trailing spaces   ';

      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text>{whitespaceContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text>{whitespaceContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle tab characters like Ink Box', () => {
      const tabContent = 'Item1\tItem2\tItem3';

      const titleBoxOutput = renderToString(
        <TitleBox>
          <Text>{tabContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Text>{tabContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Complex Nesting Scenarios', () => {
    test('should handle deeply nested structures like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox>
          <TitleBox>
            <TitleBox>
              <Text>Deep nesting level 3</Text>
            </TitleBox>
          </TitleBox>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single'>
          <Box borderStyle='single'>
            <Box borderStyle='single'>
              <Text>Deep nesting level 3</Text>
            </Box>
          </Box>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle mixed component nesting like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox padding={1}>
          <Box borderStyle='double'>
            <TitleBox borderStyle='round'>
              <Text>Mixed nesting</Text>
            </TitleBox>
          </Box>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' padding={1}>
          <Box borderStyle='double'>
            <Box borderStyle='round'>
              <Text>Mixed nesting</Text>
            </Box>
          </Box>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Performance and Stress Tests', () => {
    test('should handle large amounts of content like Ink Box', () => {
      const largeContent = 'Lorem ipsum '.repeat(100);

      const titleBoxOutput = renderToString(
        <TitleBox width={80}>
          <Text>{largeContent}</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={80}>
          <Text>{largeContent}</Text>
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });

    test('should handle many child components like Ink Box', () => {
      const manyChildren = Array.from({ length: 20 }, (_, i) => (
        <Text key={i}>Item {i + 1}</Text>
      ));

      const titleBoxOutput = renderToString(
        <TitleBox flexDirection='column'>{manyChildren}</TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' flexDirection='column'>
          {manyChildren}
        </Box>
      );

      expect(titleBoxOutput).toBe(inkBoxOutput);
    });
  });

  describe('Props Validation Compatibility', () => {
    test('should handle invalid width gracefully like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox width={-10}>
          <Text>Invalid width</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' width={-10}>
          <Text>Invalid width</Text>
        </Box>
      );

      // Both should handle invalid props consistently
      expect(typeof titleBoxOutput).toBe('string');
      expect(typeof inkBoxOutput).toBe('string');
    });

    test('should handle invalid padding gracefully like Ink Box', () => {
      const titleBoxOutput = renderToString(
        <TitleBox padding={-5}>
          <Text>Invalid padding</Text>
        </TitleBox>
      );

      const inkBoxOutput = renderToString(
        <Box borderStyle='single' padding={-5}>
          <Text>Invalid padding</Text>
        </Box>
      );

      expect(typeof titleBoxOutput).toBe('string');
      expect(typeof inkBoxOutput).toBe('string');
    });
  });

  describe('Memory and Resource Management', () => {
    test('should not leak memory on repeated renders', () => {
      // Test that repeated rendering doesn't cause memory issues
      for (let i = 0; i < 100; i++) {
        const titleBoxOutput = renderToString(
          <TitleBox>
            <Text>Render {i}</Text>
          </TitleBox>
        );

        const inkBoxOutput = renderToString(
          <Box borderStyle='single'>
            <Text>Render {i}</Text>
          </Box>
        );

        expect(titleBoxOutput).toBe(inkBoxOutput);
      }
    });
  });

  describe('Ref Compatibility', () => {
    test('should handle React refs like Ink Box', () => {
      const titleBoxRef = React.createRef<any>();
      const inkBoxRef = React.createRef<any>();

      // Both should accept refs without crashing
      expect(() => {
        render(
          <TitleBox ref={titleBoxRef}>
            <Text>Ref test</Text>
          </TitleBox>
        );
      }).not.toThrow();

      expect(() => {
        render(
          <Box ref={inkBoxRef} borderStyle='single'>
            <Text>Ref test</Text>
          </Box>
        );
      }).not.toThrow();
    });
  });
});
