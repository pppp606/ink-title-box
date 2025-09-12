import React from 'react';
import { Box, Text } from 'ink';

interface TitleBoxProps {
  title: string;
  width?: number;
  padding?: number;
  borderColor?: string;
}

export const TitleBox: React.FC<TitleBoxProps> = ({
  title,
  width = 40,
  padding = 1,
  borderColor = 'blue',
}) => {
  return (
    <Box
      borderStyle='round'
      borderColor={borderColor}
      width={width}
      padding={padding}
    >
      <Text bold>{title}</Text>
    </Box>
  );
};

export default TitleBox;
