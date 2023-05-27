import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Orders from '../../../../screens/Main/Orders/Orders';

const Stack = createStackNavigator();

export default function OrdersStack({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      e.preventDefault();
      navigation.navigate('OrdersMain');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="OrdersMain"
    >
      <Stack.Screen name="OrdersMain" component={Orders} />
    </Stack.Navigator>
  );
}
