import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
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
import Track1 from '../../../../assets/svgs/track1.svg';
import Track2 from '../../../../assets/svgs/track2.svg';
import Track3 from '../../../../assets/svgs/track3.svg';
import { useGetProductsMutation } from '../../../../redux/features/user/userApi';
import { saveToUserStore } from '../../../../redux/features/user/userSlice';
import { useToast } from 'react-native-toast-notifications';
import {
  isSubstringInArray,
  removeUndefinedOrNull,
} from '../../../../helpers/formatArray';
import { capitalize, formatCurrency } from '../../../../helpers/formatText';

const sampleProductImage = require('../../../../assets/svgs/mango.png');

const TrackOrder = ({ navigation, route }) => {
  const details = route.params;
  const dispatch = useDispatch();
  const toast = useToast();
  const { countries, country, area } = useSelector((state) => state.userAuth);
  const { products } = useSelector((state) => state.userStore);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [getProducts, { isLoading: isLoadingProducts }] =
    useGetProductsMutation();
  const fetchProducts = async () => {
    const res = await getProducts();
    if (res?.data?.status === 'success') {
      // console.log({ products: res.data?.data });
      dispatch(saveToUserStore({ key: 'products', value: res.data?.data }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = products || [];
    if (filtered && filtered?.length > 0) {
      filtered = filtered?.filter(
        (prod) => prod?.country_id?._id == country?._id
      );

      filtered = filtered?.map((x) => {
        const connectedMarket = area?.market;

        let selectedObject = null;
        for (let i = 0; i < x?.priceByMarketId.length; i++) {
          const priceByMarket = x?.priceByMarketId[i];

          if (priceByMarket?.market_id?._id === connectedMarket?._id) {
            selectedObject = priceByMarket;
            break;
          }
        }
        if (!selectedObject) {
          selectedObject = x?.priceByMarketId?.find(
            (priceByMarket) =>
              priceByMarket?.market_id?.name?.toLowerCase() === 'default'
          );
        }
        if (selectedObject) {
          return { ...x, priceByMarket: selectedObject };
        }
      });
      filtered = removeUndefinedOrNull(filtered);
      filtered = filtered?.slice(0, 9);
    }
    return filtered;
  }, [products, details]);
  const ProductCard = ({ item, index, onPress, cartItems }) => (
    <View>
      <Col
        borderRadius={10}
        // align="center"
        justifyContent="center"
        style={{
          margin: 2,
          marginBottom: 10,
          width: 120,
        }}
      >
        <PressableRow
          style={{
            flexGrow: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          justify="center"
          paddingTop={5}
          onPress={() => navigation.navigate('ProductDetails', item)}
        >
          <Image
            source={{ uri: item?.imageCover }}
            style={{ width: 70, height: 70 }}
            resizeMode="cover"
          />
        </PressableRow>
        <PressableCol
          paddingTop={10}
          paddingHorizontal={10}
          justify={'flex-start'}
          onPress={() => navigation.navigate('ProductDetails', item)}
        >
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={11}
            fontFamily={fonts.PoppinsMedium}
          >
            {item?.name}
          </CustomText>
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={10}
            fontFamily={fonts.PoppinsLight}
          >
            {`(${capitalize(item?.priceByMarket?.uom_id?.name)})`}
          </CustomText>
          <CustomText
            color={COLORS.black}
            align="center"
            fontWeight={500}
            fontSize={14}
            top={5}
            bottom={8}
            fontFamily={fonts.PoppinsSemiBold}
          >
            {formatCurrency(
              item?.priceByMarket?.price,
              2,
              country?.name?.toLowerCase()?.includes('nigeria')
                ? '₦'
                : country?.currency?.symbol
            )}
          </CustomText>
        </PressableCol>
      </Col>
    </View>
  );

  const renderPageContent = ({ item, index }) => {
    return (
      <Col marginTop={5}>
        <Col
          paddingLeft={24}
          paddingRight={24}
          paddingBottom={24}
          marginBottom={5}
        >
          <Row marginTop={8}>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={14}
              fontFamily={fonts.PoppinsMedium}
            >
              Order ID
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={14}
              fontFamily={fonts.PoppinsSemiBold}
            >
              {details?.order_id}
            </CustomText>
          </Row>
          <Row marginTop={15}>
            <CustomText
              color={COLORS.green}
              align="left"
              fontSize={11}
              fontFamily={fonts.PoppinsMedium}
            >
              Placed
            </CustomText>
            <CustomText
              color={
                isSubstringInArray(details?.order_status, ['shopped', 'open'])
                  ? COLORS.primary
                  : isSubstringInArray(details?.order_status, [
                      'delivered',
                      'cancelled',
                      'intransit',
                    ])
                  ? COLORS.green
                  : COLORS.gray_3
              }
              align="left"
              fontSize={11}
              fontFamily={fonts.PoppinsMedium}
            >
              In progress
            </CustomText>
            <CustomText
              color={
                isSubstringInArray(details?.order_status, ['intransit'])
                  ? COLORS.primary
                  : isSubstringInArray(details?.order_status, [
                      'delivered',
                      'cancelled',
                    ])
                  ? COLORS.green
                  : COLORS.gray_3
              }
              align="right"
              fontSize={11}
              fontFamily={fonts.PoppinsMedium}
            >
              In transit
            </CustomText>
            <CustomText
              color={
                isSubstringInArray(details?.order_status, [
                  'delivered',
                  'cancelled',
                  'canceled',
                  'completed',
                ])
                  ? COLORS.green
                  : COLORS.gray_3
              }
              align="right"
              fontSize={11}
              fontFamily={fonts.PoppinsMedium}
            >
              {isSubstringInArray(details?.order_status, [
                'delivered',
                'cancelled',
                'canceled',
                'completed',
              ])
                ? capitalize(details?.order_status)
                : 'Delivered'}
            </CustomText>
          </Row>
          <Row marginTop={3}>
            <Col width={'40px'} align={'center'}>
              <Track1 />
            </Col>
            <View
              style={{ backgroundColor: COLORS.green, height: 2, flexGrow: 1 }}
            ></View>
            <Col width={'40px'} align={'center'}>
              {isSubstringInArray(details?.order_status, [
                'intransit',
                'delivered',
                'cancelled',
              ]) ? (
                <Track1 />
              ) : (
                <Track2 />
              )}
            </Col>
            <View
              style={{ backgroundColor: COLORS.green, height: 2, flexGrow: 1 }}
            ></View>
            <Col width={'40px'} align={'center'}>
              {isSubstringInArray(details?.order_status, [
                'delivered',
                'cancelled',
                'canceled',
                'completed',
              ]) ? (
                <Track1 />
              ) : isSubstringInArray(details?.order_status, ['intransit']) ? (
                <Track2 />
              ) : (
                <Track3 />
              )}
            </Col>
            <View
              style={{ backgroundColor: COLORS.green, height: 2, flexGrow: 1 }}
            ></View>
            <Col width={'40px'} align={'center'}>
              {isSubstringInArray(details?.order_status, [
                'delivered',
                'cancelled',
                'canceled',
                'completed',
              ]) ? (
                <Track1 />
              ) : (
                <Track3 />
              )}
            </Col>
          </Row>
        </Col>

        <Col paddingLeft={24} paddingRight={24} marginBottom={5}>
          <Row justify={'flex-start'} marginVertical={10}>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsMedium}
            >
              Delivery Address
            </CustomText>
          </Row>

          <Row paddingBottom={15} borderRadius={5} showBorder>
            <Col width={'100%'}>
              <CustomText
                color={COLORS.black}
                align="left"
                fontSize={14}
                top={3}
                fontFamily={fonts.PoppinsMedium}
              >
                {details?.delivery_address_id?.tag}
              </CustomText>
              <CustomText
                color={COLORS.black}
                align="left"
                fontSize={12}
                top={3}
                fontFamily={fonts.PoppinsRegular}
              >
                {details?.delivery_address_id?.contact_name}
              </CustomText>
              <CustomText
                color={COLORS.gray_1}
                align="left"
                fontSize={12}
                top={3}
                fontFamily={fonts.PoppinsRegular}
              >
                {`${details?.delivery_address_id?.street_address}, ${details?.delivery_address_id?.city}, ${details?.delivery_address_id?.state}, ${details?.delivery_address_id?.country}`}
              </CustomText>
              <CustomText
                color={COLORS.gray_1}
                align="left"
                fontSize={12}
                top={3}
                fontFamily={fonts.PoppinsRegular}
              >
                {details?.delivery_address_id?.contact_phone}
              </CustomText>
            </Col>
          </Row>
        </Col>
        <View
          style={{
            paddingHorizontal: 24,
            width: '100%',
            backgroundColor: COLORS.white,
            marginBottom: 10,
          }}
        >
          <Row marginBottom={10}>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsMedium}
            >
              Recommended Products
            </CustomText>
          </Row>
          <FlatList
            data={filteredProducts}
            numColumns={3}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => setRefetch(true)}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />
        </View>
      </Col>
    );
  };

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
                Track Order
              </CustomText>
            </Row>
          </Row>
        </Col>
        <FlatList
          data={[1]}
          renderItem={renderPageContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 115,
          }}
        />
      </SafeAreaWrap>
    </>
  );
};

export default TrackOrder;

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
