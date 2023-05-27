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

const ChangePassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const { countries, country } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [stateId, setStateId] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

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
              Change Password
            </CustomText>
          </Row>
        </Row>
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={'handled'}
        >
          <Col marginTop={5} style={{ flexGrow: 1 }}>
            <Col
              paddingLeft={24}
              paddingRight={24}
              marginBottom={5}
              style={{ flexGrow: 1 }}
            >
              <Formik
                initialValues={{
                  oldpassword: '',
                  password: '',
                  confirmpassword: '',
                }}
                initialTouched={{
                  field: false,
                }}
                validateOnMount={true}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSignUp(values)}
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
                      <TextInput
                        marginTop={20}
                        label={'Current password'}
                        placeholder="Enter current password"
                        returnValue={true}
                        handleChange={handleChange('oldpassword')}
                        value={values.oldpassword}
                      />
                      <TextInput
                        marginTop={20}
                        label={'New password'}
                        placeholder="New password"
                        returnValue={true}
                        handleChange={handleChange('password')}
                        value={values.password}
                      />

                      <TextInput
                        marginTop={20}
                        label={'Confirm New password'}
                        placeholder="Confirm New password"
                        returnValue={true}
                        handleChange={handleChange('confirmpassword')}
                        value={values.confirmpassword}
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
                        text={'Save Changes'}
                        top={20}
                        bottom={30}
                        onPress={() => {
                          handleSubmit();
                        }}
                        // disabled={!isValid}
                        style={{
                          bottom: 0,
                        }}
                      />
                    </Col>
                  </>
                )}
              </Formik>
            </Col>
          </Col>
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

export default ChangePassword;

const styles = StyleSheet.create({});
