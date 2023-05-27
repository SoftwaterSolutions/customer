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
import EmptySvg from '../../../../assets/svgs/emptyNotifications.svg';
import NotifySvg from '../../../../assets/svgs/notify.svg';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInput from '../../../../components/Input/TextInput';
import Button from '../../../../components/Button/Button';

const Notifications = ({ navigation }) => {
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

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  const ItemCard = ({ item, index, onPress, cartItems }) => (
    <PressableCol borderRadius={4} marginTop={5} padding={15}>
      <Row justify={'flex-start'}>
        <NotifySvg />
        <CustomText
          color={COLORS.black}
          align="left"
          fontSize={12}
          left={15}
          fontFamily={fonts.PoppinsMedium}
        >
          Order 124345 has been delivered
        </CustomText>
      </Row>
      <Row>
        <CustomText
          color={COLORS.gray_3}
          align="left"
          fontSize={12}
          top={10}
          left={20}
          fontFamily={fonts.PoppinsMedium}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non viverra
          egestas nulla sit lacus, quis. Neque urna congue.
        </CustomText>
      </Row>
    </PressableCol>
  );

  const EmptyComponent = () => {
    return (
      <Col style={{ flexGrow: 1 }} align={'center'} justify={'center'}>
        <EmptySvg width={200} />
        <CustomText
          color={COLORS.gray_2}
          align="center"
          top={16}
          fontSize={16}
          fontFamily={fonts.PoppinsSemiBold}
        >
          No notifications yet
        </CustomText>
        <CustomText
          color={COLORS.gray_2}
          align="center"
          fontSize={13}
          top={10}
          bottom={100}
          fontFamily={fonts.PoppinsMedium}
        >
          You can view your fooddy notifications here
        </CustomText>
      </Col>
    );
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
              Notifications
            </CustomText>
          </Row>
        </Row>
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7]}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => setRefetch(true)}
          contentContainerStyle={{
            marginHorizontal: 15,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          ListEmptyComponent={<EmptyComponent />}
        />
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

export default Notifications;

const styles = StyleSheet.create({});
