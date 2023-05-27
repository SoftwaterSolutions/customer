import styled from 'styled-components/native';
import React from 'react';
import { COLORS } from '../../constants/colors';
import Text from 'react-native-text';
import fonts from '../../constants/fonts';

const TextStyle = styled(Text)`
  font-size: ${(props) => props.fontSize || 14}px;
  font-family: ${(props) => props.fontFamily || 'PoppinsRegular'};
  font-style: normal;
  font-weight: ${({ fontWeight }) => fontWeight || '400'}
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
  margin-top: ${({ top }) => top || 0}px;
  margin-right: ${({ right }) => right || 0}px;
  margin-left: ${({ left }) => left || 0}px;
  margin-bottom: ${({ bottom }) => bottom || 0}px;
  text-align: ${({ align }) => align || 'left'};
  text-transform: ${({ transform }) => transform || 'none'};
  text-decoration: ${({ textDecoration }) => textDecoration || 'none'};
  opacity: ${({ opacity }) => opacity || 1};
  width: ${({ width }) => width || 'auto'};
  max-width: ${({ maxWidth }) => maxWidth || 'auto'};
  ${({ style }) => style};
`;

const CustomText = ({
  fontSize = 14,
  fontFamily = fonts.PoppinsRegular,
  children,
  fontWeight,
  color = COLORS.black,
  bgColor = 'transparent',
  top,
  right,
  left,
  bottom,
  align,
  style,
  maxWidth,
  numberOfLines,
  transform,
  ...props
}) => {
  return (
    <TextStyle
      top={top}
      right={right}
      left={left}
      fontWeight={fontWeight}
      color={color}
      bottom={bottom}
      fontSize={fontSize}
      style={style}
      fontFamily={fontFamily}
      numberOfLines={numberOfLines}
      transform={transform}
      maxWidth={maxWidth}
      align={align}
      bgColor={bgColor}
      {...props}
    >
      {children || '...'}
    </TextStyle>
  );
};

export default CustomText;
