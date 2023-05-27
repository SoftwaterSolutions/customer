/* eslint-disable react-native/no-inline-styles */
import { ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants/colors';
import styled from 'styled-components/native';
import CustomText from '../CustomText/CustomText';
import Fonts from '../../constants/fonts';
import PlusSvg from '../../assets/svgs/plus.svg';

const BtnWrap = styled.TouchableOpacity`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.bgColor};
  border-radius: ${(props) => props.borderRadius};
  justify-content: ${(props) => props?.jc || 'center'};
  margin-top: ${(props) => props?.top || 0}px;
  margin-bottom: ${(props) => props?.bottom || 0}px;
  align-items: center;
  ${(props) => props.style};
  z-index: 1;
`;

const ViewWrap = styled.View`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.bgColor};
  border-radius: ${(props) => props.borderRadius};
  justify-content: ${(props) => props?.jc || 'center'};
  align-items: center;
  margin-top: ${(props) => props?.top || 0}px;
  margin-bottom: ${(props) => props?.bottom || 0}px;
  ${(props) => props.style};
  padding-top: ${Platform.OS === 'ios' ? '10px' : '0px'};
  z-index: 1;
`;

const DisabledWrap = styled.View`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${(props) => props.bgColor};
  border-radius: ${(props) => props.borderRadius};
  justify-content: ${(props) => props?.jc || 'center'};
  align-items: center;
  ${(props) => props.style};
  padding-top: ${Platform.OS === 'ios' ? '10px' : '0px'};
  position: absolute;
  bottom: 0px;
  z-index: 3;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FabWrap = styled.TouchableOpacity`
  height: 53.5px;
  width: 53.5px;
  border-radius: ${53.5 * 0.5}px;
  background-color: ${COLORS?.primary};
  justify-content: center;
  align-items: center;
  ${(props) => props.style};
`;

export const Fab = ({ style = {}, onPress = () => {} }) => {
  return (
    <FabWrap onPress={onPress} style={style}>
      <PlusSvg />
    </FabWrap>
  );
};

const Button = ({
  text,
  textComponent,
  bgColor = COLORS.primary,
  textColor = COLORS.black,
  width = '100%',
  height = '45px',
  borderRadius = '5px',
  jc = 'center',
  style,
  top,
  bottom,
  loading = false,
  disabled = false,
  textSize = 13,
  icon = null,
  iconRight = true,
  fontWeight,
  onPress = () => {},
  textTop = 0,
  spinnerColor = COLORS.white,
}) => {
  return (
    <>
      <BtnWrap
        textColor={textColor}
        width={width}
        height={height}
        style={style}
        borderRadius={borderRadius}
        justifyContent={jc}
        bgColor={bgColor}
        top={top}
        bottom={bottom}
        onPress={onPress}
        disabled={loading || disabled}
      >
        {loading ? (
          <ActivityIndicator
            style={{ alignSelf: 'center' }}
            size="small"
            color={spinnerColor}
          />
        ) : (
          <Row>
            {icon && !iconRight && icon}
            {textComponent ? (
              textComponent
            ) : (
              <CustomText
                color={textColor}
                align="center"
                fontWeight={fontWeight ? fontWeight : '400'}
                fontFamily={Fonts?.PoppinsMedium}
                fontSize={textSize}
                top={textTop}
              >
                {text}
              </CustomText>
            )}
            {icon && iconRight && icon}
          </Row>
        )}
        {disabled && (
          <DisabledWrap
            borderRadius={borderRadius}
            width={'100%'}
            height={height}
            bgColor={'rgba(255,255,255, 0.4)'}
          />
        )}
      </BtnWrap>
    </>
  );
};

export default Button;
