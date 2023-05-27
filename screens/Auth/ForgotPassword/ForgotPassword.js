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
import {
  useForgotPasswordByEmailMutation,
  useForgotPasswordByPhoneMutation,
} from '../../../redux/features/auth/authApi';
import { saveUser } from '../../../redux/features/auth/authSlice';

const ForgotPassword = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const { countries } = useSelector((state) => state.userAuth);
  const [maxPhoneLength, setMaxPhoneLength] = useState(11);
  const [selectedForm, setSelectedForm] = useState('email');
  const phoneRegExp = /^[-\s\.]?[0-9]{9,11}$/im;
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Phonenumber is not valid')
      // .max(maxPhoneLength, `Maximum of ${maxPhoneLength} digits`)
      .required('Phonenumber is required')
      .label('Phone number'),
    countryId: Yup.number().required('Country is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6)
      .label('Password'),
  });

  const [forgotPasswordByEmail, { isLoading }] =
    useForgotPasswordByEmailMutation();
  const [forgotPasswordByPhone, { isLoading: isLoadingPhone }] =
    useForgotPasswordByPhoneMutation();

  const handleForgotPassword = async (values) => {
    const resolveValues =
      selectedForm === 'email'
        ? { email: values.email }
        : { phoneNumber: values.phone };
    console.log(resolveValues);
    const res =
      selectedForm === 'email'
        ? await forgotPasswordByEmail(resolveValues)
        : await forgotPasswordByPhone(resolveValues);
    console.log(res);
    if (res?.data?.status === 'success') {
      toast.show(res?.data?.message, {
        type: 'success',
        placement: 'top',
        duration: 4000,
      });
      dispatch(saveUser(values));

      navigation.navigate('VerifyAccount', {
        formType: selectedForm,
        from: 'forgotpassword',
      });
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
            phone: '',
            email: '',
          }}
          initialTouched={{
            field: true,
          }}
          validateOnMount={true}
          // validationSchema={validationSchema}
          onSubmit={(values) => handleForgotPassword(values)}
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
                    Forgot Password
                  </CustomText>
                </Row>
                {/* <Row
                  style={{ height: 30 }}
                  bgColor={COLORS?.tabBg}
                  borderRadius={5}
                  marginBottom={33}
                >
                  <Button
                    text="Email"
                    onPress={() => setSelectedForm('email')}
                    height={'30px'}
                    width={'50%'}
                    textSize={12}
                    textColor={
                      selectedForm === 'email' ? COLORS?.black : COLORS?.gray_1
                    }
                    bgColor={
                      selectedForm === 'email' ? COLORS?.primary : 'transparent'
                    }
                    // disabled={!isValid}
                  />
                  <Button
                    text="Phone number"
                    textSize={12}
                    onPress={() => setSelectedForm('phone')}
                    height={'30px'}
                    width={'50%'}
                    textColor={
                      selectedForm === 'phone' ? COLORS?.black : COLORS?.gray_1
                    }
                    bgColor={
                      selectedForm === 'phone' ? COLORS?.primary : 'transparent'
                    }
                    // disabled={!isValid}
                  />
                </Row> */}
                <CustomText
                  color={COLORS.subtitle}
                  align="left"
                  fontSize={13}
                  fontFamily={fonts.PoppinsMedium}
                  bottom={20}
                >
                  {selectedForm === 'email'
                    ? 'Provide your registered email address to get the verification code'
                    : 'Provide your registered phone number to get the verification code'}
                </CustomText>
                {selectedForm === 'email' ? (
                  <TextInput
                    marginTop={10}
                    label={'Email address'}
                    placeholder="Email address"
                    returnValue={true}
                    handleChange={handleChange('email')}
                    value={values.email}
                  />
                ) : (
                  <TextInput
                    marginTop={10}
                    label={'Phone number'}
                    placeholder="Phone number"
                    returnValue={true}
                    handleChange={handleChange('phone')}
                    value={values.phone}
                  />
                )}

                <Button
                  text="Send code"
                  top={30}
                  onPress={handleSubmit}
                  disabled={!isValid}
                  loading={isLoading || isLoadingPhone}
                />
              </Col>
            </>
          )}
        </Formik>
      </SafeAreaWrap>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;
