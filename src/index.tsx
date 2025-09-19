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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getStringWidth = (str: string, fullWidthSafe: boolean): number => {
  // Use string-width for accurate character width calculation
  // The fullWidthSafe parameter is kept for backward compatibility
  // but string-width already handles full-width characters properly
  return stringWidth(str);
};

const truncateText = (
  text: string,
  maxWidth: number,
  fullWidthSafe: boolean = false
): string => {
  if (!maxWidth) return text;

  const textWidth = getStringWidth(text, fullWidthSafe);
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
  const titleText = truncate
    ? truncateText(title, width - 4, fullWidthSafe)
    : title;
  const titleWidth = getStringWidth(titleText, fullWidthSafe);

  // Calculate available space for horizontal line
  const totalHorizontalSpace = width - 2; // excluding corner characters
  const remainingSpace = totalHorizontalSpace - titleWidth - 2; // -2 for spaces around title

  // Choose appropriate corner characters based on position
  const leftCorner = isBottom ? chars.bottomLeft : chars.topLeft;
  const rightCorner = isBottom ? chars.bottomRight : chars.topRight;

  if (remainingSpace < 0) {
    // Title too long, auto-truncate to fit
    const maxTitleWidth = width - 4; // Leave space for corners and spaces around title
    const truncatedTitle = truncateText(title, maxTitleWidth, fullWidthSafe);
    const truncatedWidth = getStringWidth(truncatedTitle, fullWidthSafe);
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

const renderTitles = (
  props: TitleBoxProps,
  availableWidth: number
): React.ReactNode => {
  const {
    title,
    titles,
    titleAlign = 'left',
    truncate = false,
    fullWidthSafe = false,
  } = props;

  // Note: fullWidthSafe is kept for backward compatibility
  // but string-width already handles full-width characters properly

  // Calculate content width (total width minus borders and padding)
  const BORDER_WIDTH = 2; // Left and right borders
  const DEFAULT_PADDING = 2; // Default left and right content padding
  const contentWidth = availableWidth - BORDER_WIDTH - DEFAULT_PADDING;

  // Priority: titles array > title string > children
  if (titles && titles.length > 0) {
    if (titleAlign === 'space-between' && titles.length === 2) {
      const [leftTitle, rightTitle] = titles;

      // Calculate maximum width for each title
      const MIN_SPACING = 1; // Minimum space between titles
      const maxTitleWidth = Math.floor((contentWidth - MIN_SPACING) / 2);

      // Process titles with truncation if needed
      const processedLeft = truncate
        ? truncateText(leftTitle, maxTitleWidth, fullWidthSafe)
        : leftTitle;
      const processedRight = truncate
        ? truncateText(rightTitle, maxTitleWidth, fullWidthSafe)
        : rightTitle;

      // Calculate actual widths after processing
      const leftWidth = getStringWidth(processedLeft, fullWidthSafe);
      const rightWidth = getStringWidth(processedRight, fullWidthSafe);
      const spacingWidth = contentWidth - leftWidth - rightWidth;
      const spacing = ' '.repeat(Math.max(MIN_SPACING, spacingWidth));

      return (
        <Text bold>
          {processedLeft}
          {spacing}
          {processedRight}
        </Text>
      );
    } else {
      const combinedTitle = titles.join(' ');
      const processedTitle = truncate
        ? truncateText(combinedTitle, contentWidth, fullWidthSafe)
        : combinedTitle;
      return renderAlignedTitle(
        processedTitle,
        titleAlign,
        contentWidth,
        fullWidthSafe
      );
    }
  }

  if (title) {
    const processedTitle = truncate
      ? truncateText(title, contentWidth, fullWidthSafe)
      : title;
    return renderAlignedTitle(
      processedTitle,
      titleAlign,
      contentWidth,
      fullWidthSafe
    );
  }

  return null;
};

const renderAlignedTitle = (
  text: string,
  align: TitleAlign,
  availableWidth: number,
  fullWidthSafe: boolean
): React.ReactNode => {
  const textWidth = getStringWidth(text, fullWidthSafe);

  switch (align) {
    case 'left':
      return <Text bold>{text}</Text>;

    case 'center': {
      const paddingLength = Math.floor((availableWidth - textWidth) / 2);
      const leftPadding = ' '.repeat(Math.max(0, paddingLength));
      return (
        <Text bold>
          {leftPadding}
          {text}
        </Text>
      );
    }

    case 'right': {
      const paddingLength = availableWidth - textWidth;
      const leftPadding = ' '.repeat(Math.max(0, paddingLength));
      return (
        <Text bold>
          {leftPadding}
          {text}
        </Text>
      );
    }

    default:
      return <Text bold>{text}</Text>;
  }
};

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
    display = 'flex',

    // Padding props
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,

    // Border control
    borderTop = true,
    borderBottom = true,
    borderLeft = true,
    borderRight = true,

    // All other Ink props (for future compatibility)
    // Future props will be handled here
  } = props;

  // Return null if display is none (Ink compatibility)
  if (display === 'none') {
    return null;
  }

  const chars = BORDER_CHARS[borderStyle as BorderStyle];

  // Handle Ink-compatible padding logic with fallbacks
  const resolvePadding = () => {
    const basePadding = padding !== undefined ? padding : 1;

    return {
      top:
        paddingTop !== undefined
          ? paddingTop
          : paddingY !== undefined
            ? paddingY
            : basePadding,
      bottom:
        paddingBottom !== undefined
          ? paddingBottom
          : paddingY !== undefined
            ? paddingY
            : basePadding,
      left:
        paddingLeft !== undefined
          ? paddingLeft
          : paddingX !== undefined
            ? paddingX
            : basePadding,
      right:
        paddingRight !== undefined
          ? paddingRight
          : paddingX !== undefined
            ? paddingX
            : basePadding,
    };
  };

  const finalPadding = resolvePadding();

  // Resolve width (support string/percentage in the future)
  const resolvedWidth = typeof width === 'string' ? 40 : width;

  // Create content lines
  const contentLines: string[] = [];
  if (children) {
    contentLines.push(String(children));
  } else {
    // Use title rendering
    const titleElement = renderTitles(props, resolvedWidth);
    if (titleElement) {
      contentLines.push(''); // Empty content when using title
    }
  }

  // Add padding lines with Ink-compatible padding and border controls
  const emptyLine =
    (borderLeft ? chars.vertical : ' ') +
    ' '.repeat(resolvedWidth - (borderLeft ? 1 : 0) - (borderRight ? 1 : 0)) +
    (borderRight ? chars.vertical : ' ');
  const paddedLines: string[] = [];

  // Add top padding
  for (let i = 0; i < finalPadding.top; i++) {
    paddedLines.push(emptyLine);
  }

  // Add content with horizontal padding
  contentLines.forEach(line => {
    const availableContentWidth =
      resolvedWidth -
      (borderLeft ? 1 : 0) -
      (borderRight ? 1 : 0) -
      finalPadding.left -
      finalPadding.right;
    const paddedLine =
      (borderLeft ? chars.vertical : ' ') +
      ' '.repeat(finalPadding.left) +
      line.padEnd(Math.max(0, availableContentWidth)) +
      ' '.repeat(finalPadding.right) +
      (borderRight ? chars.vertical : ' ');
    paddedLines.push(paddedLine);
  });

  // Add bottom padding
  for (let i = 0; i < finalPadding.bottom; i++) {
    paddedLines.push(emptyLine);
  }

  // Create borders with Ink compatibility and title embedding
  const topBorder =
    borderTop && (title || titles)
      ? createTitleBorder(
          title || titles?.[0] || '',
          resolvedWidth,
          borderStyle as BorderStyle,
          titleAlign,
          truncate,
          fullWidthSafe,
          false // Top position
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

  // Assemble all lines with Ink compatibility
  const allLines: string[] = [];

  if (titlePosition === 'bottom') {
    if (borderTop)
      allLines.push(
        borderTop
          ? chars.topLeft +
              chars.horizontal.repeat(resolvedWidth - 2) +
              chars.topRight
          : ''
      );
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
          true // Bottom position
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

  // Apply border colors (Ink compatible)
  const effectiveBorderColor = borderColor || 'blue';

  return <Text color={effectiveBorderColor}>{allLines.join('\n')}</Text>;
};

// Extension slot component
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Attach Title as a property of TitleBox
(TitleBox as typeof TitleBox & { Title: typeof Title }).Title = Title;

export default TitleBox;
