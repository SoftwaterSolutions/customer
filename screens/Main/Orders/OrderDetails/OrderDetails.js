import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import PhoneSvg from '../../../../assets/svgs/phone.svg';
import CompletedSvg from '../../../../assets/svgs/success_tiny.svg';
import Button from '../../../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SearchInput from '../../../../components/Input/SearchInput';
import { NairaSign } from '../../../../constants/text';
const sampleProductImage = require('../../../../assets/svgs/mango.png');
import MinusSvg from '../../../../assets/svgs/minus.svg';
import PlusSvg from '../../../../assets/svgs/plus.svg';
import DeleteSvg from '../../../../assets/svgs/delete.svg';
import DeleteCartModal from '../../../components/DeleteCartModal';
import DeliveryAddressModal from '../../../components/DeliveryAddressModal';
import PaymentMethodModal from '../../../components/PaymentMethodModal';
import DebitCardSvg from '../../../../assets/svgs/debitCard.svg';
import CreditCardSvg from '../../../../assets/svgs/creditCard.svg';
import VoucherSvg from '../../../../assets/svgs/voucher.svg';
import SuccessModal from '../../../components/SuccessModal';
import { useToast } from 'react-native-toast-notifications';
import { useGetUserOrderMutation } from '../../../../redux/features/user/userApi';
import moment from 'moment';
import { capitalize, formatCurrency } from '../../../../helpers/formatText';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../../../components/Loader/Loader';
import { isSubstringInArray } from '../../../../helpers/formatArray';
import { Linking } from 'react-native';

const OrderDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const id = route.params?.id;
  const { countries, country } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [getUserOrder, { isLoading: isLoadingGetUserOrder }] =
    useGetUserOrderMutation();

  const fetchOrder = async () => {
    const res = await getUserOrder(id);
    if (res?.data?.status === 'success') {
      console.log(res?.data?.data?.country_id?.name);
      setOrderDetails({
        ...res?.data?.data,
        country: JSON.parse(res?.data?.data?.country),
        market: JSON.parse(res?.data?.data?.market),
      });
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
      navigation.goBack();
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchOrder();
    }, [dispatch, refetch])
  );

  const filteredData = useMemo(() => {
    let filtered = orderDetails?.items ? JSON.parse(orderDetails?.items) : [];
    filtered = filtered?.map((x) => {
      return {
        ...x,
        name: x?.product_id?.name,
        quantity: x?.quantity,
        country_name: x?.priceByMarket_id?.market_id?.country_name,
        price: x?.priceByMarket_id?.price,
        uom: x?.priceByMarket_id?.uom_id?.name,
        image: x?.product_id?.imageCover,
        product_id: x?.product_id?.id,
        id: x?.id,
      };
    });
    console.log('====================================');
    console.log(orderDetails);
    console.log('====================================');
    return filtered;
  }, [orderDetails]);

  const phoneNumber = '08012345678';
  const url = `tel:${phoneNumber}`;

  const callManager = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log(`Don't know how to open URI: ${url}`);
        }
      })
      .catch((error) => {
        console.log(`An error occurred: ${error}`);
      });
  };

  const renderPageContent = ({ item, index }) => {
    return (
      <Col marginTop={5} bgColor={COLORS.mainBg}>
        <Col
          paddingLeft={24}
          paddingRight={24}
          marginTop={3}
          marginBottom={3}
          paddingVertical={15}
        >
          <Row>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsMedium}
            >
              ORDER ID
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={14}
              fontFamily={fonts.PoppinsSemiBold}
            >
              {orderDetails?.order_id}
            </CustomText>
          </Row>
          <Row marginTop={8} align="center">
            <CustomText
              color={COLORS.gray_1}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              Status
            </CustomText>

            {isSubstringInArray(orderDetails?.order_status, ['delivered']) ? (
              <CustomText
                color={COLORS.green}
                align="left"
                fontSize={13}
                top={1}
                fontFamily={fonts.PoppinsRegular}
                style={{
                  backgroundColor: COLORS.greenLight,
                  flexDirection: 'row',
                  paddingVertical: 3,
                  paddingHorizontal: 7,
                  borderRadius: 15,
                }}
              >
                Delivered
              </CustomText>
            ) : isSubstringInArray(orderDetails?.order_status, [
                'cancelled',
                'canceled',
              ]) ? (
              <CustomText
                color={COLORS.red}
                align="left"
                fontSize={13}
                top={1}
                fontFamily={fonts.PoppinsRegular}
                style={{
                  backgroundColor: COLORS.redLight,
                  flexDirection: 'row',
                  paddingVertical: 3,
                  paddingHorizontal: 7,
                  borderRadius: 15,
                }}
              >
                {capitalize(orderDetails?.order_status)}
              </CustomText>
            ) : (
              <CustomText
                color={COLORS.primary}
                align="left"
                fontSize={13}
                top={1}
                fontFamily={fonts.PoppinsRegular}
                style={{
                  backgroundColor: COLORS.yellowLight,
                  flexDirection: 'row',
                  paddingVertical: 3,
                  paddingHorizontal: 7,
                  borderRadius: 15,
                }}
              >
                {isSubstringInArray(orderDetails?.order_status, ['intransit'])
                  ? 'In Transit'
                  : 'Processing'}
              </CustomText>
            )}
          </Row>
          <Row marginTop={10}>
            <CustomText
              color={COLORS.gray_1}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              Date Placed
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={13}
              fontFamily={fonts.PoppinsMedium}
            >
              {moment(orderDetails?.createdAt).format('ddd MMM DD, yyyy')}
            </CustomText>
          </Row>
        </Col>
        <View
          style={{
            paddingHorizontal: 24,
            width: '100%',
            backgroundColor: COLORS.white,
            paddingVertical: 10,
            marginBottom: 3,
          }}
        >
          <CustomText
            color={COLORS.black}
            align="left"
            fontSize={13}
            fontFamily={fonts.PoppinsMedium}
          >
            ORDER SUMMARY
          </CustomText>
          <FlatList
            data={filteredData}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => setRefetch(true)}
          />
          {/* <Button
            top={15}
            text={'Re-order'}
            onPress={() => setSuccessVisible(true)}
          /> */}
        </View>
        <Col
          paddingLeft={24}
          paddingRight={24}
          paddingVertical={10}
          marginBottom={3}
        >
          <Row marginTop={8}>
            <CustomText
              color={COLORS.gray_1}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              Item Total
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                orderDetails?.total_item_amount,
                2,
                orderDetails?.country_id?.name
                  ?.toLowerCase()
                  ?.includes('nigeria')
                  ? '₦'
                  : orderDetails?.country?.currency?.symbol
              )}
            </CustomText>
          </Row>
          <Row marginTop={8}>
            <CustomText
              color={COLORS.gray_1}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              Delivery Fee
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                orderDetails?.total_delivery_fee,
                2,
                orderDetails?.country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : orderDetails?.country?.currency?.symbol
              )}
            </CustomText>
          </Row>
          <Row marginTop={8}>
            <CustomText
              color={COLORS.gray_1}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              Service Charge
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                orderDetails?.total_service_charge,
                2,
                orderDetails?.country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : orderDetails?.country?.currency?.symbol
              )}
            </CustomText>
          </Row>
          <Row marginTop={8}>
            <CustomText
              color={COLORS.gray_1}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              {`VAT (${orderDetails?.country?.vat}%)`}
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                orderDetails?.total_vat,
                2,
                orderDetails?.country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : orderDetails?.country?.currency?.symbol
              )}
            </CustomText>
          </Row>
          <Row marginTop={8}>
            <CustomText
              color={COLORS.gray_1}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              {`Country Tax (${orderDetails?.country?.country_tax}%)`}
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                orderDetails?.total_country_tax,
                2,
                orderDetails?.country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : orderDetails?.country?.currency?.symbol
              )}
            </CustomText>
          </Row>
          <Row marginTop={8} marginBottom={8}>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={14}
              fontFamily={fonts.PoppinsMedium}
            >
              TOTAL
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                orderDetails?.total_amount,
                2,
                orderDetails?.country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : orderDetails?.country?.currency?.symbol
              )}
            </CustomText>
          </Row>
        </Col>
        <Col
          paddingLeft={24}
          paddingRight={24}
          marginBottom={3}
          paddingVertical={15}
        >
          <Row justify={'flex-start'} paddingBottom={10}>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsMedium}
            >
              DELIVERY ADDRESS
            </CustomText>
          </Row>

          <Row paddingBottom={5} borderRadius={5} showBorder>
            <Col width={'100%'}>
              <CustomText
                color={COLORS.black}
                align="left"
                fontSize={14}
                fontFamily={fonts.PoppinsMedium}
              >
                {orderDetails?.delivery_address_id?.tag}
              </CustomText>
              <CustomText
                color={COLORS.black}
                align="left"
                fontSize={12}
                top={3}
                fontFamily={fonts.PoppinsRegular}
              >
                {orderDetails?.delivery_address_id?.contact_name}
              </CustomText>
              <CustomText
                color={COLORS.gray_1}
                align="left"
                fontSize={12}
                top={3}
                fontFamily={fonts.PoppinsRegular}
              >
                {`${orderDetails?.delivery_address_id?.street_address}, ${orderDetails?.delivery_address_id?.city}, ${orderDetails?.delivery_address_id?.state}, ${orderDetails?.delivery_address_id?.country}`}
              </CustomText>
              <CustomText
                color={COLORS.gray_1}
                align="left"
                fontSize={12}
                top={3}
                fontFamily={fonts.PoppinsRegular}
              >
                {orderDetails?.delivery_address_id?.contact_phone}
              </CustomText>
            </Col>
          </Row>
        </Col>
      </Col>
    );
  };

  const ProductCard = ({ item, index, onPress, cartItems }) => (
    <Col borderRadius={4} paddingTop={15}>
      <Row
        justify={'flex-start'}
        showBorder={filteredData?.length !== index + 1}
        paddingBottom={10}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: 54, height: 54, marginRight: 10 }}
          resizeMode="contain"
        />
        <View style={{ flexGrow: 1 }}>
          <Row>
            <CustomText
              color={COLORS.black}
              align="center"
              fontSize={14}
              fontFamily={fonts.PoppinsMedium}
            >
              {item?.name}
            </CustomText>
          </Row>
          <Row justify={'flex-start'}>
            <CustomText
              color={COLORS.gray_1}
              align="center"
              fontSize={12}
              fontFamily={fonts.PoppinsLight}
            >
              Price per Unit:
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="center"
              fontSize={12}
              fontFamily={fonts.PoppinsLight}
            >
              {` ${formatCurrency(
                item?.price,
                2,
                orderDetails?.country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : orderDetails?.country?.currency?.symbol
              )}`}
            </CustomText>
          </Row>
          <Row justify={'flex-start'}>
            <CustomText
              color={COLORS.gray_1}
              align="center"
              fontSize={12}
              fontFamily={fonts.PoppinsLight}
            >
              Quantity:
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="center"
              fontSize={12}
              fontFamily={fonts.PoppinsLight}
            >
              {` ${item?.quantity} (${item?.uom})`}
            </CustomText>
          </Row>
        </View>
        <View
          style={{
            flexGrow: 1,
            alignSelf: 'flex-start',
            alignItems: 'flex-end',
          }}
        >
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={16}
            fontFamily={fonts.PoppinsMedium}
          >
            {formatCurrency(
              item?.quantity * item?.price,
              2,
              orderDetails?.country?.name?.toLowerCase()?.includes('nigeria')
                ? '₦'
                : orderDetails?.country?.currency?.symbol
            )}
          </CustomText>
        </View>
      </Row>
    </Col>
  );

  const renderProduct = ({ item, index }) => {
    return <ProductCard item={item} index={index} />;
  };

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
        }}
        bgColor={COLORS.mainBg}
      >
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
                Order Details
              </CustomText>
            </Row>
          </Row>
        </Col>
        {isLoadingGetUserOrder ? (
          <Loader style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={orderDetails ? [orderDetails] : []}
            renderItem={renderPageContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 115,
            }}
          />
        )}
      </SafeAreaWrap>

      {orderDetails && !isLoadingGetUserOrder && (
        <Row
          style={{
            position: 'absolute',
            bottom: 0,
            paddingTop: 20,
            paddingBottom: 20,
            paddingHorizontal: 24,
            left: 0,
            right: 0,
          }}
        >
          <View style={{ alignItems: 'flex-start', marginRight: 10 }}>
            <Button
              textComponent={<PhoneSvg marginRight={10} marginLeft={10} />}
              onPress={() => callManager(url)}
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            <Button
              text={'Track Order'}
              onPress={() => navigation.navigate('TrackOrder', orderDetails)}
            />
          </View>
        </Row>
      )}
    </>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  counterInput: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    maxWidth: 42,
    minWidth: 25,
    textAlign: 'center',
    color: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
  },
});
