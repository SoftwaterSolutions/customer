import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../../../../screens/Main/Account/Account';

const Stack = createStackNavigator();

export default function AccountStack({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      e.preventDefault();
      navigation.navigate('AccountMain');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="AccountMain"
    >
      <Stack.Screen name="AccountMain" component={Account} />
    </Stack.Navigator>
  );
}
