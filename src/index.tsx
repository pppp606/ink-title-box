import React from 'react';
import { Text } from 'ink';
import { type LiteralUnion } from 'type-fest';
import { type ForegroundColorName } from 'chalk';
import { type Boxes, type BoxStyle } from 'cli-boxes';
import stringWidth from 'string-width';

type TitleAlign = 'left' | 'center' | 'right' | 'space-between';
type TitlePosition = 'top' | 'bottom';
type BorderStyle = 'single' | 'double' | 'round' | 'bold' | 'ascii';

// Full Ink Box Props compatibility interface
interface TitleBoxProps {
  // TitleBox-specific props
  title?: string;
  titles?: string[];
  titleAlign?: TitleAlign;
  titlePosition?: TitlePosition;
  truncate?: boolean;
  fullWidthSafe?: boolean;

  // React props
  children?: React.ReactNode;

  // Layout & Spacing (Ink compatible)
  position?: 'absolute' | 'relative';
  columnGap?: number;
  rowGap?: number;
  gap?: number;

  // Margins (Ink compatible)
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  // Padding (Ink compatible)
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;

  // Flexbox (Ink compatible)
  flexGrow?: number;
  flexShrink?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexBasis?: number | string;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'auto';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'center';

  // Size (Ink compatible)
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;

  // Display (Ink compatible)
  display?: 'flex' | 'none';

  // Border (Ink compatible)
  borderStyle?: BorderStyle | keyof Boxes | BoxStyle;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderColor?: LiteralUnion<ForegroundColorName, string>;
  borderTopColor?: LiteralUnion<ForegroundColorName, string>;
  borderBottomColor?: LiteralUnion<ForegroundColorName, string>;
  borderLeftColor?: LiteralUnion<ForegroundColorName, string>;
  borderRightColor?: LiteralUnion<ForegroundColorName, string>;
  borderDimColor?: boolean;
  borderTopDimColor?: boolean;
  borderBottomDimColor?: boolean;
  borderLeftDimColor?: boolean;
  borderRightDimColor?: boolean;

  // Overflow (Ink compatible)
  overflow?: 'visible' | 'hidden';
  overflowX?: 'visible' | 'hidden';
  overflowY?: 'visible' | 'hidden';
}

// Dimension parsing utilities (Ink-compatible)
const parseDimension = (
  value: number | string | undefined,
  defaultValue = 0
): { type: 'number' | 'percent' | 'auto'; value: number } => {
  if (value === undefined) return { type: 'auto', value: 0 };
  if (typeof value === 'number') return { type: 'number', value };
  if (typeof value === 'string' && value.endsWith('%')) {
    return { type: 'percent', value: Number.parseInt(value, 10) };
  }
  return { type: 'number', value: defaultValue };
};

// Margin resolution utilities (following Ink priority)
const resolveMargins = (props: {
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}) => {
  const base = props.margin ?? 0;
  return {
    top: props.marginTop ?? props.marginY ?? base,
    bottom: props.marginBottom ?? props.marginY ?? base,
    left: props.marginLeft ?? props.marginX ?? base,
    right: props.marginRight ?? props.marginX ?? base,
  };
};

const getStringWidth = (str: string): number => {
  return stringWidth(str);
};

const truncateText = (text: string, maxWidth: number): string => {
  if (!maxWidth) return text;

  const textWidth = getStringWidth(text);
  if (textWidth <= maxWidth) return text;

  // Use simple character-by-character truncation with proper width measurement
  let truncated = '';
  let currentWidth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charWidth = stringWidth(char);

    // Reserve space for ellipsis (width = 1)
    if (currentWidth + charWidth > maxWidth - 1) {
      break;
    }

    truncated += char;
    currentWidth += charWidth;
  }

  return truncated + '…';
};

// Border character definitions
const BORDER_CHARS = {
  single: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
  },
  double: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
  },
  round: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
  },
  bold: {
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
  },
  ascii: {
    topLeft: '+',
    topRight: '+',
    bottomLeft: '+',
    bottomRight: '+',
    horizontal: '-',
    vertical: '|',
  },
};

