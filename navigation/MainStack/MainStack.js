import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabStack from './BottomTabStack/BottomTabStack';
import ProductDetails from '../../screens/Main/Home/ProductDetails/ProductDetails';
import Checkout from '../../screens/Main/Cart/Checkout/Checkout';
import OrderDetails from '../../screens/Main/Orders/OrderDetails/OrderDetails';
import TrackOrder from '../../screens/Main/Orders/TrackOrder/TrackOrder';
import Profile from '../../screens/Main/Account/Profile/Profile';
import Notifications from '../../screens/Main/Account/Notifications/Notifications';
import DeliveryArea from '../../screens/Main/Account/DeliveryArea/DeliveryArea';
import SavedItems from '../../screens/Main/Account/SavedItems/SavedItems';
import Pay4Me from '../../screens/Main/Account/Pay4Me/Pay4Me';
import Voucher from '../../screens/Main/Account/Voucher/Voucher';
import ChangePassword from '../../screens/Main/Account/ChangePassword/ChangePassword';
import PrivacyPolicy from '../../screens/Main/Account/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from '../../screens/Main/Account/TermsAndConditions/TermsAndConditions';
import ContactUs from '../../screens/Main/Account/ContactUs/ContactUs';
import AboutUs from '../../screens/Main/Account/AboutUs/AboutUs';

const Stack = createStackNavigator();

export default function MainStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BottomTabStack"
      listeners={({ navigation }) => ({
        blur: () => navigation.setParams({ screen: undefined }),
      })}
    >
      <Stack.Screen
        name="BottomTabStack"
        component={BottomTabStack}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="TrackOrder"
        component={TrackOrder}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="DeliveryArea"
        component={DeliveryArea}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="SavedItems"
        component={SavedItems}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="Pay4Me"
        component={Pay4Me}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="Voucher"
        component={Voucher}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
    </Stack.Navigator>
  );
}
