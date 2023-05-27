import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Categories from '../../../../screens/Main/Home/Categories/Categories';
import CategoryPage from '../../../../screens/Main/Home/Categories/CategoryPage';
import ProductDetails from '../../../../screens/Main/Home/ProductDetails/ProductDetails';

const Stack = createStackNavigator();

export default function HomeStack({ navigation, route }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      e.preventDefault();
      navigation.navigate('Categories');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Categories"
    >
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="CategoryPage" component={CategoryPage} />
    </Stack.Navigator>
  );
}
