/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Dimensions,
  Animated,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import CloseSvg from '../../assets/svgs/cross-circle.svg';
import TickSvg from '../../assets/svgs/tickYellow.svg';
import DebitCardSvg from '../../assets/svgs/debitCard.svg';
import CreditCardSvg from '../../assets/svgs/creditCard.svg';
import EmptyCheck from '../../assets/svgs/emptyCircleCheck.svg';
import FilledCheck from '../../assets/svgs/filledCircleCheck.svg';
import VoucherSvg from '../../assets/svgs/voucher.svg';
import LeftArrow from '../../assets/svgs/leftArrow.svg';
import CustomText from '../../components/CustomText/CustomText';
import fonts from '../../constants/fonts';
import TextInput from '../../components/Input/TextInput';
import Button from '../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import Loader from '../../components/Loader/Loader';
import { Col, PressableRow, Row } from '../../components/CustomGrid/CustomGrid';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import DropdownInput from '../../components/Input/DropdownInput';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { sortByProperty } from '../../helpers/formatArray';
import { useToast } from 'react-native-toast-notifications';
import { useCreateDeliveryAddressMutation } from '../../redux/features/user/userApi';
import { SvgUri } from 'react-native-svg';
import { Image } from 'react-native';
import { capitalize } from '../../helpers/formatText';
import { saveArea } from '../../redux/features/auth/authSlice';
const yourhandle = require('countrycitystatejson');

const BlackBg = styled.View`
  justify-content: space-between;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 8, 15, 0.74);
`;

const WhiteBg = styled.View`
  background-color: ${COLORS.white};
  width: 100%;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 20px;
`;

