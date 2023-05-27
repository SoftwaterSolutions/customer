import React from 'react';
import { StyleSheet } from 'react-native';
import Text from 'react-native-text';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import styled from 'styled-components/native';
import { COLORS } from '../../constants/colors';
import CustomText from '../CustomText/CustomText';
import Fonts from '../../constants/fonts';
import fonts from '../../constants/fonts';

const styles = StyleSheet.create({
  codeFieldRoot: { marginVertical: 10 },
  cell: {
    width: '20%',
    height: 56,
    backgroundColor: COLORS.inputBg,
    textAlign: 'center',
    borderRadius: 6,
    textAlignVertical: 'top',
  },
  cellText: {
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 48,
    color: COLORS?.black_70,
    fontFamily: fonts.PoppinsSemiBold,
  },
  focusCell: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.inputBg,
  },
  errorCell: {
    borderColor: 'red',
  },
  textInputStyle: {
    borderRadius: 6,
    backgroundColor: '#fe5',
  },
});

const ContainerView = styled.View`
  padding-vertical: 10px;
  width: 100%;
  margin-top: ${({ top }) => top}px;
  margin-bottom: ${({ bottom }) => bottom || 0}px;
`;

const InputBox = styled.View`
  ${{
    width: 51,
    height: 56,
    fontSize: 16,
    backgroundColor: COLORS.inputBg,
    textAlign: 'center',
    borderRadius: 2,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  }}
`;

const CELL_COUNT = 6;

function OtpInput({
  name = '',
  value = '',
  handleChange = () => {},
  errors = '',
  cellCount = CELL_COUNT,
  codeFieldRootStyle = {},
  errorLeft = 0,
  top = 0,
  bottom = 0,
  maskedInput = false,
  textInputStyle = {},
}) {
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: handleChange,
  });

  const renderCell = ({ index, symbol, isFocused }) => {
    let textChild = null;

    if (symbol) {
      textChild = maskedInput ? '•' : symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <InputBox
        key={index}
        style={[
          isFocused && styles.focusCell,
          errors.length > 0 && styles.errorCell,
          textInputStyle,
        ]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        <Text style={[styles.cellText]}>{textChild}</Text>
      </InputBox>
    );
  };

  return (
    <ContainerView top={top} bottom={bottom}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={handleChange(name)}
        cellCount={cellCount}
        rootStyle={[styles.codeFieldRoot, codeFieldRootStyle]}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        textInputStyle={textInputStyle}
        renderCell={renderCell}
      />
      {errors.length > 0 && (
        <CustomText
          fontSize={10}
          fontFamily={Fonts.PoppinsRegular}
          fontWeight="400"
          color={COLORS.error}
          left={errorLeft}
        >
          {errors}
        </CustomText>
      )}
    </ContainerView>
  );
}

export default OtpInput;
