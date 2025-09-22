import { describe, test, expect } from '@jest/globals';
import React from 'react';
import { TitleBox } from '../src/index.js';

// Manual compatibility tests without ink-testing-library to avoid ESM issues
describe('Box Compatibility Manual Tests', () => {
  describe('Basic Component Functionality', () => {
    test('should instantiate TitleBox component without errors', () => {
      expect(() => {
        TitleBox({
          title: 'Test',
          width: 40,
        });
      }).not.toThrow();
    });

    test('should handle all new props without errors', () => {
      expect(() => {
        TitleBox({
          title: 'Test',
          width: 40,
          height: 10,
          minWidth: 20,
          minHeight: 5,
          margin: 2,
          marginX: 1,
          marginY: 1,
          marginTop: 1,
          marginBottom: 1,
          marginLeft: 1,
          marginRight: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: 'auto',
          flexWrap: 'wrap',
          gap: 1,
          columnGap: 1,
          rowGap: 1,
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden',
          borderTop: true,
          borderBottom: true,
          borderLeft: true,
          borderRight: true,
          position: 'relative',
        });
      }).not.toThrow();
    });

    test('should handle percentage dimensions', () => {
      expect(() => {
        TitleBox({
          title: 'Test',
          width: '50%',
          height: '25%',
          minWidth: '20%',
          minHeight: '10%',
        });
      }).not.toThrow();
    });

    test('should handle display none', () => {
      const result = TitleBox({
        title: 'Test',
        display: 'none',
      });
      expect(result).toBeNull();
    });

    test('should handle flexbox properties', () => {
      expect(() => {
        TitleBox({
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          children: React.createElement('span', {}, 'Test'),
        });
      }).not.toThrow();
    });

    test('should handle gap properties', () => {
      expect(() => {
        TitleBox({
          gap: 2,
          columnGap: 1,
          rowGap: 1,
          children: React.createElement('span', {}, 'Test'),
        });
      }).not.toThrow();
    });

    test('should handle margin properties', () => {
      expect(() => {
        TitleBox({
          margin: 2,
          marginX: 1,
          marginY: 1,
          children: React.createElement('span', {}, 'Test'),
        });
      }).not.toThrow();
    });

    test('should handle individual border controls', () => {
      expect(() => {
        TitleBox({
          borderTop: false,
          borderBottom: true,
          borderLeft: false,
          borderRight: true,
          children: React.createElement('span', {}, 'Test'),
        });
      }).not.toThrow();
    });

    test('should handle overflow properties', () => {
      expect(() => {
        TitleBox({
          overflow: 'hidden',
          overflowX: 'visible',
          overflowY: 'hidden',
          children: React.createElement('span', {}, 'Test'),
        });
      }).not.toThrow();
    });

    test('should handle height constraints', () => {
      expect(() => {
        TitleBox({
          height: 10,
          minHeight: 5,
          children: React.createElement('span', {}, 'Test'),
        });
      }).not.toThrow();
    });
  });

  describe('Props Interface Compatibility', () => {
    test('should accept all Ink Box props without TypeScript errors', () => {
      // This test ensures our interface is compatible with Ink Box
      const validProps = {
        // Layout & Spacing
        position: 'absolute' as const,
        columnGap: 1,
        rowGap: 1,
        gap: 1,

        // Margins
        margin: 1,
        marginX: 1,
        marginY: 1,
        marginTop: 1,
        marginBottom: 1,
        marginLeft: 1,
        marginRight: 1,

        // Padding
        padding: 1,
        paddingX: 1,
        paddingY: 1,
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 1,
        paddingRight: 1,

        // Flexbox
        flexGrow: 1,
        flexShrink: 0,
        flexDirection: 'column' as const,
        flexBasis: 'auto' as string,
        flexWrap: 'wrap' as const,
        alignItems: 'center' as const,
        alignSelf: 'flex-start' as const,
        justifyContent: 'space-between' as const,

        // Size
        width: 40,
        height: 20,
        minWidth: 20,
        minHeight: 10,

        // Display
        display: 'flex' as const,

        // Border
        borderStyle: 'single' as const,
        borderTop: true,
        borderBottom: false,
        borderLeft: true,
        borderRight: false,
        borderColor: 'blue' as const,

        // Overflow
        overflow: 'hidden' as const,
        overflowX: 'visible' as const,
        overflowY: 'hidden' as const,
      };

      expect(() => {
        TitleBox(validProps);
      }).not.toThrow();
    });
  });
});
