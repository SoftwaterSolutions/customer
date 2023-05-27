import { View, BackHandler, Alert, Text } from 'react-native';
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
import { useResetPasswordMutation } from '../../../redux/features/auth/authApi';
import { saveToken, saveUser } from '../../../redux/features/auth/authSlice';

const ResetPassword = ({ route }) => {
  const toast = useToast();
  const navigation = useNavigation();

  const token = route?.params?.token;

  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6)
      .label('Password'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
      .label('Password'),
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleReset = async (values) => {
    const resolveValues = { ...values, token: token };
    const res = await resetPassword(resolveValues);
    console.log(res);
    if (res?.data?.status === 'success') {
      toast.show(res?.data?.message || 'Password reset successful', {
        type: 'success',
      });
      dispatch(saveToken(res?.data?.token));
      dispatch(saveUser(res?.data?.user));
      navigation.navigate('Home');
    } else {
      toast.show(res?.error?.data?.message || 'Password reset failed', {
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
          initialValues={{
            password: '',
            passwordConfirm: '',
          }}
          validateOnMount={true}
          validationSchema={validationSchema}
          onSubmit={(values) => handleReset(values)}
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
                    Reset Password
                  </CustomText>
                </Row>

                <PasswordInput
                  marginTop={16}
                  placeholder="Password"
                  handleChange={handleChange('password')}
                />

                <PasswordInput
                  marginTop={16}
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  handleChange={handleChange('passwordConfirm')}
                />

                <Button
                  text="Submit"
                  top={25}
                  onPress={handleSubmit}
                  disabled={!isValid}
                  loading={isLoading}
                />
              </Col>
            </>
          )}
        </Formik>
      </SafeAreaWrap>
    </KeyboardAwareScrollView>
  );
};

export default ResetPassword;