const createTitleBorder = (
  title: string,
  width: number,
  borderStyle: BorderStyle,
  titleAlign: TitleAlign,
  truncate: boolean,
  fullWidthSafe: boolean,
  isBottom: boolean = false
): string => {
  const chars = BORDER_CHARS[borderStyle];
  const titleText = truncate ? truncateText(title, width - 4) : title;
  const titleWidth = getStringWidth(titleText);

  // Calculate available space for horizontal line
  const totalHorizontalSpace = width - 2; // excluding corner characters
  const remainingSpace = totalHorizontalSpace - titleWidth - 2; // -2 for spaces around title

  // Choose appropriate corner characters based on position
  const leftCorner = isBottom ? chars.bottomLeft : chars.topLeft;
  const rightCorner = isBottom ? chars.bottomRight : chars.topRight;

  if (remainingSpace < 0) {
    // Title too long, auto-truncate to fit
    const maxTitleWidth = width - 4; // Leave space for corners and spaces around title
    const truncatedTitle = truncateText(title, maxTitleWidth);
    const truncatedWidth = getStringWidth(truncatedTitle);
    const newRemainingSpace = width - 2 - truncatedWidth - 2;

    return (
      leftCorner +
      ` ${truncatedTitle} ` +
      chars.horizontal.repeat(Math.max(0, newRemainingSpace)) +
      rightCorner
    );
  }

  let leftPadding: number, rightPadding: number;

  switch (titleAlign) {
    case 'center':
      leftPadding = Math.floor(remainingSpace / 2);
      rightPadding = remainingSpace - leftPadding;
      break;
    case 'right':
      leftPadding = remainingSpace;
      rightPadding = 0;
      break;
    case 'left':
    default:
      leftPadding = 0;
      rightPadding = remainingSpace;
      break;
  }

  return (
    leftCorner +
    chars.horizontal.repeat(leftPadding) +
    ` ${titleText} ` +
    chars.horizontal.repeat(rightPadding) +
    rightCorner
  );
};

// Legacy render functions - kept for backward compatibility but not used in new implementation
// const renderTitles = (
//   props: TitleBoxProps,
//   availableWidth: number
// ): React.ReactNode => { ... }
//
// const renderAlignedTitle = (
//   text: string,
//   align: TitleAlign,
//   availableWidth: number,
//   fullWidthSafe: boolean
// ): React.ReactNode => { ... }

