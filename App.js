import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  useFonts,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import { COLORS } from './constants/colors';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './navigation/RootStack';
import SuccessSvg from './assets/svgs/success_small copy.svg';
import ErrorSvg from './assets/svgs/failed_small.svg';
import fonts from './constants/fonts';
import { StripeProvider } from '@stripe/stripe-react-native';

SplashScreen.preventAutoHideAsync();
import messaging from '@react-native-firebase/messaging';

export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { width, height } = useWindowDimensions();

  let persistor = persistStore(store);

  useEffect(() => {
    async function prepare() {
      SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const messagingInit = async () => {
    if (requestUserPermission()) {
      console.log('s');
      // const response = await messaging().getToken();
    }
  };

  useEffect(() => {
    messagingInit();
  }, []);

  const Toast = (props) => {
    return (
      <View
        style={{
          borderRadius: props.borderRadius ? props.borderRadius : 5,
          borderColor: props?.type === 'success' ? COLORS.green : COLORS.error,
          borderWidth: props.borderWidth ? props.borderWidth : 1,
          paddingVertical: 15,
          paddingHorizontal: 15,
          marginHorizontal: 24,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : COLORS.white,
          width: width - 48,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {props?.type === 'success' ? (
            <SuccessSvg marginRight={10} />
          ) : (
            <ErrorSvg marginRight={10} />
          )}
          {props.message && (
            <Text
              style={{
                color: props?.type === 'success' ? COLORS.green : COLORS.error,
                fontSize: 13,
                fontFamily: fonts.MontserratRegular,
                width: '90%',
              }}
            >
              {props.message}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (!fontsLoaded || !persistor) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider
          offsetTop={80} // offset for both top and bottom toasts
          offsetBottom={100} // offset for both top and bottom toasts
          swipeEnabled={true}
          placement={'top'}
          duration={4000}
          renderToast={(toast) => <Toast {...toast} />}
          shouldPreventDuplicate={true}
          maxToasts={2}
        >
          <StripeProvider publishableKey={process.env.STRIPE_PUBLIC_KEY}>
            <SafeAreaProvider>
              <RootStack />
            </SafeAreaProvider>
          </StripeProvider>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
