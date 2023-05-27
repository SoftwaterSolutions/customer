import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../constants/colors';

const LoadingScreen = () => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator color={COLORS?.primary} size={50} />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({});
