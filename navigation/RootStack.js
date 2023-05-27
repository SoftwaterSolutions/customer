import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack/AuthStack';
import MainStack from './MainStack/MainStack';
import { useDispatch, useSelector } from 'react-redux';

const Stack = createStackNavigator();

export default function RootStack() {
  const dispatch = useDispatch();
  const { token, countries, country } = useSelector((state) => state.userAuth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="AuthStack"
      >
        {!token ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          <Stack.Screen name="MainStack" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
