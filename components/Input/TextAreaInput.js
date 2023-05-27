/* eslint-disable react-native/no-inline-styles */
import {Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../constants/colors';
import styled from 'styled-components';
import CustomText from '../CustomText/CustomText';

const TextAreaInput = styled.TextInput`
  width: ${({width}) => width || '100%'};
  padding-horizontal: 16px;
  height: 122px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-weight: 400;
  text-align: left;
  font-size: 14px;
  border-width: 1px;
  border-color: ${props => (props?.active ? COLORS?.primary : COLORS?.border)};
  border-radius: 4px;
  color: ${COLORS?.black};
  background-color: ${props =>
    props?.active ? 'rgba(154, 226, 254, 0.1)' : COLORS?.white};
`;

const ViewTextAreaWrap = styled.View`
  width: ${({width}) => width || '100%'};
  margin-top: ${({top}) => top}px;
  margin-bottom: ${({bottom}) => bottom || 0}px;

  ${({style}) => style};
`;

export const CustomTextAreaInput = ({
  width,
  bgColor = COLORS.inputGreyBg,
  inputType = 'default',
  placeholder,
  handleChange = () => {},
  name = '',
  handleBlur,
  value,
  disabled = false,
  maxLength,
  errors = '',
  top = 0,
  style = {},
  returnValue = false,
  setFieldTouched = () => {},
}) => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      setFocused(false);
    }
  }, [errors]);

  return (
    <ViewTextAreaWrap
      bottom={errors.length > 0 ? 16 : 0}
      style={style}
      top={top}
      width={width}>
      <TextAreaInput
        width={width}
        textAlignVertical='top'
        borderColor={COLORS.inputGreyBg}
        bgColor={bgColor}
        keyboardType={inputType}
        placeholder={placeholder}
        onChangeText={
          returnValue
            ? e => {
                handleChange(e);
              }
            : handleChange(name)
        }
        placeholderTextColor={COLORS.greyPlaceholderTextColor}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          //   setFieldTouched(name);
        }}
        value={value}
        editable={!disabled}
        maxLength={maxLength}
        enablesReturnKeyAutomatically={false}
        multiline={true}
        active={focused}
      />
      {errors.length > 0 && (
        <CustomText
          fontWeight='400'
          style={{
            bottom: Platform.OS === 'android' ? -20 : -22,
            position: 'absolute',
            fontSize: 12,
          }}
          color={COLORS.error}>
          {errors}
        </CustomText>
      )}
    </ViewTextAreaWrap>
  );
};
