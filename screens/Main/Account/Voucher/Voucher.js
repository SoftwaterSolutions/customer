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
import EmptySvg from '../../../../assets/svgs/emptyVoucher.svg';
import NotifySvg from '../../../../assets/svgs/notify.svg';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInput from '../../../../components/Input/TextInput';
import Button from '../../../../components/Button/Button';
import { NairaSign } from '../../../../constants/text';
const sampleProductImage = require('../../../../assets/svgs/mango.png');
import DeleteSvg from '../../../../assets/svgs/delete.svg';
import SmallCartSvg from '../../../../assets/svgs/smallCartBlack.svg';

const Voucher = ({ navigation }) => {
  const dispatch = useDispatch();
  const { countries, country } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [stateId, setStateId] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

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
    <Row borderRadius={4} marginBottom={8} style={{ height: 100 }}>
      <Col bgColor={COLORS.primary} width={'30%'} style={{ height: '100%' }}>
        <Row align={'center'}>
          <Col
            width={'20px'}
            style={{ height: 20, position: 'absolute', top: 40, left: -5 }}
            borderRadius={20}
          ></Col>
          <Col
            style={{ position: 'absolute', top: 25, left: 25 }}
            bgColor={'transparent'}
            width={'60%'}
            justify={'center'}
            align={'center'}
          >
            <CustomText
              color={COLORS.black}
              align="center"
              top={5}
              fontSize={12}
              fontFamily={fonts.MontserratMedium}
            >
              Balance
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="center"
              top={5}
              fontSize={14}
              fontFamily={fonts.MontserratMedium}
            >
              10,000
            </CustomText>
          </Col>
        </Row>
      </Col>
      <Row style={{ height: '100%' }} justify={'center'} width={'70%'}>
        <Col justify={'center'} marginLeft={10} width={'90%'}>
          <CustomText
            color={COLORS.black}
            align="center"
            top={5}
            fontSize={12}
            fontFamily={fonts.MontserratMedium}
          >
            Code: AUG22@ADEMOLA
          </CustomText>
          <CustomText
            color={COLORS.gray_3}
            align="center"
            top={15}
            fontSize={12}
            fontFamily={fonts.MontserratMedium}
          >
            Initial amount: ₦ 132,000
          </CustomText>
        </Col>
      </Row>
    </Row>
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
          No vouchers yet
        </CustomText>
        <CustomText
          color={COLORS.gray_2}
          align="center"
          fontSize={13}
          top={10}
          bottom={100}
          fontFamily={fonts.PoppinsMedium}
        >
          You can view your vouchers here
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
              Vouchers
            </CustomText>
          </Row>
          <Col
            width={'28px'}
            style={{ height: 28 }}
            align={'center'}
            justify={'center'}
            marginRight={10}
          >
            <Col
              bgColor={COLORS.primary}
              width={'13px'}
              style={{ position: 'absolute', top: 0, right: -4, height: 13 }}
              borderRadius={6}
              align={'center'}
              justify={'center'}
            >
              <CustomText
                color={COLORS.black}
                align="center"
                top={1}
                fontSize={10}
                fontFamily={fonts.PoppinsMedium}
              >
                2
              </CustomText>
            </Col>
            <SmallCartSvg onPress={() => navigation.navigate('Cart')} />
          </Col>
        </Row>
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => setRefetch(true)}
          contentContainerStyle={{
            marginHorizontal: 15,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          ListEmptyComponent={<EmptyComponent />}
        />
        <Col
          style={{
            position: 'absolute',
            bottom: 0,
            paddingTop: 20,
            paddingBottom: 40,
            paddingHorizontal: 24,
            left: 0,
            right: 0,
          }}
        >
          <Button text={'Purchase voucher'} />
        </Col>
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

export default Voucher;

const styles = StyleSheet.create({});
