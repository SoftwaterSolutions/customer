import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../../screens/Auth/SignIn/SignIn';
import SignUp from '../../screens/Auth/SignUp/SignUp';
import ForgotPassword from '../../screens/Auth/ForgotPassword/ForgotPassword';
import PreAuth from '../../screens/Auth/PreAuth/PreAuth';
import VerifyAccount from '../../screens/Auth/VerifyAccount/VerifyAccount';
import ResetPassword from '../../screens/Auth/ResetPassword/ResetPassword';

const Stack = createStackNavigator();

export default function AuthStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="PreAuth"
    >
      <Stack.Screen name="PreAuth" component={PreAuth} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
