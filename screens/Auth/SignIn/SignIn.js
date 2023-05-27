import { View, BackHandler, Alert, Text, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

import BackArrowSvg from '../../../assets/svgs/back.svg';
import Nig from '../../../assets/svgs/back.svg';

import { StatusBar } from 'expo-status-bar';

import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LoadingScreen from '../../../components/LoadingScreen';
import { COLORS } from '../../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaWrap from '../../../components/SafeAreaWrap/SafeAreaWrap';
import { Formik } from 'formik';
import PhoneInput from '../../../components/Input/PhoneInput';
import PasswordInput from '../../../components/Input/PasswordInput';
import Button from '../../../components/Button/Button';
import CustomText from '../../../components/CustomText/CustomText';
import * as Yup from 'yup';
import fonts from '../../../constants/fonts';
import TextInput from '../../../components/Input/TextInput';
import { Col, Row, SpacedRow } from '../../../components/CustomGrid/CustomGrid';
import CountrySelect from '../../../components/Input/CountrySelect';
import { saveToken, saveUser } from '../../../redux/features/auth/authSlice';
import {
  useGetCountriesMutation,
  useGoogleSigninMutation,
  useLoginUserMutation,
} from '../../../redux/features/auth/authApi';
// import DeviceCountry from 'react-native-device-country';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { AuthSession } from 'expo';
const GooglePng = require('../../../assets/svgs/google-logo.png');
WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const toast = useToast();
  const navigation = useNavigation();

  ///handle back action
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit Fooddy!', 'Are you sure you want to exit?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      // Add Event Listener for hardwareBackPress
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Once the Screen gets blur Remove Event Listener
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  const dispatch = useDispatch();
  const { countries, country } = useSelector((state) => state.userAuth);
  const [googleSigninCheck, setGoogleSigninCheck] = useState(false);
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const phoneRegExp = /^[-\s\.]?[0-9]{9,11}$/im;
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required().label('Email address'),
    // countryId: Yup.number().required('Country is required'),
    password: Yup.string().required().label('Password'),
  });

  // useEffect(() => {
  //   async function dev() {
  //     console.log(await DeviceCountry.getCountryCode());
  //     DeviceCountry.getCountryCode()
  //       .then((result) => {
  //         console.log(result);
  //         // {"code": "BY", "type": "telephony"}
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   }
  //   dev();
  // }, []);

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [googleSignin, { isLoading: isLoadingGoogleSignin }] =
    useGoogleSigninMutation();

  const handleLogin = async (values) => {
    const resolveValues = {
      ...values,
    };
    const res = await loginUser(resolveValues);
    if (res?.data?.status === 'success') {
      dispatch(saveToken(res?.data?.token));
      dispatch(saveUser(res?.data?.user));
      navigation.navigate('Home');
    } else if (res?.error?.data?.status === 'unverified') {
      dispatch(saveUser(res?.error?.data?.data));
      toast.show(res?.error?.data?.message || 'Verify your email address', {
        type: 'success',
        placement: 'top',
        duration: 4000,
      });
      navigation.navigate('VerifyAccount', {
        from: 'signin',
        formType: 'email',
      });
    } else {
      toast.show(res?.error?.data?.message || 'Sign in failed', {
        type: 'error',
        placement: 'top',
        duration: 4000,
      });
    }
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.OAUTH_ANDROID,
    iosClientId: process.env.OAUTH_IOS,
  });
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (response?.type === 'success') {
      setGoogleSigninCheck(true);
      setToken(response.authentication.accessToken);
      console.log({ response: response });
      console.log({ token: response.authentication.accessToken });
      getUserInfo(response.authentication.accessToken);
    }
  }, [response, country]);

  const getUserInfo = async (accessToken) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
      const res = await googleSignin({ ...user, country: country?.name });
      console.log({ res: res?.error?.data || res?.data });
      if (res?.data?.status === 'success') {
        dispatch(saveToken(res?.data?.token));
        dispatch(saveUser(res?.data?.user));
        setGoogleSigninCheck(false);
        navigation.navigate('Home');
      } else {
        setGoogleSigninCheck(false);
        toast.show(res?.error?.data?.message || 'Sign in failed', {
          type: 'error',
          placement: 'top',
          duration: 4000,
        });
      }
    } catch (error) {
      // Add your own error handler here
      console.log(error);
      setGoogleSigninCheck(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps={'handled'}
    >
      <SafeAreaWrap
        style={{
          paddingTop: 36,
          paddingHorizontal: 24,
          justifyContent: 'space-between',
        }}
      >
        <Formik
          initialValues={{
            password: '',
            email: '',
          }}
          validateOnMount={false}
          validateOnChange={validateOnChange}
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isValid,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              <Col>
                <Row align={'center'} marginTop={95} marginBottom={30}>
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontWeight={500}
                    fontSize={24}
                    fontFamily={fonts.PoppinsBold}
                  >
                    Sign in
                  </CustomText>
                  <CountrySelect
                    visible={modalVisible}
                    setVisible={setModalVisible}
                    reset={true}
                  />
                </Row>

                <TextInput
                  marginTop={10}
                  label={'Email address'}
                  placeholder="Email address"
                  returnValue={true}
                  handleChange={handleChange('email')}
                  value={values.email}
                  errors={errors?.email}
                />

                <PasswordInput
                  marginTop={16}
                  placeholder="Password"
                  handleChange={handleChange('password')}
                  errors={errors?.password}
                />
                <Row justify={'flex-end'}>
                  <Button
                    top={10}
                    style={{
                      alignItems: 'flex-end',
                    }}
                    height={'30px'}
                    width={'150px'}
                    align={'flex-end'}
                    bgColor={COLORS?.white}
                    textColor={COLORS?.black}
                    text="Forgot password?"
                    onPress={() => navigation.navigate('ForgotPassword')}
                  />
                </Row>
                <Button
                  text="Sign in"
                  top={5}
                  onPress={() => {
                    setValidateOnChange(true);
                    handleSubmit();
                  }}
                  disabled={isLoading || !isValid || !country?.name}
                  loading={isLoading}
                />
                <Row>
                  <Col
                    showBorder
                    width={'40%'}
                    marginTop={25}
                    marginBottom={25}
                    borderColor={COLORS.black}
                  ></Col>
                  <CustomText
                    color={COLORS.black}
                    justify="center"
                    fontSize={13}
                    fontFamily={fonts.PoppinsRegular}
                  >
                    or
                  </CustomText>
                  <Col
                    showBorder
                    width={'40%'}
                    marginTop={25}
                    marginBottom={25}
                  ></Col>
                </Row>
                <Button
                  disabled={!request}
                  onPress={() => {
                    promptAsync();
                  }}
                  textComponent={
                    <Row width={'200px'}>
                      <Image source={GooglePng} />
                      <CustomText
                        align="center"
                        fontFamily={fonts?.PoppinsMedium}
                        fontSize={13}
                        top={1}
                      >
                        Sign in with Google
                      </CustomText>
                    </Row>
                  }
                  top={5}
                  textColor={COLORS.red}
                  bgColor={COLORS.white}
                  style={{ borderWidth: 1, borderColor: COLORS.primary }}
                  loading={isLoadingGoogleSignin || googleSigninCheck}
                  spinnerColor={COLORS.primary}
                />
              </Col>
              <Row justify={'center'} align={'center'} marginBottom={40}>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={13}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Don't have an account?
                </CustomText>
                <Button
                  bgColor={COLORS?.white}
                  textColor={COLORS?.primary}
                  height={'30px'}
                  width={'65px'}
                  text=" Sign Up"
                  textTop={0}
                  align={'flex-start'}
                  onPress={() => navigation.navigate('SignUp')}
                />
              </Row>
            </>
          )}
        </Formik>
      </SafeAreaWrap>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
