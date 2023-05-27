import { View, Text } from 'react-native';
import React, { useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import fonts from '../../constants/fonts';
import CustomText from '../CustomText/CustomText';
import EyeOff from '../../assets/svgs/eye-close.svg';
import EyeOn from '../../assets/svgs/eye-open.svg';
import { Row } from '../CustomGrid/CustomGrid';

const Wrapper = styled.View`
  height: 50px;
  width: ${(props) => props?.width || 100}%;
  border-width: 1px;
  border-color: ${(props) =>
    props?.active ? COLORS?.primary : COLORS?.inputBorder};
  border-radius: 4px;
  background-color: ${(props) => COLORS?.inputBg};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => props?.marginTop || 0}px;
  padding-horizontal: 15px;
`;
const Container = styled.View`
  align-items: flex-start;
  margin-top: ${(props) => props?.marginTop || 0}px;
`;

const TextInput = styled.TextInput`
  height: 100%;
  width: 75%;
  font-family: ${fonts?.PoppinsRegular};
  font-size: 13px;
  color: ${COLORS?.black};
  flex-grow: 1;
  align-items: center;
`;

const ShowWrap = styled.TouchableOpacity`
  height: 24px;
  padding-horizontal: 4px;
  background-color: ${COLORS?.passwordBtn};
  border-radius: 2px;
  justify-content: center;
`;

const PasswordInput = ({
  label = 'Password',
  marginTop = 0,
  placeholder = '',
  placeholderTextColor = COLORS.greyPlaceholderTextColor,
  inputType = 'default',
  handleChange = () => {},
  value,
  errors,
}) => {
  const [hidden, setHidden] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <Container marginTop={marginTop}>
      <CustomText
        color={COLORS.black}
        align="left"
        fontSize={12}
        bottom={5}
        fontFamily={fonts.PoppinsMedium}
      >
        {label}
      </CustomText>
      <Wrapper active={focused}>
        <TextInput
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          keyboardType={inputType}
          secureTextEntry={!hidden}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={value}
        />

        <ShowWrap onPress={() => setHidden(!hidden)}>
          {hidden ? <EyeOff /> : <EyeOn />}
        </ShowWrap>
      </Wrapper>
      {!!errors && (
        <Row marginTop={3}>
          <CustomText fontWeight="400" fontSize={11} color={COLORS.error}>
            {errors}
          </CustomText>
        </Row>
      )}
    </Container>
  );
};

export default PasswordInput;
