/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import fonts from '../../constants/fonts';
import CustomText from '../CustomText/CustomText';

const Wrapper = styled.View`
  height: ${(props) => props?.height || '50px'};
  width: ${(props) => props?.width || '100%'};
  border-width: 1px;
  border-color: ${(props) =>
    props?.active ? COLORS?.primary : COLORS?.inputBorder};
  border-radius: 4px;
  background-color: ${(props) =>
    props?.disabled ? COLORS?.white : props?.inputBg || COLORS?.inputBg};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => props?.marginTop || 0}px;
  padding-horizontal: ${(props) => props?.paddingHorizontal || '12px'};
`;

const TextWrap = styled.TextInput`
  height: 100%;
  width: 100%;
  font-family: ${fonts?.PoppinsRegular};
  font-size: ${(props) => props?.fontSize || '13px'};
  color: ${COLORS?.black};
  align-items: center;
  padding-vertical: ${(props) => props?.paddingVertical || '0px'};
  text-align: ${(props) => props?.textAlign || 'left'};
`;

const Container = styled.View`
  align-items: flex-start;
  margin-top: ${(props) => props?.marginTop || 0}px;
  width: ${(props) => props?.width || '100%'};
`;

const TextInput = ({
  marginTop = 0,
  width,
  height,
  mxheight,
  label,
  placeholder = '',
  placeholderTextColor = COLORS.placeHolder,
  inputType = 'default',
  returnValue = true,
  handleChange = () => {},
  name = '',
  errors = '',
  value,
  showNaira = false,
  disabled = false,
  inputBg,
  fontSize,
  multiline = false,
  numberOfLines,
  textAlignVertical,
  textAlign,
  paddingVertical,
  paddingHorizontal,
  phoneCode,
  phoneFlag,
}) => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      setFocused(false);
    }
  }, [errors]);

  return (
    <Container marginTop={marginTop} width={width}>
      {label && (
        <CustomText
          color={COLORS.black}
          align="left"
          fontSize={12}
          bottom={5}
          fontFamily={fonts.PoppinsMedium}
        >
          {label}
        </CustomText>
      )}

      <Wrapper
        paddingHorizontal={paddingHorizontal}
        active={focused}
        inputBg={inputBg}
        height={height}
        disabled={disabled}
      >
        {showNaira && (
          <CustomText
            color={COLORS.grey_2}
            align="left"
            right={5}
            fontWeight={400}
            fontSize={14}
            fontFamily={fonts.PoppinsRegular}
          >
            ₦
          </CustomText>
        )}

        {phoneFlag && phoneFlag}
        {phoneCode && (
          <CustomText
            align="left"
            // right={5}
            top={0.5}
            fontWeight={400}
            fontSize={12}
            style={{ marginLeft: 2, marginRight: 5 }}
            fontFamily={fonts.PoppinsRegular}
          >
            {phoneCode}
          </CustomText>
        )}

        <TextWrap
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          keyboardType={inputType}
          textAlign={textAlign}
          onChangeText={
            returnValue
              ? (e) => {
                  handleChange(e);
                }
              : handleChange(name)
          }
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            // setFieldTouched(name);
          }}
          value={value}
          editable={!disabled}
          fontSize={fontSize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={textAlignVertical}
          paddingVertical={paddingVertical}
        />
      </Wrapper>
      {!!errors && (
        <CustomText
          fontWeight="400"
          fontSize={11}
          style={{ marginTop: 5 }}
          color={COLORS.error}
        >
          {errors}
        </CustomText>
      )}
    </Container>
  );
};

export default TextInput;
