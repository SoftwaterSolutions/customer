import React, {useState} from 'react';
import {useController} from 'react-hook-form';
import {StyleSheet, Text, View} from 'react-native';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {COLORS} from '../constants/colors';

const Input = ({
  name,
  value,
  error,
  onChangeText,
  rightComponent = <></>,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [show, setShow] = useState(false);
  const validateField = () => {
    if (value && error) {
      return 'red';
    } else if ((value && !error) || isFocused) {
      return COLORS.black;
    } else {
      return COLORS.txtborder;
    }
  };

  return (
    <View style={{paddingTop: 15, ...props}}>
      <FloatingLabelInput
        value={value}
        onChangeText={onChangeText}
        togglePassword={show}
        isFocused={isFocused}
        placeholderTextColor={COLORS.gray}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        inputStyles={styles.input}
        // staticLabel
        containerStyles={{
          ...styles.inputContainerStyle,
          paddingLeft: 30,
          paddingRight: 10,
          borderColor: validateField(),
          borderWidth: 1,
        }}
        customLabelStyles={{
          colorFocused: validateField(),
          fontSizeFocused: 11,
        }}
        labelStyles={{
          fontFamily: 'Montserrat-Regular',
          fontSize: 14,
          color: COLORS.black,
        }}
        rightComponent={rightComponent}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: 40,
    height: 60,
    backgroundColor: COLORS.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: 'Montserrat-Medium',
    lineHeight: 24,
    paddingTop: 20,
  },
  info: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.gray,
    paddingTop: 3,
  },
  errorText: {
    fontFamily: 'Montserrat-Regular',
    fontStyle: 'italic',
    fontSize: 10,
    color: COLORS.error,
    paddingTop: 5,
    marginHorizontal: 20,
  },
});

export default Input;
