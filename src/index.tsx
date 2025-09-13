import React from 'react';
import { Box, Text } from 'ink';

type BorderStyle = 'single' | 'double' | 'round' | 'bold';
type TitleAlign = 'left' | 'center' | 'right' | 'space-between';
type TitlePosition = 'top' | 'bottom';

interface TitleBoxProps {
  // Basic props
  title?: string;
  titles?: string[];
  children?: React.ReactNode;

  // Styling props
  borderStyle?: BorderStyle;
  borderColor?: string;
  width?: number;

  // Padding props
  padding?: number;
  paddingX?: number;
  paddingY?: number;

  // Title positioning and alignment
  titleAlign?: TitleAlign;
  titlePosition?: TitlePosition;

  // Advanced features
  truncate?: boolean;
  fullWidthSafe?: boolean;
}

const truncateText = (
  text: string,
  maxWidth: number,
  fullWidthSafe: boolean = false
): string => {
  if (!maxWidth || text.length <= maxWidth) return text;

  // Simple character-based truncation for now
  // In a full implementation, we'd use proper width calculation considering full-width chars
  const truncateLength = fullWidthSafe
    ? Math.floor(maxWidth / 2)
    : maxWidth - 1;
  return text.slice(0, truncateLength) + '…';
};

const renderTitles = (props: TitleBoxProps): React.ReactNode => {
  const {
    title,
    titles,
    titleAlign = 'left',
    truncate = false,
    fullWidthSafe = false,
    width,
  } = props;

  // Priority: titles array > title string > children
  if (titles && titles.length > 0) {
    if (titleAlign === 'space-between' && titles.length === 2) {
      const [leftTitle, rightTitle] = titles;
      const processedLeft = truncate
        ? truncateText(
            leftTitle,
            width ? Math.floor(width / 2) : 20,
            fullWidthSafe
          )
        : leftTitle;
      const processedRight = truncate
        ? truncateText(
            rightTitle,
            width ? Math.floor(width / 2) : 20,
            fullWidthSafe
          )
        : rightTitle;

      return (
        <Text bold>
          {processedLeft}
          <Text>
            {' '.repeat(
              Math.max(
                0,
                (width || 40) - leftTitle.length - rightTitle.length - 4
              )
            )}
          </Text>
          {processedRight}
        </Text>
      );
    } else {
      const combinedTitle = titles.join(' ');
      const processedTitle = truncate
        ? truncateText(combinedTitle, width || 40, fullWidthSafe)
        : combinedTitle;
      return <Text bold>{processedTitle}</Text>;
    }
  }

  if (title) {
    const processedTitle = truncate
      ? truncateText(title, width || 40, fullWidthSafe)
      : title;
    return <Text bold>{processedTitle}</Text>;
  }

  return null;
};

export const TitleBox: React.FC<TitleBoxProps> = props => {
  const {
    borderStyle = 'round',
    borderColor = 'blue',
    width = 40,
    padding,
    paddingX,
    paddingY,
    // titlePosition = 'top', // TODO: Implement title positioning in future version
    children,
  } = props;

  // Handle padding logic
  const boxPadding = padding !== undefined ? padding : 1;
  const finalPaddingX = paddingX !== undefined ? paddingX : boxPadding;
  const finalPaddingY = paddingY !== undefined ? paddingY : boxPadding;

  const titleElement = children || renderTitles(props);

  return (
    <Box
      borderStyle={borderStyle}
      borderColor={borderColor}
      width={width}
      paddingLeft={finalPaddingX}
      paddingRight={finalPaddingX}
      paddingTop={finalPaddingY}
      paddingBottom={finalPaddingY}
    >
      {titleElement}
    </Box>
  );
};

// Extension slot component
const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Attach Title as a property of TitleBox
(TitleBox as typeof TitleBox & { Title: typeof Title }).Title = Title;

export default TitleBox;
