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
import { Formik, useFormik } from 'formik';
import PhoneInput from '../../../components/Input/PhoneInput';
import PasswordInput from '../../../components/Input/PasswordInput';
import Button from '../../../components/Button/Button';
import CustomText from '../../../components/CustomText/CustomText';
import * as Yup from 'yup';
import fonts from '../../../constants/fonts';
import TextInput from '../../../components/Input/TextInput';
import { Col, Row, SpacedRow } from '../../../components/CustomGrid/CustomGrid';
import CountrySelect from '../../../components/Input/CountrySelect';
import DropdownInput from '../../../components/Input/DropdownInput';
import { sortByProperty, updateArrayWithFlags } from '../../../helpers/format';
import {
  useGetCountriesMutation,
  useSignupUserMutation,
} from '../../../redux/features/auth/authApi';
import {
  saveCountries,
  saveCountry,
  saveUser,
} from '../../../redux/features/auth/authSlice';
import { ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Image } from 'react-native';
const yourhandle = require('countrycitystatejson');

const SignUp = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const { countries, country: selectedCountry } = useSelector(
    (state) => state.userAuth
  );

  const [states, setStates] = useState([]);
  const [validateOnChange, setValidateOnChange] = useState(false);

  const [stateId, setStateId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const phoneRegExp = /^[7-9][0-1][0-9]{8}$/im;
  const canadaPhoneRegExp =
    /^(1[\s-]?)?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().label('First name'),
    lastName: Yup.string().required().label('Last name'),
    state: Yup.string().required().label('State'),
    country: Yup.string().required().label('Country'),
    email: Yup.string().email().required().label('Email address'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .when('country', {
        is: 'Nigeria',
        then: Yup.string()
          .matches(phoneRegExp, 'Phone number is not valid')
          .required('Phone number is required')
          .label('Phone number'),
      })
      .when('country', {
        is: 'Canada',
        then: Yup.string()
          .matches(canadaPhoneRegExp, 'Phone number is not valid')
          .required('Phone number is required')
          .label('Phone number'),
      }),

    password: Yup.string()
      .required('Password is required')
      .min(6)
      .label('Password'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
      .label('Password'),
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    isValid,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirm: '',
      country: '',
      state: '',
    },
    validateOnMount: false,
    validateOnChange,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSignUp(values),
  });

  console.log(selectedCountry?.country_short_code);

  useEffect(() => {
    if (selectedCountry?.country_short_code) {
      const updatedStates = sortByProperty(
        yourhandle
          ?.getStatesByShort(selectedCountry?.country_short_code)
          ?.map((x) => {
            return {
              label: x,
              value: x,
              id: x,
            };
          }),
        'label'
      );
      setStates(updatedStates);

      setFieldValue('country', selectedCountry?.name);
    }
  }, [
    selectedCountry?.country_short_code,
    dispatch,
    countries,
    selectedCountry,
  ]);

  const [signupUser, { isLoading }] = useSignupUserMutation();

  const handleSignUp = async (values) => {
    const resolveValues = {
      ...values,
      phoneNumber: values.phoneNumber,
    };
    console.log(resolveValues);
    const res = await signupUser(resolveValues);
    console.log(res);
    if (res?.data?.status === 'success') {
      toast.show(res?.data?.message, {
        type: 'success',
        placement: 'top',
        duration: 4000,
      });
      dispatch(saveUser(resolveValues));
      navigation.navigate('VerifyAccount', {
        from: 'signup',
        formType: 'email',
      });
    } else {
      toast.show('Signup failed', {
        type: 'error',
        placement: 'top',
        duration: 4000,
      });
    }
  };

  return (
    <ScrollView
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
        <Col>
          <Row
            align={'center'}
            marginTop={20}
            marginBottom={0}
            marginLeft={-15}
          >
            <BackArrowSvg onPress={() => navigation.goBack()} />
          </Row>
          <Row align={'center'} marginTop={35} marginBottom={30}>
            <CustomText
              color={COLORS.black}
              align="left"
              fontWeight={500}
              fontSize={24}
              fontFamily={fonts.PoppinsBold}
            >
              Sign up
            </CustomText>
            <CountrySelect
              visible={modalVisible}
              setVisible={setModalVisible}
              reset={true}
            />
          </Row>

          <TextInput
            marginTop={10}
            label={'First Name'}
            placeholder="First Name"
            returnValue={true}
            handleChange={handleChange('firstName')}
            value={values.firstName}
            errors={errors.firstName}
          />
          <TextInput
            marginTop={10}
            label={'Last Name'}
            placeholder="Last Name"
            returnValue={true}
            handleChange={handleChange('lastName')}
            value={values.lastName}
            errors={errors.lastName}
          />
          <TextInput
            marginTop={10}
            label={'Phone Number'}
            placeholder="Phone Number"
            returnValue={true}
            handleChange={(e) => {
              setFieldValue(
                'phoneNumber',
                e?.startsWith('0') ? e?.slice(1) : e
              );
            }}
            value={values.phoneNumber}
            errors={errors.phoneNumber}
            phoneCode={`+${selectedCountry?.calling_code}`}
            phoneFlag={
              selectedCountry?.flags?.png ? (
                <Image
                  style={{ width: 20, height: 10 }}
                  source={{ uri: selectedCountry?.flags?.png }}
                />
              ) : selectedCountry?.flags?.svg ? (
                <SvgUri
                  width={'20px'}
                  height={'16px'}
                  uri={selectedCountry?.flags?.svg}
                />
              ) : (
                <></>
              )
            }
            inputType={'numeric'}
          />

          <TextInput
            marginTop={10}
            label={'Email Address'}
            placeholder="Email Address"
            returnValue={true}
            handleChange={handleChange('email')}
            value={values.email}
            errors={errors.email}
          />
          <PasswordInput
            marginTop={16}
            label="Password"
            placeholder="Password"
            handleChange={handleChange('password')}
            value={values.password}
            errors={errors.password}
          />
          <PasswordInput
            marginTop={16}
            label="Confirm Password"
            placeholder="Confirm Password"
            handleChange={handleChange('passwordConfirm')}
            value={values.passwordConfirm}
            errors={errors.passwordConfirm}
          />

          <DropdownInput
            placeholder="State"
            options={states}
            setOptions={setStates}
            setValue={setStateId}
            value={stateId}
            onSelectItem={(e) => setFieldValue('state', e.value)}
            zIndex={5}
            loading={true}
            label="State/Province"
            marginTop={15}
            dropDownDirection="TOP"
            maxHeight={200}
          />

          <Button
            text="Sign up"
            top={30}
            onPress={() => {
              setValidateOnChange(true);
              handleSubmit();
            }}
            disabled={(!isValid && validateOnChange) || isLoading}
            loading={isLoading}
          />
        </Col>
        <Row justify={'center'} align={'center'} marginBottom={40}>
          <CustomText
            color={COLORS.black}
            align="left"
            fontSize={13}
            fontFamily={fonts.PoppinsMedium}
          >
            Already have an account?
          </CustomText>
          <Button
            bgColor={COLORS?.white}
            textColor={COLORS?.primary}
            height={'30px'}
            width={'60px'}
            textTop={0}
            text="Sign In"
            align={'flex-start'}
            onPress={() => navigation.navigate('SignIn')}
          />
        </Row>
      </SafeAreaWrap>
    </ScrollView>
  );
};

export default SignUp;
