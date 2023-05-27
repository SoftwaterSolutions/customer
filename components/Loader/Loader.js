import React from 'react';
import {ActivityIndicator} from 'react-native';
import {COLORS} from '../../constants/colors';
import {StyleSheet} from 'react-native';

const Loader = ({size = 30, style, color}) => {
  return (
    <ActivityIndicator
      size={size}
      style={[styles.center, {...style}]}
      color={color || COLORS.primary}
    />
  );
};

export default Loader;

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
