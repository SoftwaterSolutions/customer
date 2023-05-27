/* eslint-disable react-native/no-inline-styles */
import { View, SafeAreaView } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants/colors';

const SafeAreaWrap = ({
  children,
  style,
  bg = COLORS.white,
  height = '100%',
  width = '100%',
  safeAreaBg = COLORS.white,
}) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: safeAreaBg,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: bg,
          height,
          width,
          flex: 1,
          ...style,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default SafeAreaWrap;
