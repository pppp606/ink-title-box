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

describe('TitleBox Module', () => {
  test('should import TitleBox component without errors', async () => {
    // Dynamic import to handle ESM compatibility
    const { TitleBox, default: DefaultTitleBox } = await import(
      '../src/index.js'
    );

    expect(TitleBox).toBeDefined();
    expect(typeof TitleBox).toBe('function');
    expect(DefaultTitleBox).toBeDefined();
    expect(typeof DefaultTitleBox).toBe('function');
  });

  test('should export both named and default exports', async () => {
    const module = await import('../src/index.js');

    expect(module.TitleBox).toBeDefined();
    expect(module.default).toBeDefined();
    expect(module.TitleBox).toBe(module.default);
  });

  test('should be a React component function', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Check that it's a function (React component)
    expect(typeof TitleBox).toBe('function');
    expect(TitleBox.length).toBeGreaterThan(0); // Should accept props
  });

  test('should render without crashing with basic props', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Create element without rendering to DOM
    const element = React.createElement(TitleBox, { title: 'Test Title' });
    expect(element).toBeDefined();
    expect(element.type).toBe(TitleBox);
    expect(element.props.title).toBe('Test Title');
  });

  test('should accept all expected props', async () => {
    const { TitleBox } = await import('../src/index.js');

    const props = {
      title: 'Test Title',
      width: 50,
      padding: 2,
      borderColor: 'red',
    };

    const element = React.createElement(TitleBox, props);
    expect(element.props).toEqual(props);
  });

  test('should render with default props', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Test with minimal props to ensure defaults are used
    const element = React.createElement(TitleBox, { title: 'Default Test' });
    expect(element.type).toBe(TitleBox);
    expect(element.props.title).toBe('Default Test');
  });

  test('should handle all prop variations', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Test with all props
    const fullPropsElement = React.createElement(TitleBox, {
      title: 'Full Props Test',
      width: 60,
      padding: 3,
      borderColor: 'green',
    });

    expect(fullPropsElement.props.title).toBe('Full Props Test');
    expect(fullPropsElement.props.width).toBe(60);
    expect(fullPropsElement.props.padding).toBe(3);
    expect(fullPropsElement.props.borderColor).toBe('green');

    // Test with partial props
    const partialPropsElement = React.createElement(TitleBox, {
      title: 'Partial Props Test',
      width: 80,
    });

    expect(partialPropsElement.props.title).toBe('Partial Props Test');
    expect(partialPropsElement.props.width).toBe(80);
    // Other props should be undefined in props (defaults applied in component)
    expect(partialPropsElement.props.padding).toBeUndefined();
    expect(partialPropsElement.props.borderColor).toBeUndefined();
  });

  test('should execute component function with props', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Test component execution with default props
    const result = TitleBox({ title: 'Execution Test' });
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result.type).toBe(mockText); // TitleBox returns Text component

    // Test component execution with all props
    const resultWithAllProps = TitleBox({
      title: 'Full Execution Test',
      width: 50,
      padding: 2,
      borderColor: 'red',
    });
    expect(resultWithAllProps).toBeDefined();
    expect(resultWithAllProps.type).toBe(mockText);
    // TitleBox processes props internally and returns a Text with color prop and string content
    expect(resultWithAllProps.props.color).toBe('red');
    expect(typeof resultWithAllProps.props.children).toBe('string');
    expect(resultWithAllProps.props.children).toContain('Full Execution Test');
  });

  test('should apply default values when props are not provided', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Execute component with minimal props to test defaults
    const result = TitleBox({ title: 'Default Values Test' });

    // TitleBox applies defaults internally and returns a Text with default color
    expect(result.type).toBe(mockText); // TitleBox returns Text component
    expect(result.props.color).toBe('blue'); // default borderColor
    expect(typeof result.props.children).toBe('string');
    expect(result.props.children).toContain('Default Values Test');

  });

  test('should override default values with provided props', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Execute component with custom props
    const result = TitleBox({
      title: 'Custom Props Test',
      width: 100,
      padding: 5,
      borderColor: 'green',
    });

    // Custom props are processed internally and reflected in Text component
    expect(result.props.color).toBe('green'); // borderColor becomes color
    expect(typeof result.props.children).toBe('string');
    expect(result.props.children).toContain('Custom Props Test');
  });
});
