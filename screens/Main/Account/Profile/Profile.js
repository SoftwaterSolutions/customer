import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeAreaWrap from '../../../../components/SafeAreaWrap/SafeAreaWrap';

import fonts from '../../../../constants/fonts';
import CustomText from '../../../../components/CustomText/CustomText';
import { COLORS } from '../../../../constants/colors';
import {
  Col,
  PressableCol,
  PressableRow,
  Row,
} from '../../../../components/CustomGrid/CustomGrid';
import { useDispatch, useSelector } from 'react-redux';
import LeftArrow from '../../../../assets/svgs/leftArrow.svg';
import EmptyDpSvg from '../../../../assets/svgs/emptyDpBig.svg';
import CameraSvg from '../../../../assets/svgs/camera.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInput from '../../../../components/Input/TextInput';
import Button from '../../../../components/Button/Button';
import { useUpdateUserMutation } from '../../../../redux/features/user/userApi';
import { saveUser } from '../../../../redux/features/auth/authSlice';
import { useToast } from 'react-native-toast-notifications';
import Loader from '../../../../components/Loader/Loader';
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } from '@env';

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { countries, country, user } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [stateId, setStateId] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  const phoneRegExp = /^(?:\+[\d-]{1,})|(?:[\d-]{1,})$/;
  const validationSchema = Yup.object().shape({
    picture: Yup.string().label('Photo'),
    firstName: Yup.string().required().label('First name'),
    lastName: Yup.string().required().label('Last name'),
    email: Yup.string().email().required().label('Email address'),
    phoneNumber: Yup.string()
      .nullable()
      .matches(phoneRegExp, 'Phonenumber is not valid')
      // .required('Phonenumber is required')
      .label('Phone number'),
  });

  const [updateUser, { isLoading: isLoadingUpdateUser }] =
    useUpdateUserMutation();

  const handleUpdate = async (values) => {
    console.log(user);
    const id = user?.id || user?._id;
    const res = await updateUser({
      id: id,
      data: values,
    });
    console.log({ updateUser: res?.error?.data || res?.data });
    if (res?.data?.status === 'success') {
      dispatch(saveUser(res.data?.data?.data));
      toast.show('Profile update successful', {
        type: 'success',
        duration: 2000,
      });
      setIsEditing(false);
    } else {
      toast.show('Profile update failed', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    setIsEditing(false);
  }, []);

  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      console.log(result.assets[0].base64?.slice(0, 100));
      let base64Img = `data:image/jpg;base64,${result.assets[0]?.base64}`;

      let data = {
        file: base64Img,
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
      };

      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(async (r) => {
          let data = await r.json();
          console.log(data);
          setFieldValue('picture', data.url);
        })
        .catch((err) => {
          console.log(err);
          toast.show(err?.error?.message || 'Image upload Failed', {
            type: 'error',
            placement: 'top',
            duration: 4000,
          });
        });
    }
  };

  const Header = () => {
    return (
      <Col paddingHorizontal={15} paddingBottom={16}>
        <Row>
          <Row justify={'flex-start'} align={'center'} width={'200px'}>
            <LeftArrow marginRight={15} onPress={() => navigation.goBack()} />
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={16}
              top={1}
              fontFamily={fonts.PoppinsMedium}
            >
              Profile
            </CustomText>
          </Row>
        </Row>
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return isLoadingUpdateUser ? (
      <Loader style={{ flex: 1 }} />
    ) : (
      <>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={'handled'}
        >
          <Formik
            initialValues={{
              picture: user?.picture || '',
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              email: user?.email || '',
              phoneNumber: user?.phoneNumber || '',
            }}
            initialTouched={{
              field: false,
            }}
            enableReinitialize={true}
            validateOnMount={true}
            validationSchema={validationSchema}
            onSubmit={(values) => handleUpdate(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              values,
              isValid,
              touched,
              setFieldValue,
            }) => (
              <Col marginTop={5} style={{ flexGrow: 1 }}>
                <PressableCol
                  paddingLeft={24}
                  paddingRight={24}
                  paddingBottom={24}
                  marginBottom={5}
                  align={'center'}
                  onPress={() => pickImage(setFieldValue)}
                >
                  {values?.picture != '' ? (
                    <Image
                      source={{ uri: values?.picture }}
                      style={{ width: 80, height: 80, borderRadius: 40 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <EmptyDpSvg />
                  )}
                  <CameraSvg marginTop={-10} />
                </PressableCol>

                <Col
                  paddingLeft={24}
                  paddingRight={24}
                  marginBottom={5}
                  style={{ flexGrow: 1 }}
                >
                  <>
                    <Col>
                      <TextInput
                        marginTop={20}
                        label={'First Name'}
                        placeholder="Enter first name"
                        returnValue={true}
                        errors={errors.firstName}
                        handleChange={handleChange('firstName')}
                        value={values.firstName}
                        disabled={!isEditing}
                      />
                      <TextInput
                        marginTop={20}
                        label={'Last Name'}
                        placeholder="Enter last name"
                        returnValue={true}
                        errors={errors.lastName}
                        handleChange={handleChange('lastName')}
                        value={values.lastName}
                        disabled={!isEditing}
                      />
                      <TextInput
                        marginTop={20}
                        label={'Phone number'}
                        placeholder="Phone number"
                        returnValue={true}
                        errors={errors.phoneNumber}
                        handleChange={handleChange('phoneNumber')}
                        value={values.phoneNumber}
                        disabled={!isEditing}
                      />

                      <TextInput
                        marginTop={20}
                        label={'Email address'}
                        placeholder="Email address"
                        returnValue={true}
                        errors={errors.email}
                        handleChange={handleChange('email')}
                        value={values.email}
                        disabled={!isEditing}
                      />
                    </Col>
                    <Col
                      style={{
                        flexGrow: 1,
                      }}
                      justify={'flex-end'}
                      width={'100%'}
                    >
                      <Button
                        text={isEditing ? 'Update' : 'Edit'}
                        top={20}
                        bottom={30}
                        onPress={() => {
                          !isEditing ? setIsEditing(true) : handleSubmit();
                        }}
                        disabled={!isValid}
                        loading={isLoadingUpdateUser}
                        style={{
                          bottom: 0,
                        }}
                      />
                    </Col>
                    {console.log(errors)}
                  </>
                </Col>
              </Col>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </>
    );
  };

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
        }}
        bgColor={COLORS.mainBg}
      >
        <Header />
        <PageContent />
      </SafeAreaWrap>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({});
