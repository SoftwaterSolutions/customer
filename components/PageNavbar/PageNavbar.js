/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {BackArrow} from '../../assets/svg';
import {COLORS} from '../../constants/colors';
import Fonts from '../../constants/fonts';
import CustomText from '../CustomText/CustomText';

const Container = styled.View`
  width: 100%;
  padding-vertical: 12px;
  padding-top: 24px;
`;

const SpacedRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const IconWrapper = styled.TouchableOpacity`
  height: 32px;
  width: 32px;
  border-radius: ${32 * 0.5}px;
  justify-content: center;
  align-items: center;
  position: relative;
  position: relative;
  top: ${({top}) => (top ? top : 0)}px;
  left: ${({left}) => (left ? left : 0)}px;
  right: ${({right}) => (right ? right : 0)}px;
`;

const Box = styled.View`
  height: 10px;
  width: 30px;
`;

const PageNavbar = ({
  navigation,
  text,
  onFirstPress = () => {},
  onLeftPress = () => navigation.goBack(),
  showRightBtn = false,
  hideLeftBtn = true,
  rightIcon,
  fontSize = 14,
  fontWeight = '400',
}) => {
  return (
    <Container>
      <SpacedRow>
        {hideLeftBtn && (
          <IconWrapper onPress={() => onLeftPress()}>
            <BackArrow />
          </IconWrapper>
        )}

        <CustomText
          color={COLORS.black}
          align='center'
          fontWeight={fontWeight}
          fontFamily={Fonts.PoppinsRegular}
          fontSize={fontSize}>
          {text}
        </CustomText>

        {showRightBtn ? (
          <TouchableOpacity onPress={onFirstPress}>
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <Box />
        )}
      </SpacedRow>
    </Container>
  );
};

export default PageNavbar;
