import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {COLORS} from '../constants/colors';

const styles = StyleSheet.create({
  codeFieldRoot: {marginVertical: 10},
  cell: {
    width: '20%',
    height: 56,
    backgroundColor: COLORS.otpcell,
    textAlign: 'center',
    borderRadius: 6,
    textAlignVertical: 'top',
  },
  cellText: {
    color: COLORS.black,
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'top',
    lineHeight: 48,
    fontFamily: 'Montserrat-Regular',
  },
  focusCell: {
    backgroundColor: COLORS.otpcell,
  },
  errorCell: {
    borderColor: COLORS.error,
  },
  textInputStyle: {
    borderRadius: 6,
    backgroundColor: '#fe5',
  },
  inputBox: {
    width: 48,
    height: 48,
    fontSize: 16,
    color: COLORS.yellow,
    fontFamily: 'Montserrat-Regular',
    backgroundColor: COLORS.otpcell,
    textAlign: 'center',
    borderRadius: 2,
    textAlignVertical: 'top',
    borderColor: COLORS.otpcellborder,
  },
  containerView: {
    paddingVertical: 10,
    width: '100%',
    marginTop: 10,
    marginBottom: 0,
  },
});

const CELL_COUNT = 6;

function OtpInput({
  name = '',
  value = '',
  setValue = () => {},
  handleChange = () => {},
  errors = '',
  cellCount = CELL_COUNT,
  codeFieldRootStyle = {},
  maskedInput = false,
  titleStyle = {},
  textInputStyle = {},
}) {
  const ref = useBlurOnFulfill({value, cellCount});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: handleChange,
  });

  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = maskedInput ? '•' : symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <View
        key={index}
        style={[
          styles.inputBox,
          isFocused && styles.focusCell,
          errors.length > 0 && styles.errorCell,
          textInputStyle,
        ]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        <Text style={[styles.cellText]}>{textChild}</Text>
      </View>
    );
  };

  return (
    <View style={styles.containerView}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={text => {
          handleChange(name);
          setValue(text);
        }}
        cellCount={cellCount}
        rootStyle={[styles.codeFieldRoot, codeFieldRootStyle]}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        textInputStyle={textInputStyle}
        renderCell={renderCell}
      />
      {errors.length > 0 && <Text style={styles.errorText}>{errors}</Text>}
    </View>
  );
}

export default OtpInput;
