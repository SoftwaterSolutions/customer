import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeBlack from '../../../assets/svgs/homeBlack.svg';
import HomeYellow from '../../../assets/svgs/homeYellow.svg';
import CartBlack from '../../../assets/svgs/cartBlack.svg';
import CartYellow from '../../../assets/svgs/cartYellow.svg';
import OrdersBlack from '../../../assets/svgs/orderBlack.svg';
import OrdersYellow from '../../../assets/svgs/orderYellow.svg';
import AccountBlack from '../../../assets/svgs/accountBlack.svg';
import AccountYellow from '../../../assets/svgs/accountYellow.svg';

import { StyleSheet } from 'react-native';

import HomeStack from './HomeStack/HomeStack';
import fonts from '../../../constants/fonts';
import { COLORS } from '../../../constants/colors';
import CartStack from './CartStack/CartStack';
import OrdersStack from './OrderStack/OrderStack';
import AccountStack from './AccountStack/AccountStack';

const Tab = createBottomTabNavigator();

export default function BottomTabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [styles.tabBar, { height: 72 }],
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.black,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => ({
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIconStyle: styles.iconStyleBottomBar,
          tabBarIcon: ({ focused }) =>
            focused ? <HomeYellow /> : <HomeBlack />,
        })}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={({ route }) => ({
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIconStyle: styles.iconStyleBottomBar,
          tabBarIcon: ({ focused }) =>
            focused ? <CartYellow /> : <CartBlack />,
        })}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={({ route }) => ({
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIconStyle: styles.iconStyleBottomBar,
          tabBarIcon: ({ focused }) =>
            focused ? <OrdersYellow /> : <OrdersBlack />,
        })}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={({ route }) => ({
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.textStyleBottomBar,
          tabBarIconStyle: styles.iconStyleBottomBar,
          tabBarIcon: ({ focused }) =>
            focused ? <AccountYellow /> : <AccountBlack />,
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  iconStyleBottomBar: {
    marginVertical: 15,
  },
  textStyleBottomBar: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: fonts.PoppinsRegular,
    marginBottom: 10,
  },
});
