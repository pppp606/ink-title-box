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
    expect(result.type).toBe(mockBox); // Mocked Box component

    // Test component execution with all props
    const resultWithAllProps = TitleBox({
      title: 'Full Execution Test',
      width: 50,
      padding: 2,
      borderColor: 'red',
    });
    expect(resultWithAllProps).toBeDefined();
    expect(resultWithAllProps.type).toBe(mockBox);
    expect(resultWithAllProps.props.borderColor).toBe('red');
    expect(resultWithAllProps.props.width).toBe(50);
    expect(resultWithAllProps.props.padding).toBe(2);
  });

  test('should apply default values when props are not provided', async () => {
    const { TitleBox } = await import('../src/index.js');

    // Execute component with minimal props to test defaults
    const result = TitleBox({ title: 'Default Values Test' });

    // The result should be a Box element with default props applied
    expect(result.type).toBe(mockBox); // Mocked Box
    expect(result.props.borderStyle).toBe('round');
    expect(result.props.borderColor).toBe('blue'); // default value
    expect(result.props.width).toBe(40); // default value
    expect(result.props.padding).toBe(1); // default value

    // Should contain Text child with title
    expect(result.props.children).toBeDefined();
    expect(result.props.children.type).toBe(mockText); // Mocked Text
    expect(result.props.children.props.bold).toBe(true);
    expect(result.props.children.props.children).toBe('Default Values Test');
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

    expect(result.props.borderColor).toBe('green');
    expect(result.props.width).toBe(100);
    expect(result.props.padding).toBe(5);
    expect(result.props.children.props.children).toBe('Custom Props Test');
  });
});
