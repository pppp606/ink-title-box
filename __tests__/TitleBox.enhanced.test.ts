import { describe, test, expect, jest } from '@jest/globals';
import React from 'react';

// Mock ink components to avoid ESM issues in some tests
const mockBox = ({ children, ...props }: any) =>
  React.createElement('div', props, children);
const mockText = ({ children, ...props }: any) =>
  React.createElement('span', props, children);

jest.mock('ink', () => ({
  Box: mockBox,
  Text: mockText,
}));

describe('TitleBox Enhanced Features', () => {
  describe('Border Drawing Styles', () => {
    test('should support ascii border style', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'ASCII Test', 
        borderStyle: 'ascii' 
      });

      expect(result.props.borderStyle).toBe('ascii');
    });

    test('should support single border style', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Single Test', 
        borderStyle: 'single' 
      });

      expect(result.props.borderStyle).toBe('single');
    });

    test('should support double border style', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Double Test', 
        borderStyle: 'double' 
      });

      expect(result.props.borderStyle).toBe('double');
    });

    test('should support round border style', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Round Test', 
        borderStyle: 'round' 
      });

      expect(result.props.borderStyle).toBe('round');
    });

    test('should default to round border style if not specified', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ title: 'Default Border' });

      expect(result.props.borderStyle).toBe('round');
    });
  });

  describe('Title Horizontal Alignment', () => {
    test('should support left title alignment', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Left Title', 
        titleAlign: 'left' 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('Left Title');
    });

    test('should support center title alignment', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Center Title', 
        titleAlign: 'center' 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('Center Title');
    });

    test('should support right title alignment', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Right Title', 
        titleAlign: 'right' 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('Right Title');
    });

    test('should default to left alignment if not specified', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ title: 'Default Align' });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('Default Align');
    });
  });

  describe('Title Vertical Positioning', () => {
    test('should support top title position', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Top Title', 
        titlePosition: 'top' 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('Top Title');
    });

    test('should support bottom title position', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Bottom Title', 
        titlePosition: 'bottom' 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('Bottom Title');
    });

    test('should default to top position if not specified', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ title: 'Default Position' });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('Default Position');
    });
  });

  describe('Custom Padding Support', () => {
    test('should support paddingX', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'PaddingX Test', 
        paddingX: 3 
      });

      expect(result.props.paddingLeft).toBe(3);
      expect(result.props.paddingRight).toBe(3);
    });

    test('should support paddingY', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'PaddingY Test', 
        paddingY: 2 
      });

      expect(result.props.paddingTop).toBe(2);
      expect(result.props.paddingBottom).toBe(2);
    });

    test('should support both paddingX and paddingY', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Both Paddings', 
        paddingX: 4, 
        paddingY: 2 
      });

      expect(result.props.paddingLeft).toBe(4);
      expect(result.props.paddingRight).toBe(4);
      expect(result.props.paddingTop).toBe(2);
      expect(result.props.paddingBottom).toBe(2);
    });

    test('should use legacy padding when paddingX/Y not specified', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: 'Legacy Padding', 
        padding: 3 
      });

      expect(result.props.paddingLeft).toBe(3);
      expect(result.props.paddingRight).toBe(3);
      expect(result.props.paddingTop).toBe(3);
      expect(result.props.paddingBottom).toBe(3);
    });
  });

  describe('Title Truncation', () => {
    test('should support title truncation with ellipsis', async () => {
      const { TitleBox } = await import('../src/index.js');

      const longTitle = 'This is a very long title that should be truncated';
      const result = TitleBox({ 
        title: longTitle, 
        width: 20, 
        truncate: true 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toContain('…');
    });

    test('should not truncate by default', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ title: 'Normal Title' });

      expect(result.type).toBe(mockBox);
      expect(result.props.children.props.children).toBe('Normal Title');
    });
  });

  describe('FullWidthSafe Mode', () => {
    test('should support fullWidthSafe mode', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ 
        title: '日本語タイトル', 
        fullWidthSafe: true 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('日本語タイトル');
    });

    test('should default fullWidthSafe to false', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({ title: 'English Title' });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      expect(result.props.children.props.children).toBe('English Title');
    });
  });

  describe('Multiple Title Support', () => {
    test('should support multiple titles with space-between alignment', async () => {
      const { TitleBox } = await import('../src/index.js');

      const titles = ['Left Title', 'Right Title'];
      const result = TitleBox({ 
        titles: titles, 
        titleAlign: 'space-between' 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children).toBeDefined();
      // For space-between with 2 titles, we expect a complex structure
      expect(result.props.children.props.children).toBeDefined();
    });

    test('should prioritize titles array over single title', async () => {
      const { TitleBox } = await import('../src/index.js');

      const titles = ['Multi Title 1', 'Multi Title 2'];
      const result = TitleBox({ 
        title: 'Single Title',
        titles: titles 
      });

      expect(result.type).toBe(mockBox);
      expect(result.props.children.props.children).toContain('Multi Title 1');
      expect(result.props.children.props.children).toContain('Multi Title 2');
    });
  });

  describe('TitleBox.Title Extension Slot', () => {
    test('should accept TitleBox.Title as children', async () => {
      const { TitleBox } = await import('../src/index.js');

      // Mock TitleBox.Title component
      const TitleComponent = React.createElement('span', {}, 'Custom Title');
      
      const result = TitleBox({ 
        children: TitleComponent 
      });

      expect(result.props.children).toBe(TitleComponent);
    });

    test('should support flexible title positioning with Title slot', async () => {
      const { TitleBox } = await import('../src/index.js');

      const CustomTitle = React.createElement('div', { 
        style: { display: 'flex', justifyContent: 'space-between' } 
      }, ['Left', 'Right']);
      
      const result = TitleBox({ 
        children: CustomTitle,
        titlePosition: 'top'
      });

      expect(result.props.children).toBe(CustomTitle);
      expect(result.type).toBe(mockBox);
    });
  });

  describe('Complex Integration', () => {
    test('should handle all features together', async () => {
      const { TitleBox } = await import('../src/index.js');

      const result = TitleBox({
        title: 'Complex Title',
        borderStyle: 'double',
        titleAlign: 'center',
        titlePosition: 'bottom',
        paddingX: 3,
        paddingY: 1,
        truncate: true,
        fullWidthSafe: true,
        width: 50
      });

      expect(result.props.borderStyle).toBe('double');
      expect(result.props.width).toBe(50);
      expect(result.props.paddingLeft).toBe(3);
      expect(result.props.paddingRight).toBe(3);
      expect(result.props.paddingTop).toBe(1);
      expect(result.props.paddingBottom).toBe(1);
      expect(result.props.children).toBeDefined();
    });
  });
});