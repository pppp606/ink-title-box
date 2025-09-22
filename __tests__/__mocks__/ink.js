// Mock implementation of ink for Jest tests
const React = require('react');

const Box = props => {
  return React.createElement(
    'div',
    { ...props, 'data-testid': 'ink-box' },
    props.children
  );
};

const Text = props => {
  return React.createElement(
    'span',
    { ...props, 'data-testid': 'ink-text' },
    props.children
  );
};

const render = () => {
  return {
    lastFrame: () => 'mocked-output',
    unmount: () => {},
  };
};

module.exports = {
  Box,
  Text,
  render,
};