export const TitleBox: React.FC<TitleBoxProps> = props => {
  const {
    // TitleBox-specific props
    title = '',
    titles,
    titleAlign = 'left',
    titlePosition = 'top',
    truncate = false,
    fullWidthSafe = false,
    children,

    // Core Ink Box props
    borderStyle = 'single',
    borderColor = 'blue',
    width = 40,
    height,
    minWidth,
    minHeight,
    display = 'flex',

    // Padding props
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,

    // Margin props (Ink compatible)
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,

    // Flexbox props (Ink compatible)
    flexDirection = 'row',
    justifyContent = 'flex-start',
    // alignItems = 'stretch',
    // alignSelf,
    // flexGrow,
    // flexShrink,
    // flexBasis,
    // flexWrap = 'nowrap',

    // Gap props (Ink compatible)
    gap,
    columnGap,
    rowGap,

    // Border control (Ink compatible)
    borderTop = true,
    borderBottom = true,
    borderLeft = true,
    borderRight = true,
    // borderTopColor,
    // borderBottomColor,
    // borderLeftColor,
    // borderRightColor,
    // borderDimColor,
    // borderTopDimColor,
    // borderBottomDimColor,
    // borderLeftDimColor,
    // borderRightDimColor,

    // Overflow props (Ink compatible)
    overflow,
    overflowX,
    overflowY,

    // Position props (Ink compatible)
    // position,
  } = props;

  // Return null if display is none (Ink compatibility)
  if (display === 'none') {
    return null;
  }

  // Parse dimensions with Ink compatibility
  const parsedWidth = parseDimension(width, 40);
  const parsedHeight = parseDimension(height);
  const parsedMinWidth = parseDimension(minWidth);
  const parsedMinHeight = parseDimension(minHeight);

  // Resolve margins with Ink priority system
  const margins = resolveMargins({
    ...(margin !== undefined && { margin }),
    ...(marginX !== undefined && { marginX }),
    ...(marginY !== undefined && { marginY }),
    ...(marginTop !== undefined && { marginTop }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(marginLeft !== undefined && { marginLeft }),
    ...(marginRight !== undefined && { marginRight }),
  });

  // Handle Ink-compatible padding logic with fallbacks
  const resolvePadding = () => {
    const basePadding = padding !== undefined ? padding : 1;
    return {
      top: paddingTop ?? paddingY ?? basePadding,
      bottom: paddingBottom ?? paddingY ?? basePadding,
      left: paddingLeft ?? paddingX ?? basePadding,
      right: paddingRight ?? paddingX ?? basePadding,
    };
  };

  const finalPadding = resolvePadding();

  // Resolve gap properties (Ink compatible)
  const resolvedGaps = {
    row: rowGap ?? gap ?? 0,
    column: columnGap ?? gap ?? 0,
  };

  // Calculate resolved width (handle percentages)
  let resolvedWidth: number;
  if (parsedWidth.type === 'percent') {
    // For percentage, use a default container width (40) for now
    // In a real implementation, this would come from parent context
    resolvedWidth = Math.floor((40 * parsedWidth.value) / 100);
  } else {
    resolvedWidth = parsedWidth.value;
  }

  // Apply minimum width constraint
  if (
    parsedMinWidth.type === 'number' &&
    resolvedWidth < parsedMinWidth.value
  ) {
    resolvedWidth = parsedMinWidth.value;
  }

  // Calculate resolved height (if specified)
  let resolvedHeight: number | undefined;
  if (parsedHeight.type === 'number') {
    resolvedHeight = parsedHeight.value;
  } else if (parsedHeight.type === 'percent') {
    // For percentage height, use a default container height
    resolvedHeight = Math.floor((20 * parsedHeight.value) / 100);
  }

  // Apply minimum height constraint
  if (
    parsedMinHeight.type === 'number' &&
    resolvedHeight !== undefined &&
    resolvedHeight < parsedMinHeight.value
  ) {
    resolvedHeight = parsedMinHeight.value;
  }

  const chars = BORDER_CHARS[borderStyle as BorderStyle];

  // Calculate content area dimensions
  const borderWidth = {
    left: borderLeft ? 1 : 0,
    right: borderRight ? 1 : 0,
    top: borderTop ? 1 : 0,
    bottom: borderBottom ? 1 : 0,
  };

  const contentAreaWidth =
    resolvedWidth -
    borderWidth.left -
    borderWidth.right -
    finalPadding.left -
    finalPadding.right;

  // Handle child content with flexbox-like behavior
  let contentLines: string[] = [];

  if (children) {
    // Convert children to string array for layout
    const childrenString = String(children);
    contentLines = childrenString.split('\n');
  } else if (title || titles) {
    // Use title rendering for empty content
    contentLines = [''];
  }

  // Apply flexbox-like layout for multiple children
  if (Array.isArray(children) && children.length > 1) {
    // Simple flexbox simulation
    const childStrings = children.map(child => String(child));

    if (flexDirection === 'row' || flexDirection === 'row-reverse') {
      // Horizontal layout
      let layoutLine = childStrings.join(' '.repeat(resolvedGaps.column));

      if (flexDirection === 'row-reverse') {
        layoutLine = childStrings
          .reverse()
          .join(' '.repeat(resolvedGaps.column));
      }

      // Apply justifyContent for horizontal alignment
      if (justifyContent === 'center') {
        const lineWidth = getStringWidth(layoutLine);
        const padding = Math.floor((contentAreaWidth - lineWidth) / 2);
        layoutLine = ' '.repeat(Math.max(0, padding)) + layoutLine;
      } else if (justifyContent === 'flex-end') {
        const lineWidth = getStringWidth(layoutLine);
        const padding = contentAreaWidth - lineWidth;
        layoutLine = ' '.repeat(Math.max(0, padding)) + layoutLine;
      } else if (
        justifyContent === 'space-between' &&
        childStrings.length > 1
      ) {
        const totalChildWidth = childStrings.reduce(
          (sum, child) => sum + getStringWidth(child),
          0
        );
        const availableSpace = contentAreaWidth - totalChildWidth;
        const spaceBetween = Math.floor(
          availableSpace / (childStrings.length - 1)
        );
        layoutLine = childStrings.join(' '.repeat(Math.max(1, spaceBetween)));
      }

      contentLines = [layoutLine];
    } else {
      // Vertical layout (column)
      contentLines = childStrings;

      if (flexDirection === 'column-reverse') {
        contentLines = contentLines.reverse();
      }

      // Add row gaps
      if (resolvedGaps.row > 0 && contentLines.length > 1) {
        const gappedLines: string[] = [];
        contentLines.forEach((line, index) => {
          gappedLines.push(line);
          if (index < contentLines.length - 1) {
            for (let i = 0; i < resolvedGaps.row; i++) {
              gappedLines.push('');
            }
          }
        });
        contentLines = gappedLines;
      }
    }
  }

  // Calculate final content height
  const finalContentHeight = contentLines.length;

  // Apply height constraint if specified
  if (resolvedHeight !== undefined) {
    const availableContentHeight =
      resolvedHeight -
      borderWidth.top -
      borderWidth.bottom -
      finalPadding.top -
      finalPadding.bottom;

    if (finalContentHeight < availableContentHeight) {
      // Add empty lines to reach specified height
      const linesToAdd = availableContentHeight - finalContentHeight;

      if (justifyContent === 'center') {
        const topPadding = Math.floor(linesToAdd / 2);
        const bottomPadding = linesToAdd - topPadding;
        contentLines = Array(topPadding)
          .fill('')
          .concat(contentLines)
          .concat(Array(bottomPadding).fill(''));
      } else if (justifyContent === 'flex-end') {
        contentLines = Array(linesToAdd).fill('').concat(contentLines);
      } else {
        contentLines = contentLines.concat(Array(linesToAdd).fill(''));
      }
    } else if (finalContentHeight > availableContentHeight) {
      // Trim content if it exceeds height (overflow handling)
      const effectiveOverflow = overflowY ?? overflow ?? 'visible';
      if (effectiveOverflow === 'hidden') {
        contentLines = contentLines.slice(0, availableContentHeight);
      }
    }
  }

  // Apply horizontal overflow handling
  const effectiveOverflowX = overflowX ?? overflow ?? 'visible';
  if (effectiveOverflowX === 'hidden') {
    contentLines = contentLines.map(line => {
      const lineWidth = getStringWidth(line);
      if (lineWidth > contentAreaWidth) {
        return truncateText(line, contentAreaWidth);
      }
      return line;
    });
  }

  // Build final output with padding and borders
  const emptyLine =
    (borderLeft ? chars.vertical : ' ') +
    ' '.repeat(resolvedWidth - borderWidth.left - borderWidth.right) +
    (borderRight ? chars.vertical : ' ');

  const paddedLines: string[] = [];

  // Add top padding
  for (let i = 0; i < finalPadding.top; i++) {
    paddedLines.push(emptyLine);
  }

  // Add content with horizontal padding
  contentLines.forEach(line => {
    const paddedLine =
      (borderLeft ? chars.vertical : ' ') +
      ' '.repeat(finalPadding.left) +
      line.padEnd(Math.max(0, contentAreaWidth)) +
      ' '.repeat(finalPadding.right) +
      (borderRight ? chars.vertical : ' ');
    paddedLines.push(paddedLine);
  });

  // Add bottom padding
  for (let i = 0; i < finalPadding.bottom; i++) {
    paddedLines.push(emptyLine);
  }

  // Create borders with title embedding
  const topBorder =
    borderTop && (title || titles)
      ? createTitleBorder(
          title || titles?.[0] || '',
          resolvedWidth,
          borderStyle as BorderStyle,
          titleAlign,
          truncate,
          fullWidthSafe,
          false
        )
      : borderTop
        ? chars.topLeft +
          chars.horizontal.repeat(resolvedWidth - 2) +
          chars.topRight
        : ' '.repeat(resolvedWidth);

  const bottomBorder = borderBottom
    ? chars.bottomLeft +
      chars.horizontal.repeat(resolvedWidth - 2) +
      chars.bottomRight
    : ' '.repeat(resolvedWidth);

  // Assemble all lines
  const allLines: string[] = [];

  if (titlePosition === 'bottom') {
    if (borderTop) {
      allLines.push(
        borderTop
          ? chars.topLeft +
              chars.horizontal.repeat(resolvedWidth - 2) +
              chars.topRight
          : ''
      );
    }
    allLines.push(...paddedLines);
    if (borderBottom && (title || titles)) {
      allLines.push(
        createTitleBorder(
          title || titles?.[0] || '',
          resolvedWidth,
          borderStyle as BorderStyle,
          titleAlign,
          truncate,
          fullWidthSafe,
          true
        )
      );
    } else if (borderBottom) {
      allLines.push(bottomBorder);
    }
  } else {
    allLines.push(topBorder);
    allLines.push(...paddedLines);
    if (borderBottom) allLines.push(bottomBorder);
  }

  // Apply margin spacing
  const marginLines: string[] = [];

  // Top margin
  for (let i = 0; i < margins.top; i++) {
    marginLines.push(' '.repeat(resolvedWidth + margins.left + margins.right));
  }

  // Content with left/right margins
  allLines.forEach(line => {
    marginLines.push(
      ' '.repeat(margins.left) + line + ' '.repeat(margins.right)
    );
  });

  // Bottom margin
  for (let i = 0; i < margins.bottom; i++) {
    marginLines.push(' '.repeat(resolvedWidth + margins.left + margins.right));
  }

  // Apply border colors (Ink compatible)
  const effectiveBorderColor = borderColor || 'blue';

  return <Text color={effectiveBorderColor}>{marginLines.join('\n')}</Text>;
};

// Extension slot component
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Attach Title as a property of TitleBox
(TitleBox as typeof TitleBox & { Title: typeof Title }).Title = Title;

export default TitleBox;
