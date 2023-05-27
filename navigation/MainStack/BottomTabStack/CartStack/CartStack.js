import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from '../../../../screens/Main/Cart/Cart';

const Stack = createStackNavigator();

export default function CartStack({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      e.preventDefault();
      navigation.navigate('CartMain');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="CartMain"
    >
      <Stack.Screen name="CartMain" component={Cart} />
    </Stack.Navigator>
  );
}