const AddDeliveryAddressModal = ({ visible, setVisible }) => {
  const { height } = useWindowDimensions();
  const dispatch = useDispatch();
  const toast = useToast();
  const translateY = useRef(new Animated.Value(height)).current;
  const {
    user,
    country,
    area,
    countries: countriesList,
  } = useSelector((state) => state.userAuth);
  const { areas } = useSelector((state) => state.userStore);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [validateOnChange, setValidateOnChange] = useState(false);
  console.log(area?.name, area?.state_name, country?.name, areas?.length);
  const phoneRegExp = /^[7-9][0-1][0-9]{8}$/im;
  const canadaPhoneRegExp =
    /^(1[\s-]?)?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;

  const validationSchema = Yup.object().shape({
    customer_id: Yup.string()
      .required('Customer ID is required')
      .label('User not foud'),
    street_address: Yup.string()
      .required('Street Address is required')
      .label(''),
    apartment: Yup.string().label('Apartment/Suite No'),
    city: Yup.string().required('City is required').label('City'),
    state: Yup.string().required('State is required').label('State'),
    country: Yup.string().required('Country is required').label('Country'),
    tag: Yup.string().label('Address Tag'),
    additional_info: Yup.string().label('Delivery instructions'),
    contact_name: Yup.string()
      .required('Contact Name is required')
      .label('Contact Name'),
    contact_phone: Yup.string()
      .required('Contact Phone is required')
      .label('Contact Phone number'),
    contact_phone: Yup.string()
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
    status: Yup.boolean()
      .required('Status is required')
      .default(true)
      .label('Status'),
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
    resetForm,
  } = useFormik({
    initialValues: {
      customer_id: user?.id,
      street_address: '',
      apartment: '',
      country: country?.name,
      state: country?.name?.toLowerCase() == 'nigeria' ? area?.state_name : '',
      city: country?.name?.toLowerCase() == 'nigeria' ? area?.name : '',
      tag: '',
      additional_info: '',
      contact_name:
        user?.country?.toLowerCase() === country?.name?.toLowerCase()
          ? capitalize(user?.firstName + ' ' + user?.lastName)
          : '',
      contact_phone:
        user?.country?.toLowerCase() === country?.name?.toLowerCase()
          ? user?.phoneNumber
          : '',
      status: true,
    },
    validateOnMount: false,
    validateOnChange: validateOnChange,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => handleAddAddress(values),
  });

  useEffect(() => {
    if (country) {
      const extrCountries = countriesList?.map((x) => {
        return {
          label: x?.name,
          value: x?.name,
          id: x?.id || x?._id,
        };
      });
      const extrStates = country?.states?.map((x) => {
        return {
          label: x?.name,
          value: x?.name,
          id: x?.id || x?._id,
        };
      });
      const extrAreas = areas?.map((x) => {
        return {
          label: x?.name,
          value: x?.name,
          id: x?.id || x?._id,
        };
      });
      console.log(user?.country?.toLowerCase(), country?.name?.toLowerCase());
      if (user?.country?.toLowerCase() != country?.name?.toLowerCase()) {
        setFieldValue(
          'contact_name',
          capitalize(user?.firstName + ' ' + user?.lastName)
        );
        setFieldValue('contact_phone', user?.phoneNumber);
      }
      setCountries(sortByProperty(extrCountries, 'label'));
      setStates(sortByProperty(extrStates, 'label'));
      setCities(sortByProperty(extrAreas, 'label'));
    }
  }, [country, countriesList, user, areas]);

  const [createDeliveryAddress, { isLoading }] =
    useCreateDeliveryAddressMutation();

  const handleAddAddress = async (values) => {
    const resolveValues = {
      ...values,
    };
    const res = await createDeliveryAddress(resolveValues);
    console.log(res);
    if (res?.data?.status === 'success') {
      toast.show(res?.data?.message || 'Address added successfully', {
        type: 'success',
        placement: 'top',
        duration: 2000,
      });
      setVisible(false);
    } else {
      toast.show(res?.data?.message || res?.error?.data?.message, {
        type: 'error',
        placement: 'top',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (country?.name?.toLowerCase() !== 'nigeria') {
      dispatch(saveArea(null));
    }
  }, [visible]);
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        delay: 50,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    resetForm();
  }, [visible]);

  const closeModal = () => {
    Animated.spring(translateY, {
      toValue: height,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  return (
    <Modal transparent={true} visible={visible}>
      <BlackBg>
        <Animated.View
          style={{
            transform: [{ translateY }],
            width: '100%',
            alignSelf: 'flex-end',
          }}
        >
          <WhiteBg style={{ flexGrow: 1 }}>
            <Row paddingLeft={15} paddingRight={15}>
              <Row justify={'flex-start'} align={'center'} width={'200px'}>
                <LeftArrow marginRight={15} onPress={closeModal} />
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={16}
                  top={3}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Add Delivery Address
                </CustomText>
              </Row>
            </Row>
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps={'handled'}
            >
              <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                <TextInput
                  marginTop={10}
                  label={'Street address'}
                  placeholder="Enter your street address"
                  handleChange={handleChange('street_address')}
                  value={values?.street_address}
                  errors={errors?.street_address}
                />
              </Row>
              <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                <TextInput
                  marginTop={10}
                  label={'Suite/Apartment Info (Optional)'}
                  placeholder="Enter your suite or Apartment No."
                  handleChange={handleChange('apartment')}
                  value={values?.apartment}
                  errors={errors?.apartment}
                />
              </Row>
              <DropdownInput
                paddingLeft={'24px'}
                paddingRight={'24px'}
                options={countries}
                setOptions={setCountries}
                onSelectItem={(e) => setFieldValue('country', e.value)}
                zIndex={500}
                loading={true}
                marginTop={20}
                label={'Country'}
                placeholder="Select your country"
                value={values?.country}
                errors={errors?.country}
                disabled={true}
              />
              <DropdownInput
                paddingLeft={'24px'}
                paddingRight={'24px'}
                options={states}
                setOptions={setStates}
                onSelectItem={(e) => setFieldValue('state', e.value)}
                zIndex={50}
                loading={true}
                disabled={country?.name?.toLowerCase() == 'nigeria'}
                marginTop={20}
                label={'State'}
                placeholder="Select your state"
                value={values?.state}
                errors={errors?.state}
              />
              {country?.name?.toLowerCase()?.includes('nigeria') ? (
                <DropdownInput
                  paddingLeft={'24px'}
                  paddingRight={'24px'}
                  options={cities}
                  setOptions={setCities}
                  onSelectItem={(e) => setFieldValue('city', e.value)}
                  zIndex={5}
                  loading={true}
                  disabled={country?.name?.toLowerCase() == 'nigeria'}
                  marginTop={20}
                  label={'City'}
                  placeholder="Select your city"
                  value={values?.city}
                  errors={errors?.city}
                />
              ) : (
                <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                  <TextInput
                    marginTop={10}
                    label={'City'}
                    placeholder="Enter your city"
                    handleChange={handleChange('city')}
                    value={values?.city}
                    errors={errors?.city}
                  />
                </Row>
              )}
              <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                <TextInput
                  marginTop={10}
                  label={'Address Tags(Optional)'}
                  placeholder="Enter a useful tag(e.g. Home, Office ...)"
                  handleChange={handleChange('tag')}
                  value={values?.tag}
                  errors={errors?.tag}
                />
              </Row>
              <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                <TextInput
                  marginTop={10}
                  placeholder="Delivery Instructions"
                  handleChange={handleChange('additional_info')}
                  value={values?.additional_info}
                  errors={errors?.additional_info}
                  multiline={true}
                  numberOfLines={4}
                  height={'90px'}
                  textAlignVertical={'top'}
                  paddingVertical={'10px'}
                />
              </Row>
              <Col>
                <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontSize={14}
                    top={3}
                    fontFamily={fonts.PoppinsMedium}
                  >
                    Contact Information
                  </CustomText>
                </Row>
                <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                  <TextInput
                    marginTop={10}
                    label={'Name'}
                    returnValue={true}
                    placeholder="Enter your name"
                    handleChange={handleChange('contact_name')}
                    value={values?.contact_name}
                    errors={errors?.contact_name}
                  />
                </Row>
                <Row marginTop={10} paddingLeft={24} paddingRight={24}>
                  <TextInput
                    marginTop={10}
                    label={'Phone Number'}
                    placeholder="Enter your Phone number"
                    returnValue={true}
                    handleChange={(e) => {
                      setFieldValue(
                        'contact_phone',
                        e?.startsWith('0') ? e?.slice(1) : e
                      );
                    }}
                    value={values.contact_phone}
                    errors={errors.contact_phone}
                    phoneCode={`+${country?.calling_code}`}
                    phoneFlag={
                      country?.flags?.png ? (
                        <Image
                          style={{ width: 20, height: 10 }}
                          source={{ uri: country?.flags?.png }}
                        />
                      ) : country?.flags?.svg ? (
                        <SvgUri
                          width={'20px'}
                          height={'16px'}
                          uri={country?.flags?.svg}
                        />
                      ) : (
                        <></>
                      )
                    }
                    inputType={'numeric'}
                  />
                </Row>
              </Col>
              <Col
                style={{
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingHorizontal: 24,
                }}
              >
                <Button
                  text={'Submit'}
                  disabled={!isValid}
                  onPress={() => {
                    setValidateOnChange(true);
                    handleSubmit();
                  }}
                  loading={isLoading}
                />
              </Col>
            </KeyboardAwareScrollView>
          </WhiteBg>
        </Animated.View>
      </BlackBg>
    </Modal>
  );
};

export default AddDeliveryAddressModal;
