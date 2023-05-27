import { View, BackHandler, Alert, Text } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
import OtpInput from '../../../components/Input/OtpInput';
import {
  useForgotPasswordByEmailMutation,
  useForgotPasswordByPhoneMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useVerifyTokenMutation,
} from '../../../redux/features/auth/authApi';
import { saveToken, saveUser } from '../../../redux/features/auth/authSlice';
import { obfuscateEmail } from '../../../helpers/formatText';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

const INITIAL_COUNT = 300;

const VerifyAccount = ({ route }) => {
  const toast = useToast();
  const navigation = useNavigation();

  const formType = route?.params?.formType;
  const from = route?.params?.from;

  const [counter, setCounter] = useState(59);

  const dispatch = useDispatch();
  const { countries, user } = useSelector((state) => state.userAuth);
  const [maxPhoneLength, setMaxPhoneLength] = useState(11);
  const phoneRegExp = /^[-\s\.]?[0-9]{9,11}$/im;
  const validationSchema = Yup.object().shape({
    token: Yup.string()
      .required('Code is required')
      .min(6, '6 digits expected')
      .max(6, '6 digits expected'),
  });

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setCounter(0);
      clearTimeout(timer);
    }
  }, [counter]);

  const [validateOnChange, setValidateOnChange] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
  const [initial, setIntial] = useState(INITIAL_COUNT);
  const [status, setStatus] = useState(STATUS.STOPPED);
  const [otpSent, setOtpSent] = useState(true);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [verifyToken, { isLoading: isLoadingToken }] = useVerifyTokenMutation();
  const [forgotPasswordByEmail, { isLoading: isLoadingEmail }] =
    useForgotPasswordByEmailMutation();
  const [forgotPasswordByPhone, { isLoading: isLoadingPhone }] =
    useForgotPasswordByPhoneMutation();

  const handleResend = async (values) => {
    const resolveValues =
      formType === 'email'
        ? { email: user?.email }
        : { phoneNumber: user?.phone || user?.phoneNumber };
    console.log(resolveValues);
    const res =
      formType === 'email'
        ? await forgotPasswordByEmail(resolveValues)
        : await forgotPasswordByPhone(resolveValues);
    console.log(res);
    if (res?.data?.status === 'success') {
      toast.show(res?.data?.message || 'Verification code sent successfully', {
        type: 'success',
        placement: 'top',
        duration: 4000,
      });
      handleReset();
    } else {
      toast.show(
        res?.error?.data?.message || 'Verification code failed to send',
        {
          type: 'error',
          placement: 'top',
          duration: 4000,
        }
      );
    }
  };

  useEffect(() => {
    handleStart();
  }, []);

  const handleStart = () => {
    setStatus(STATUS.STARTED);
    setSecondsRemaining(INITIAL_COUNT);
    setIntial(INITIAL_COUNT);
  };

  const handleReset = () => {
    setStatus(STATUS.STARTED);
    setSecondsRemaining(initial * 2);
    setIntial(initial * 2);
  };

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        setStatus(STATUS.STOPPED);
      }
    },
    status === STATUS.STARTED ? 1000 : null
  );

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const twoDigits = (num) => String(num).padStart(2, '0');

  const handleVerifyOtp = async (values) => {
    console.log(values);
    const res =
      from == 'signup' || from == 'signin'
        ? await verifyOtp(values)
        : await verifyToken(values);
    console.log(res);
    if (res?.data) {
      if (from == 'signup' || from == 'signin') {
        dispatch(saveToken(res?.data?.token));
        dispatch(saveUser(res?.data?.user));
        toast.show(
          from == 'signin'
            ? 'Account verified successfully'
            : 'Your signup was successful',
          {
            type: 'success',
            placement: 'top',
            duration: 4000,
          }
        );
        navigation.navigate('Home');
      } else {
        navigation.navigate('ResetPassword', { ...values });
      }
    } else {
      toast.show('Invalid Verification code', {
        type: 'error',
      });
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
          initialValues={{ token: '' }}
          validationSchema={validationSchema}
          validateOnChange={validateOnChange}
          onSubmit={(values) => handleVerifyOtp(values)}
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
                <Row
                  align={'center'}
                  marginTop={20}
                  marginBottom={0}
                  marginLeft={-15}
                >
                  <BackArrowSvg onPress={() => navigation.goBack()} />
                </Row>
                <Row align={'center'} marginTop={35} marginBottom={33}>
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontWeight={500}
                    fontSize={24}
                    fontFamily={fonts.PoppinsBold}
                  >
                    Verify Account
                  </CustomText>
                </Row>

                <CustomText
                  color={COLORS.subtitle}
                  align="left"
                  fontSize={13}
                  fontFamily={fonts.PoppinsMedium}
                  bottom={20}
                >
                  {formType === 'email' || from === 'signup' || from == 'signin'
                    ? `Provide the verification code sent to ${obfuscateEmail(
                        user?.email
                      )}`
                    : 'Provide the verification code sent to your registered phone number'}
                </CustomText>

                <OtpInput
                  cellCount={6}
                  name="token"
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  value={values.token}
                  errors={errors.token}
                  textInputStyle={{ alignItems: 'center', paddingTop: 3 }}
                />
                <Button
                  text="Verify"
                  top={30}
                  onPress={() => {
                    setValidateOnChange(true);
                    handleSubmit();
                  }}
                  disabled={!isValid}
                  loading={isLoading || isLoadingToken}
                />
                <Row
                  justify={'center'}
                  align={'flex-start'}
                  marginTop={30}
                  marginBottom={10}
                >
                  {otpSent && (
                    <CustomText
                      color={COLORS.primarytext}
                      align="left"
                      fontSize={13}
                      fontFamily={fonts.PoppinsMedium}
                    >
                      {secondsRemaining === 0
                        ? 'Didn’t receive code?'
                        : 'Resend in'}
                    </CustomText>
                  )}

                  <Button
                    bgColor={COLORS?.white}
                    loading={isLoadingEmail || isLoadingPhone}
                    textColor={
                      secondsRemaining === 0
                        ? COLORS?.primary
                        : COLORS?.primarytext
                    }
                    height={'18px'}
                    style={{
                      width: secondsRemaining === 0 ? 80 : 60,
                    }}
                    text={
                      otpSent &&
                      (secondsRemaining === 0
                        ? 'Resend'
                        : `${
                            hoursToDisplay +
                            ':' +
                            twoDigits(minutesToDisplay) +
                            ':' +
                            twoDigits(secondsToDisplay)
                          }`)
                    }
                    textSize={13}
                    textTop={0}
                    align={'flex-start'}
                    fontFamily={fonts.PoppinsMedium}
                    onPress={handleResend}
                    disabled={secondsRemaining !== 0}
                  />
                </Row>
              </Col>
            </>
          )}
        </Formik>
      </SafeAreaWrap>
    </KeyboardAwareScrollView>
  );
};

export default VerifyAccount;
