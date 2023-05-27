import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import SearchSvg from '../../../../assets/svgs/searchYellow.svg';
import EmptyCartSvg from '../../../../assets/svgs/emptyCart.svg';
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
import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
  useDeleteCartItemMutation,
  useGetAreaMutation,
  useGetCartMutation,
  useGetMarketMutation,
  useGetPaymentMethodsMutation,
  useValidateCheckoutMutation,
} from '../../../../redux/features/user/userApi';
import { saveToUserStore } from '../../../../redux/features/user/userSlice';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from '../../../../helpers/formatText';
import {
  saveArea,
  saveCountry,
} from '../../../../redux/features/auth/authSlice';
import {
  isSubstringInArray,
  removeUndefinedOrNull,
} from '../../../../helpers/formatArray';
import Loader from '../../../../components/Loader/Loader';
import LoadingModal from '../../../components/LoadingModal';
import { PAYSTACK_API_KEY } from '@env';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { VAT } from '@env';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';

const Checkout = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { country, area, user } = useSelector((state) => state.userAuth);
  const {
    cart,
    market,
    paymentMethods,
    minimumOrderValue = 100000,
    currentDeliveryAddress,
    currentPaymentMethod,
    currentPaymentRef,
  } = useSelector((state) => state.userStore);
  const [successVisible, setSuccessVisible] = useState(false);
  const [deliveryAddressVisible, setDeliveryAddressVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [paymentMethodVisible, setPaymentMethodVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(removeUndefinedOrNull);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [subtotal, setSubtotal] = useState(false);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [vat, setVat] = useState(0);
  const [mov, setMov] = useState(0);
  const [countryTax, setCountryTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [paymentReference, setPaymentReference] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  const [getCart, { isLoading: isLoadingGetCart }] = useGetCartMutation();
  const [getArea, { isLoading: isLoadingGetArea }] = useGetAreaMutation();
  const [getPaymentMethods, { isLoading: isLoadingGetPaymentMethods }] =
    useGetPaymentMethodsMutation();
  const [validateCheckout, { isLoading: isLoadingValidateCheckout }] =
    useValidateCheckoutMutation();
  const [createOrder, { isLoading: isLoadingCreateOrder }] =
    useCreateOrderMutation();

  const [createPaymentIntent, { isLoading: isLoadingPaymentIntent }] =
    useCreatePaymentIntentMutation();

  const paystackWebViewRef = useRef(paystackProps.PayStackRef);
  useEffect(() => {
    dispatch(saveToUserStore({ key: 'currentDeliveryAddress', value: null }));
    dispatch(saveToUserStore({ key: 'currentPaymentMethod', value: null }));
    dispatch(saveToUserStore({ key: 'currentPaymentRef', value: null }));
  }, []);

  useEffect(() => {
    if (country?.name?.toLowerCase() !== 'nigeria') {
      dispatch(saveArea(null));
    }
  }, []);
  useEffect(() => {
    setDeliveryAddress(currentDeliveryAddress || '');
  }, [currentDeliveryAddress]);

  const fetchCart = async () => {
    const res = await getCart({ area_id: area?.id, country_id: country?.id });
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'cart', value: res.data?.data }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
      navigation.goBack();
    }
  };

  const fetchArea = async () => {
    const res = await getArea(area?.id);
    if (res?.data?.status === 'success') {
      dispatch(saveArea(res.data?.data));
      dispatch(
        saveToUserStore({
          key: 'market',
          value: res.data?.data?.market,
        })
      );
      dispatch(saveCountry(res.data?.data?.country));
      console.log({
        key: 'country',
        value: res.data?.data?.country,
      });
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
      navigation.goBack();
    }
  };

  const clearMarket = async () => {
    await dispatch(
      saveToUserStore({
        key: 'market',
        value: null,
      })
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
      area?.id ? fetchArea() : clearMarket();
    }, [dispatch, refetch, area?.id])
  );

  const payMethod = useMemo(() => {
    let filtered = null;
    if (currentPaymentMethod) {
      filtered = {
        ...currentPaymentMethod,
        name: currentPaymentMethod?.name,
        svg: isSubstringInArray(currentPaymentMethod?.name, [
          'paystack',
          'stripe',
        ]) ? (
          <DebitCardSvg />
        ) : isSubstringInArray(currentPaymentMethod?.name, ['voucher']) ? (
          <VoucherSvg />
        ) : (
          <CreditCardSvg />
        ),
      };
    }

    return filtered;
  }, [currentPaymentMethod]);

  const filteredData = useMemo(() => {
    let filtered = cart?.cart_items || [];
    filtered = filtered?.map((x) => {
      return {
        name: x?.product_id?.name,
        quantity: x?.quantity,
        price: x?.priceByMarket_id?.price,
        uom: x?.priceByMarket_id?.uom_id?.name,
        image: x?.product_id?.imageCover,
        kg: x?.priceByMarket_id?.kg,
        market: x?.priceByMarket_id?.market_id,
        total_kg: x?.priceByMarket_id?.kg * x?.quantity,
        id: x?.product_id?.id,
        cart_item_id: x?.id,
        cart_id: cart?.id,
      };
    });
    const subT = filtered?.reduce((acc, curr) => {
      return acc + curr?.quantity * curr?.price;
    }, 0);
    let serviceC;
    let deliveryF;
    setSubtotal(subT);
    if (country?.name?.toLowerCase() == 'nigeria') {
      deliveryF = market?.delivery_fee;
      serviceC = market?.service_charge;
      setDeliveryFee(market?.delivery_fee);
      setServiceCharge(market?.service_charge);
      setMov(market?.minimum_order_value);
    } else {
      const total_delivery_fee = filtered?.reduce((acc, item) => {
        const product_delivery_fee =
          country?.delivery_fee_by_kg * item.total_kg;
        console.log(country?.delivery_fee_by_kg, item.total_kg);
        return acc + product_delivery_fee;
      }, 0);
      const mrkt = filtered[0]?.market;
      dispatch(
        saveToUserStore({
          key: 'market',
          value: mrkt,
        })
      );
      deliveryF = total_delivery_fee;
      serviceC = mrkt?.service_charge;
      setDeliveryFee(total_delivery_fee);
      setServiceCharge(mrkt?.service_charge);
      setMov(mrkt?.minimum_order_value);
      console.log({ mrkt });
    }
    setVat(country?.vat * 0.01 * subtotal);
    setCountryTax(country?.country_tax * 0.01 * subtotal);
    return filtered;
  }, [cart, market, area, country]);

  const handlePayment = async () => {
    const validated = await handleValidation();
    if (validated) {
      console.log('====================================');
      console.log(currentPaymentMethod?.name);
      console.log('====================================');
      if (isSubstringInArray(currentPaymentMethod?.name, ['paystack'])) {
        if (currentPaymentRef) {
          handleCheckout({ reference: currentPaymentRef });
        } else paystackWebViewRef.current.startTransaction();
      } else if (isSubstringInArray(currentPaymentMethod?.name, ['stripe'])) {
        setStripeLoading(true);
        const response = await createPaymentIntent({
          amount: Math.floor(
            parseFloat(
              deliveryFee + subtotal + serviceCharge + vat + countryTax
            ).toFixed(2) * 100
          ),
          currency: country?.currency?.code,
        });
        console.log({ response });
        if (response.error) {
          toast.show(response?.error?.data?.message || 'Something went wrong', {
            type: 'error',
          });
          setStripeLoading(false);
          return;
        }
        const { error: paymentSheetError } = await initPaymentSheet({
          merchantDisplayName: 'Fooddy NG.',
          paymentIntentClientSecret: response.data.data,
          defaultBillingDetails: {
            name: 'Jane Doe',
          },
        });
        if (paymentSheetError) {
          toast.show(paymentSheetError.message || 'Something went wrong', {
            type: 'error',
          });
          setStripeLoading(false);
          return;
        }
        // const { error: paymentError } = await presentPaymentSheet();
        const ress = await presentPaymentSheet();
        console.log({ ress });
        if (ress?.error) {
          // toast.show(
          //   `Error code: ${ress?.error.code}\n${ress.error.message}` ||
          //     'Something went wrong',
          //   {
          //     type: 'error',
          //   }
          // );
          toast.show(`${ress.error.message}` || 'Something went wrong', {
            type: 'error',
          });
          setStripeLoading(false);
          return;
        }
        await handleStripePayment(response.data.data);
        console.log('stripe');
      } else if (isSubstringInArray(currentPaymentMethod?.name, ['cash'])) {
        handleCheckout({ reference: null });
      }
    }
  };

  const handleStripePayment = async (ref) => {
    setPaymentReference(ref);
    dispatch(
      saveToUserStore({
        key: 'currentPaymentRef',
        value: ref,
      })
    );
    await handleCheckout({ reference: ref });
  };
  const handlePaystackPayment = async (res) => {
    console.log(res?.transactionRef?.reference);
    setPaymentReference(res?.transactionRef?.reference);
    dispatch(
      saveToUserStore({
        key: 'currentPaymentRef',
        value: res?.transactionRef?.reference,
      })
    );
    await handleCheckout({ reference: res?.transactionRef?.reference });
  };

  const handleValidation = async () => {
    const res = await validateCheckout({
      payment_method_id: currentPaymentMethod?._id,
      cart_id: cart?._id,
      delivery_address_id: deliveryAddress?._id,
      area_id: area?._id,
      market_id: market?._id,
      country_id: country?._id,
      calculated_amount:
        deliveryFee + subtotal + serviceCharge + vat + countryTax,
    });
    if (res?.data?.status === 'success') {
      return true;
    } else {
      toast.show(res?.error?.data?.message, {
        type: 'error',
      });
      return false;
    }
  };
  const handleCheckout = async ({ reference = null }) => {
    const res = await createOrder({
      payment_method_id: currentPaymentMethod?._id,
      cart_id: cart?._id,
      delivery_address_id: deliveryAddress?._id,
      area_id: area?._id,
      market_id: market?._id,
      country_id: country?._id,
      payment_status: reference ? 'paid' : 'unpaid',
      payment_reference: reference,
      calculated_amount:
        deliveryFee + subtotal + serviceCharge + vat + countryTax,
    });
    setStripeLoading(false);
    if (res?.data?.status === 'success') {
      toast.show(res?.data?.message, {
        type: 'success',
      });
      navigation.navigate('Home');
    } else {
      toast.show(res?.error?.data?.message, {
        type: 'error',
      });
    }
  };

  const renderPageContent = ({ item, index }) => {
    return (
      <Col marginTop={5} bgColor={COLORS.mainBg}>
        <Col
          paddingLeft={24}
          paddingRight={24}
          marginTop={3}
          marginBottom={3}
          paddingVertical={10}
        >
          <Row
            justify={!currentDeliveryAddress ? 'flex-start' : 'space-between'}
            marginBottom={10}
          >
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsMedium}
            >
              DELIVERY ADDRESS
            </CustomText>
            {currentDeliveryAddress && (
              <CustomText
                color={COLORS.primary}
                align="left"
                fontSize={13}
                fontFamily={fonts.PoppinsRegular}
                onPress={() => setDeliveryAddressVisible(true)}
              >
                CHANGE
              </CustomText>
            )}
          </Row>
          {!currentDeliveryAddress ? (
            <PressableRow
              justify={'center'}
              // bgColor={'red'}
              paddingTop={15}
              paddingBottom={15}
              marginBottom={10}
              borderRadius={5}
              style={{
                borderColor: COLORS.primary,
                borderBottomColor: COLORS.primary,
                borderWidth: 1,
              }}
              showBorder
              onPress={() => setDeliveryAddressVisible(true)}
            >
              <CustomText
                color={COLORS.black}
                align="left"
                fontSize={13}
                fontFamily={fonts.PoppinsRegular}
              >
                Add delivery address
              </CustomText>
            </PressableRow>
          ) : (
            <Row paddingBottom={10} key={item?.uid} justify="flex-start">
              <Col width={'80%'}>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={14}
                  fontFamily={fonts.PoppinsMedium}
                >
                  {currentDeliveryAddress?.title}
                </CustomText>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={12}
                  top={3}
                  fontFamily={fonts.PoppinsRegular}
                >
                  {currentDeliveryAddress?.name}
                </CustomText>
                <CustomText
                  color={COLORS.gray_1}
                  align="left"
                  fontSize={12}
                  top={3}
                  fontFamily={fonts.PoppinsRegular}
                >
                  {currentDeliveryAddress?.address}
                </CustomText>
                <CustomText
                  color={COLORS.gray_1}
                  align="left"
                  fontSize={12}
                  top={3}
                  fontFamily={fonts.PoppinsRegular}
                >
                  {currentDeliveryAddress?.phoneNumber}
                </CustomText>
              </Col>
            </Row>
          )}
        </Col>
        <Col
          paddingLeft={24}
          paddingRight={24}
          marginBottom={3}
          paddingVertical={10}
        >
          <Row
            justify={!payMethod ? 'flex-start' : 'space-between'}
            marginBottom={10}
          >
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={13}
              fontFamily={fonts.PoppinsMedium}
            >
              PAYMENT METHOD
            </CustomText>
            {!!payMethod && (
              <CustomText
                color={COLORS.primary}
                align="left"
                fontSize={13}
                fontFamily={fonts.PoppinsRegular}
                onPress={() => setPaymentMethodVisible(true)}
              >
                CHANGE
              </CustomText>
            )}
          </Row>
          {!payMethod && (
            <PressableRow
              justify={'center'}
              paddingTop={15}
              paddingBottom={15}
              borderRadius={5}
              marginBottom={15}
              style={{
                borderColor: COLORS.primary,
                borderBottomColor: COLORS.primary,
                borderWidth: 1,
              }}
              showBorder
              onPress={() => setPaymentMethodVisible(true)}
            >
              <CustomText
                color={COLORS.black}
                align="left"
                fontSize={13}
                fontFamily={fonts.PoppinsRegular}
              >
                Choose a payment method
              </CustomText>
            </PressableRow>
          )}
          {payMethod && (
            <Row
              justify={'flex-start'}
              align={'center'}
              marginTop={5}
              marginBottom={10}
            >
              {payMethod?.svg}
              <CustomText
                color={COLORS.black}
                align="left"
                fontSize={13}
                top={1}
                left={10}
                fontFamily={fonts.PoppinsMedium}
              >
                {payMethod?.name}
              </CustomText>
            </Row>
          )}
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
        </View>
        <Col paddingLeft={24} paddingRight={24} paddingVertical={10}>
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
                subtotal,
                2,
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
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
              Delivery
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                deliveryFee,
                2,
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
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
              Service
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                serviceCharge,
                2,
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
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
              {`VAT (${country?.vat}%)`}
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                vat,
                2,
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
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
              {`Tax (${country?.country_tax}%)`}
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="right"
              fontSize={16}
              fontFamily={fonts.PoppinsMedium}
            >
              {formatCurrency(
                countryTax,
                2,
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
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
                deliveryFee + subtotal + serviceCharge + vat + countryTax,
                2,
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
              )}
            </CustomText>
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
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
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
              country?.name?.toLowerCase()?.includes('nigeria')
                ? '₦'
                : country?.currency?.symbol
            )}
          </CustomText>
        </View>
      </Row>
    </Col>
  );

  const renderProduct = ({ item, index }) => {
    return <ProductCard item={item} index={index} />;
  };

  // if (
  //   isLoadingGetArea ||
  //   isLoadingGetCart ||
  //   isLoadingGetPaymentMethods ||
  //   isLoadingValidateCheckout
  // ) {
  //   return (
  //     <Loader
  //       style={{
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100%',
  //       }}
  //     />
  //   );
  // }

  return (
    <>
      <LoadingModal
        visible={
          isLoadingGetArea ||
          isLoadingGetCart ||
          isLoadingGetPaymentMethods ||
          isLoadingValidateCheckout ||
          isLoadingCreateOrder ||
          stripeLoading
        }
        text={null}
      />
      <SafeAreaWrap
        style={{
          paddingTop: 20,
        }}
        bgColor={COLORS.mainBg}
      >
        <Col paddingHorizontal={15} paddingBottom={10}>
          <Row justify={'flex-start'} align={'center'} width={'200px'}>
            <LeftArrow marginRight={15} onPress={() => navigation.goBack()} />
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={16}
              top={1}
              fontFamily={fonts.PoppinsMedium}
            >
              Checkout
            </CustomText>
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

      <Col
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
        <Row>
          <View style={{ alignItems: 'flex-start', marginRight: 10 }}>
            <CustomText
              color={COLORS.gray_1}
              align="center"
              fontSize={13}
              fontFamily={fonts.PoppinsRegular}
            >
              TOTAL AMOUNT DUE
            </CustomText>
            <CustomText
              color={COLORS.green}
              align="center"
              fontSize={24}
              fontFamily={fonts.PoppinsSemiBold}
            >
              {formatCurrency(
                deliveryFee + subtotal + serviceCharge + vat + countryTax,
                2,
                country?.name?.toLowerCase()?.includes('nigeria')
                  ? '₦'
                  : country?.currency?.symbol
              )}
            </CustomText>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Button
              text={'Confirm'}
              onPress={handlePayment}
              disabled={
                subtotal < mov ||
                !currentDeliveryAddress ||
                !currentPaymentMethod
              }
            />
          </View>
        </Row>
      </Col>
      {console.log(
        parseFloat(deliveryFee + subtotal + serviceCharge + vat + countryTax)
      )}
      <View>
        <Paystack
          paystackKey={PAYSTACK_API_KEY}
          billingEmail={user?.email}
          amount={parseFloat(
            deliveryFee + subtotal + serviceCharge + vat + countryTax
          ).toFixed(2)}
          billingMobile={user?.phone}
          billingName={user?.firstName}
          activityIndicatorColor={COLORS.primary}
          // refNumber={currentPaymentRef}
          onCancel={(e) => {
            console.log('paystackwebviewFailed', e);
          }}
          onSuccess={(res) => {
            handlePaystackPayment(res);
          }}
          ref={paystackWebViewRef}
          currency={'NGN'}
          // currency={country?.name?.toLowerCase() == 'nigeria' ? 'NGN' : 'USD'}
        />
      </View>
      <DeliveryAddressModal
        visible={deliveryAddressVisible}
        setVisible={setDeliveryAddressVisible}
        selectedAddress={deliveryAddress}
        setSelectedAddress={setDeliveryAddress}
      />
      <PaymentMethodModal
        visible={paymentMethodVisible}
        setVisible={setPaymentMethodVisible}
        selectedMethod={paymentMethod}
        setSelectedMethod={setPaymentMethod}
      />
      <SuccessModal
        visible={successVisible}
        setVisible={setSuccessVisible}
        text={
          'Your Order No. 12345 was placed successfully. Check order details to share and tracking this order'
        }
      />
    </>
  );
};

export default Checkout;

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
