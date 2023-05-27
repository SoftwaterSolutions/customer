import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
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
import BasketSvg from '../../../../assets/svgs/basket.svg';
import SortSvg from '../../../../assets/svgs/sort.svg';
import EmptyLikeSvg from '../../../../assets/svgs/emptyLike.svg';
import FilledLikeSvg from '../../../../assets/svgs/filledLike.svg';
import LeftArrow from '../../../../assets/svgs/leftArrow.svg';
import OptionsSvg from '../../../../assets/svgs/hamburger.svg';
import SmallCartSvg from '../../../../assets/svgs/smallCartBlack.svg';
import LikeOffSvg from '../../../../assets/svgs/productLikeOff.svg';
import LikeOnSvg from '../../../../assets/svgs/productLikeOn.svg';
import MinusSvg from '../../../../assets/svgs/minus_big.svg';
import PlusSvg from '../../../../assets/svgs/plus_big.svg';
import ShareSvg from '../../../../assets/svgs/productShare.svg';
import ChevronRightSvg from '../../../../assets/svgs/rightChevron.svg';
import ChevronDownSvg from '../../../../assets/svgs/downChevron.svg';
import BikeSvg from '../../../../assets/svgs/bike.svg';
import Button from '../../../../components/Button/Button';
import SortModal from '../../../components/SortModal';
import FilterModal from '../../../../components/Filter/FilterModal';
import TextInput from '../../../../components/Input/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NairaSign } from '../../../../constants/text';
import { ScrollView } from 'react-native-gesture-handler';
const sampleProductImage = require('../../../../assets/svgs/mango.png');
import HomeBlack from '../../../../assets/svgs/homeBlack.svg';
import CartBlack from '../../../../assets/svgs/cartBlack.svg';
import OrdersBlack from '../../../../assets/svgs/orderBlack.svg';
import AccountBlack from '../../../../assets/svgs/accountBlack.svg';
import {
  useAddToCartMutation,
  useAddToSavedItemsMutation,
  useDeleteSavedItemMutation,
  useGetCartMutation,
  useGetProductMutation,
  useGetProductsMutation,
  useGetSavedItemsMutation,
} from '../../../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import {
  capitalize,
  formatCurrency,
  truncateText,
} from '../../../../helpers/formatText';
import { saveToUserStore } from '../../../../redux/features/user/userSlice';
import { useMemo } from 'react';
import {
  extractObjectWithMarketId,
  extractPropsByInputArray,
  removeDuplicates,
  removeUndefinedOrNull,
} from '../../../../helpers/formatArray';
import Loader from '../../../../components/Loader/Loader';
import { Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LoadingModal from '../../../components/LoadingModal';
import DropdownInput from '../../../../components/Input/DropdownInput';
import { Pressable } from 'react-native';

const ProductDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { height, width } = useWindowDimensions();
  const initialDetail = route?.params;
  const { countries, country, area } = useSelector((state) => state.userAuth);
  const [openTabMenu, setOpenTabMenu] = useState(false);
  const [openUom, setOpenUom] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [refetchCart, setRefetchCart] = useState(false);
  const [selectedUom, setSelectedUom] = useState(null);
  const [uoms, setUoms] = useState([]);
  const [details, setDetails] = useState(initialDetail);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [quantity, setQuantity] = useState('1');

  useFocusEffect(
    useCallback(() => {
      setDetails(initialDetail?.priceByMarketId);
    }, [initialDetail, route, navigation])
  );

  const { products, cart, savedItems } = useSelector(
    (state) => state.userStore
  );

  const [getProduct, { isLoading }] = useGetProductMutation();

  const [getProducts, { isLoading: isLoadingProducts }] =
    useGetProductsMutation();

  const [addToCart, { isLoading: isLoadingAddToCart }] = useAddToCartMutation();

  const [getCart, { isLoading: isLoadingGetCart }] = useGetCartMutation();
  const [getSavedItems, { isLoading: isLoadingGetSavedItems }] =
    useGetSavedItemsMutation();

  const [addToSavedItems, { isLoading: isLoadingAddToSavedItems }] =
    useAddToSavedItemsMutation();
  const [deleteSavedItem, { isLoading: isLoadingDeleteSavedItems }] =
    useDeleteSavedItemMutation();

  const handleDeleteSavedItem = async ({ item_id, saved_item_id, name }) => {
    const res = await deleteSavedItem({ item_id, saved_item_id });
    if (res?.data?.status === 'success') {
      toast.show(`${name} has been removed from saved items`, {
        type: 'success',
        duration: 2000,
      });
      dispatch(
        saveToUserStore({
          key: 'savedItems',
          value: res?.data?.data,
        })
      );
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };
  const handleAddToSavedItems = async ({
    product_id,
    area_id,
    country_id,
    name,
  }) => {
    const res = await addToSavedItems({ product_id, area_id, country_id });
    if (res?.data?.status === 'success') {
      toast.show(`${name} has been added to saved items`, {
        type: 'success',
        duration: 2000,
      });
      console.log(res);
      dispatch(
        saveToUserStore({
          key: 'savedItems',
          value: res?.data?.data,
        })
      );
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  const fetchSavedItems = async () => {
    const res = await getSavedItems({
      area_id: area?.id,
      country_id: country?.id,
    });
    console.log({ getSavedItems: res?.data });
    if (res?.data?.status === 'success') {
      dispatch(
        saveToUserStore({ key: 'savedItems', value: res.data?.data || [] })
      );
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };
  const fetchCart = async () => {
    const res = await getCart({ area_id: area?.id, country_id: country?.id });
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'cart', value: res.data?.data || [] }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  const handleAddToCart = async ({
    product_id,
    area_id,
    country_id,
    quantity,
    name,
    priceByMarket,
    totalAmount,
  }) => {
    const res = await addToCart({
      product_id,
      area_id,
      country_id,
      quantity,
      priceByMarket,
      totalAmount,
    });
    if (res?.data?.status === 'success') {
      toast.show(`${name} has been added to cart`, {
        type: 'success',
        duration: 2000,
      });
      setRefetchCart(!refetchCart);
    } else {
      toast.show(res?.error?.data?.message || 'Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  const fetchProduct = async () => {
    const res = await getProduct(
      initialDetail?.product_id || initialDetail?.id
    );
    if (res?.data?.status === 'success') {
      setDetails(res.data?.data);
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchSavedItems();
  }, [dispatch, initialDetail, area, country]);

  useEffect(() => {
    fetchCart();
  }, [dispatch, refetchCart, country]);

  const ProductCard = ({ item, index, onPress, cartItems }) => (
    <Col
      borderRadius={10}
      height={120}
      // align="center"
      justifyContent="center"
      style={{
        margin: 2,
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
  );

  const TabMenu = () => {
    return (
      <Col
        width={'120px'}
        style={{
          position: 'absolute',
          top: 80,
          right: 20,
          zIndex: 100,
        }}
        borderRadius={10}
      >
        <PressableRow
          justify={'flex-start'}
          paddingTop={5}
          paddingLeft={10}
          paddingBottom={5}
          showBorder
          onPress={() => navigation.navigate('HomeStack')}
        >
          <HomeBlack marginRight={15} />
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={11}
            fontFamily={fonts.PoppinsRegular}
          >
            Home
          </CustomText>
        </PressableRow>

        <PressableRow
          justify={'flex-start'}
          paddingTop={5}
          paddingLeft={10}
          paddingBottom={5}
          showBorder
          onPress={() => navigation.navigate('Orders')}
        >
          <OrdersBlack marginRight={15} />
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={11}
            fontFamily={fonts.PoppinsRegular}
          >
            Orders
          </CustomText>
        </PressableRow>
        <PressableRow
          justify={'flex-start'}
          paddingTop={5}
          paddingLeft={10}
          paddingBottom={5}
          showBorder
          borderRadius={10}
          onPress={() => navigation.navigate('Account')}
        >
          <AccountBlack marginRight={15} />
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={11}
            fontFamily={fonts.PoppinsRegular}
          >
            Account
          </CustomText>
        </PressableRow>
      </Col>
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = products || [];
    if (filtered && filtered?.length > 0) {
      filtered = filtered?.filter(
        (prod) =>
          prod?.category_id?.name?.toLowerCase() ==
          details?.category_id?.name?.toLowerCase()
      );
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
      filtered = filtered?.slice(0, 6);
    }
    return filtered;
  }, [products, details]);

  const filteredProduct = useMemo(() => {
    let filtered = initialDetail || null;
    let extrPriceByMarket = [];
    for (
      let i = 0;
      i <
      removeDuplicates(filtered?.priceByMarketId?.map((x) => x?.uom_id?._id))
        .length;
      i++
    ) {
      const uom_id = removeDuplicates(
        filtered?.priceByMarketId?.map((x) => x?.uom_id?._id)
      )[i];
      const extr = extractObjectWithMarketId(
        filtered?.priceByMarketId,
        uom_id,
        area?.market?._id
      );
      extrPriceByMarket?.push(extr);
    }
    if (extrPriceByMarket?.length > 0) {
      setSelectedUom(extrPriceByMarket[0]?.uom_id?._id);
      setUoms(
        extrPriceByMarket?.map((x) => {
          return {
            label: x?.uom_id?.name,
            value: x?.uom_id?._id,
            id: x?.uom_id?._id,
          };
        })
      );
    }
    filtered.extrPriceByMarket = extrPriceByMarket;
    return filtered;
  }, [area, initialDetail]);

  const onQuantityChange = () => {
    setKeyboardShow(false);
    if (!quantity || quantity == '0') {
      setQuantity('1');
    } else if (parseInt(quantity) >= 1) {
      setQuantity(quantity);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardShow(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      onQuantityChange
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [quantity]);

  // if (isLoading || isLoadingProducts) {
  //   return <Loader style={{ height: height }} />;
  // }

  return (
    <>
      <LoadingModal visible={isLoading || isLoadingProducts} />
      <SafeAreaWrap
        style={{
          paddingTop: 20,
          paddingBottom: 80,
        }}
      >
        {openTabMenu && <TabMenu />}
        <Row paddingHorizontal={15} paddingBottom={16}>
          <Row justify={'flex-start'} align={'center'} width={'200px'}>
            <LeftArrow marginRight={15} onPress={() => navigation.goBack()} />
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={16}
              top={1}
              fontFamily={fonts.PoppinsMedium}
            >
              Product Details
            </CustomText>
          </Row>
          <Row justify={'flex-start'} align={'center'} width={'65px'}>
            <Col
              width={'28px'}
              style={{ height: 28 }}
              align={'center'}
              justify={'center'}
            >
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  position: 'absolute',
                  top: -3,
                  right: -8,
                  maxWidth: 30,
                  maxHeight: 20,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                }}
              >
                <CustomText
                  color={COLORS.black}
                  align="center"
                  top={0.5}
                  fontSize={10}
                  fontFamily={fonts.PoppinsMedium}
                >
                  {cart?.cart_items?.length?.toString() || '0'}
                </CustomText>
              </View>
              <SmallCartSvg onPress={() => navigation.navigate('Cart')} />
            </Col>
            <OptionsSvg
              marginLeft={15}
              onPress={() => setOpenTabMenu(!openTabMenu)}
            />
          </Row>
        </Row>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={'handled'}
        >
          <Col bgColor={COLORS.mainBg}>
            <Row
              style={{ height: 300 }}
              justify={'center'}
              bgColor={COLORS.mainBg}
            >
              <Image
                source={{ uri: filteredProduct?.imageCover }}
                style={{ width: '100%', height: 300 }}
                resizeMode="contain"
              />
            </Row>
            <Col padding={24} borderRadius={30}>
              <Col showBorder paddingBottom={10} marginBottom={10}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width - 48,
                  }}
                >
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontSize={18}
                    top={3}
                    fontFamily={fonts.PoppinsMedium}
                  >
                    {filteredProduct?.name}
                  </CustomText>

                  <Pressable
                    onPress={() =>
                      savedItems?.items &&
                      savedItems?.items?.find(
                        (x) => x?.id == filteredProduct?.id
                      )
                        ? handleDeleteSavedItem({
                            item_id: filteredProduct?.id,
                            saved_item_id: savedItems?.id,
                            name: filteredProduct?.name,
                          })
                        : handleAddToSavedItems({
                            name: filteredProduct?.name,
                            product_id: filteredProduct?.id,
                            area_id: area?.id,
                            country_id: country?._id,
                          })
                    }
                  >
                    {savedItems?.items &&
                    savedItems?.items?.find(
                      (x) => x?.id == filteredProduct?.id
                    ) ? (
                      <LikeOnSvg />
                    ) : (
                      <LikeOffSvg />
                    )}
                  </Pressable>
                </View>
                <Row marginTop={12}>
                  <Row
                    width={'150px'}
                    align="center"
                    style={{ alignContent: 'center' }}
                  >
                    <MinusSvg
                      marginRight={-2}
                      onPress={() => {
                        if (parseInt(quantity) > 1) {
                          setQuantity((parseInt(quantity) - 1).toString());
                        }
                      }}
                    />
                    <TextInput
                      height={'30px'}
                      width={'35px'}
                      handleChange={(val) => setQuantity(val)}
                      value={quantity}
                      fontSize={'13px'}
                      paddingHorizontal={'0px'}
                      textAlign={'center'}
                    />
                    <PlusSvg
                      onPress={() => {
                        setQuantity((parseInt(quantity) + 1).toString());
                      }}
                    />
                    <CustomText
                      color={COLORS.black}
                      align="left"
                      fontSize={12}
                      left={4}
                      fontFamily={fonts.PoppinsLight}
                    >
                      {`(${
                        filteredProduct?.extrPriceByMarket?.find(
                          (x) => x?.uom_id?._id === selectedUom
                        )?.uom_id?.name
                      })`}
                    </CustomText>
                  </Row>
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontSize={18}
                    top={3}
                    fontFamily={fonts.PoppinsMedium}
                  >
                    {formatCurrency(
                      filteredProduct?.extrPriceByMarket?.find(
                        (x) => x?.uom_id?._id === selectedUom
                      )?.price * quantity,
                      2,
                      country?.name?.toLowerCase()?.includes('nigeria')
                        ? '₦'
                        : country?.currency?.symbol
                    )}
                  </CustomText>
                </Row>
              </Col>
              <Col showBorder paddingBottom={5} marginBottom={10}>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={15}
                  fontFamily={fonts.PoppinsRegular}
                >
                  Units of Measure
                </CustomText>
                <DropdownInput
                  placeholder="State/Province"
                  options={uoms}
                  setOptions={setUoms}
                  setValue={setSelectedUom}
                  value={selectedUom}
                  onSelectItem={(e) => setSelectedUom(e.value)}
                  zIndex={5}
                  loading={true}
                  label=""
                  dropDownDirection="TOP"
                  listMode="SCROLLVIEW"
                  maxHeight={450}
                  style={{ backgroundColor: COLORS.white }}
                />
              </Col>
              <Col showBorder paddingBottom={10} marginBottom={10}>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={15}
                  fontFamily={fonts.PoppinsRegular}
                >
                  Description
                </CustomText>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={11}
                  top={3}
                  fontFamily={fonts.PoppinsLight}
                >
                  {viewMore
                    ? filteredProduct?.description
                    : truncateText(filteredProduct?.description, 100)}
                  {filteredProduct?.description?.length > 100 && (
                    <CustomText
                      color={COLORS.primary}
                      align="left"
                      fontSize={11}
                      top={1}
                      fontFamily={fonts.PoppinsLight}
                      onPress={() => setViewMore(!viewMore)}
                    >
                      {viewMore ? '   less' : '   more'}
                    </CustomText>
                  )}
                </CustomText>
              </Col>
              {/* <Row showBorder paddingBottom={10}>
                <BikeSvg marginRight={8} />
                <Col>
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontSize={12}
                    top={3}
                    fontFamily={fonts.PoppinsMedium}
                  >
                    Delivery
                  </CustomText>
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontSize={10}
                    fontFamily={fonts.PoppinsRegular}
                  >
                    <CustomText
                      color={COLORS.gray_1}
                      align="left"
                      fontSize={11}
                      fontFamily={fonts.PoppinsLight}
                    >
                      24/7 Everyday
                    </CustomText>
                  </CustomText>
                </Col>
              </Row> */}
              <Col
                showBorder
                paddingTop={10}
                paddingBottom={10}
                justify={'flex-start'}
              >
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={15}
                  bottom={10}
                  fontFamily={fonts.PoppinsRegular}
                >
                  Related Products
                </CustomText>
                <Row align={'flex-start'}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    contentContainerStyle={{
                      alignItems: 'flex-start',
                      height: 150,
                    }}
                  >
                    {filteredProducts?.map((item) => (
                      <ProductCard item={item} />
                    ))}
                  </ScrollView>
                </Row>
              </Col>
            </Col>
          </Col>
        </KeyboardAwareScrollView>
      </SafeAreaWrap>
      {!keyboardShow ? (
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
          <Button
            text={'Add to Cart'}
            onPress={() =>
              handleAddToCart({
                product_id: filteredProduct?.id,
                area_id: area?.id,
                country_id: filteredProduct?.country_id?.id,
                quantity: parseInt(quantity),
                name: filteredProduct?.name,
                priceByMarket: filteredProduct?.extrPriceByMarket?.find(
                  (x) => x?.uom_id?._id == selectedUom
                ),
                totalAmount:
                  filteredProduct?.extrPriceByMarket?.find(
                    (x) => x?.uom_id?._id === selectedUom
                  )?.price * quantity,
              })
            }
            loading={isLoadingAddToCart}
          />
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({});
