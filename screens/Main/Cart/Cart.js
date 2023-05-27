import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SafeAreaWrap from '../../../components/SafeAreaWrap/SafeAreaWrap';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';
import LoadingScreen from '../../../components/LoadingScreen';
import fonts from '../../../constants/fonts';
import CustomText from '../../../components/CustomText/CustomText';
import { COLORS } from '../../../constants/colors';
import {
  Col,
  PressableCol,
  PressableRow,
  Row,
} from '../../../components/CustomGrid/CustomGrid';
import { useDispatch, useSelector } from 'react-redux';
import LeftArrow from '../../../assets/svgs/leftArrow.svg';
import SearchSvg from '../../../assets/svgs/searchYellow.svg';
import EmptyCartSvg from '../../../assets/svgs/emptyCart.svg';
import Button from '../../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SearchInput from '../../../components/Input/SearchInput';
import { NairaSign } from '../../../constants/text';
const sampleProductImage = require('../../../assets/svgs/mango.png');
import MinusSvg from '../../../assets/svgs/minus.svg';
import PlusSvg from '../../../assets/svgs/plus.svg';
import DeleteSvg from '../../../assets/svgs/delete.svg';
import DeleteCartModal from '../../components/DeleteCartModal';
import {
  useDeleteCartItemMutation,
  useGetCartMutation,
  useUpdateCartItemQuantityMutation,
} from '../../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { saveToUserStore } from '../../../redux/features/user/userSlice';
import { formatCurrency } from '../../../helpers/formatText';
import Loader from '../../../components/Loader/Loader';
import {
  removeObjectFromArray,
  updateObjects,
} from '../../../helpers/formatArray';
import { Keyboard } from 'react-native';

const Cart = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { height, width } = useWindowDimensions();
  const { countries, country, area } = useSelector((state) => state.userAuth);
  const { cart, market } = useSelector((state) => state.userStore);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [cartEmpty, setCartEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateQty, setUpdateQty] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [mov, setMov] = useState(0);

  const [getCart, { isLoading: isLoadingGetCart }] = useGetCartMutation();
  const [deleteCartItem, { isLoading: isLoadingDeleteCartItem }] =
    useDeleteCartItemMutation();
  const [
    updateCartItemQuantity,
    { isLoading: isLoadingUpdateCartItemQuantity },
  ] = useUpdateCartItemQuantityMutation();

  const fetchCart = async () => {
    const res = await getCart({ area_id: area?.id, country_id: country?.id });
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'cart', value: res?.data?.data || [] }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
      navigation.goBack();
    }
  };

  const handleDeleteCartItem = async ({
    id: cart_item_id,
    cart_id: cart_id,
  }) => {
    let remaining = removeObjectFromArray(
      [...cart?.cart_items],
      'id',
      cart_item_id
    );
    // dispatch(
    //   saveToUserStore({
    //     key: 'cart',
    //     value: {
    //       ...cart,
    //       cart_items: remaining,
    //     },
    //   })
    // );
    const res = await deleteCartItem({ cart_item_id, cart_id });
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'cart', value: res.data?.data }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };
  const handleUpdateCartItemQuantity = async ({
    id: cart_item_id,
    cart_id: cart_id,
    quantity,
  }) => {
    dispatch(
      saveToUserStore({
        key: 'cart',
        value: {
          ...cart,
          cart_items: updateObjects(
            cart?.cart_items,
            (e) => e?.id == cart_item_id,
            'quantity',
            quantity
          ),
        },
      })
    );
    setUpdateQty(!updateQty);

    const res = await updateCartItemQuantity({
      cart_item_id,
      cart_id,
      quantity,
    });
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'cart', value: res.data?.data }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
      if (area?._id) {
        dispatch(
          saveToUserStore({
            key: 'market',
            value: area?.market,
          })
        );
        setMov(area?.market?.minimum_order_value);
      }
    }, [dispatch, refetch, area, country])
  );

  const renderProduct = ({ item, index }) => {
    return <ProductCard item={item} index={index} />;
  };

  const ProductCard = ({ item, index, onPress, cartItems }) => {
    const [quantity, setQuantity] = useState(item?.quantity?.toString() || '');

    const onQuantityChange = () => {
      if (!quantity) {
        setQuantity('1');
        handleUpdateCartItemQuantity({
          ...item,
          quantity: 1,
        });
      } else if (parseInt(quantity) >= 1) {
        handleUpdateCartItemQuantity({
          ...item,
          quantity: parseInt(quantity),
        });
      }
    };

    useEffect(() => {
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        onQuantityChange
      );

      return () => {
        keyboardDidHideListener.remove();
      };
    }, [quantity]);

    return (
      <Col
        borderRadius={4}
        marginBottom={8}
        padding={15}
        style={{ height: 125 }}
      >
        <PressableRow
          // onPress={() => {
          //   navigation.navigate('ProductDetails', item);
          // }}
          justify={'flex-start'}
          showBorder
          paddingBottom={10}
        >
          <Image
            source={{ uri: item?.image }}
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
                Unit of Measure:
              </CustomText>
              <CustomText
                color={COLORS.black}
                align="center"
                fontSize={12}
                fontFamily={fonts.PoppinsLight}
              >
                {item?.uom}
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
                {formatCurrency(
                  item?.price,
                  2,
                  country?.name?.toLowerCase()?.includes('nigeria')
                    ? '₦'
                    : country?.currency?.symbol
                )}
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
        </PressableRow>
        <Row paddingTop={5}>
          <Row width={'50%'} justify={'flex-start'}>
            <DeleteSvg
              onPress={() => {
                setSelectedItem(item);
                setDeleteVisible(true);
              }}
            />
          </Row>
          <Row width={'50%'} justify={'flex-end'}>
            <MinusSvg
              onPress={() =>
                item?.quantity > 1 &&
                handleUpdateCartItemQuantity({
                  ...item,
                  quantity: item?.quantity - 1,
                })
              }
            />
            <TextInput
              keyboardType="numeric"
              style={styles.counterInput}
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
            />
            <PlusSvg
              onPress={() =>
                handleUpdateCartItemQuantity({
                  ...item,
                  quantity: item?.quantity + 1,
                })
              }
            />
          </Row>
        </Row>
      </Col>
    );
  };

  const EmptyCart = () => {
    return (
      <Col
        style={{ flexGrow: 1 }}
        align={'center'}
        justify={'center'}
        marginBottom={90}
        height={height - 100}
      >
        <EmptyCartSvg width={120} height={160} />
        <Row width={'240px'} justify="center">
          <CustomText
            color={COLORS.primary}
            align="center"
            fontSize={14}
            fontFamily={fonts.PoppinsMedium}
          >
            Seems your cart is empty
          </CustomText>
        </Row>
        <Row width={'240px'} justify="center">
          <CustomText
            color={COLORS.gray_3}
            align="center"
            top={3}
            fontSize={12}
            fontFamily={fonts.PoppinsMedium}
          >
            Your added items will show here once you start shopping
          </CustomText>
        </Row>
        <Col
          style={{
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: 24,
          }}
        >
          <Button
            text={'Start Shopping'}
            onPress={() =>
              navigation.navigate('Home', { screen: 'Categories' })
            }
          />
        </Col>
      </Col>
    );
  };

  const filteredData = useMemo(() => {
    let filtered = cart?.cart_items || [];
    filtered = filtered?.map((x) => {
      return {
        ...x,
        name: x?.product_id?.name,
        quantity: x?.quantity,
        price: x?.priceByMarket_id?.price,
        uom: x?.priceByMarket_id?.uom_id?.name,
        image: x?.product_id?.imageCover,
        product_id: x?.product_id?.id,
        id: x?.id,
        cart_id: cart?.id,
      };
    });
    setSubtotal(
      filtered?.reduce((acc, curr) => {
        return acc + curr?.quantity * curr?.price;
      }, 0)
    );
    if (!area?.id) {
      const mrkt = filtered[0]?.priceByMarket_id?.market_id;
      dispatch(
        saveToUserStore({
          key: 'market',
          value: mrkt,
        })
      );
      setMov(mrkt?.minimum_order_value);
    }

    if (searchValue !== '' && searchValue?.length > 0) {
      filtered = filtered?.filter((x) =>
        x?.name?.toLowerCase().includes(searchValue?.toLowerCase())
      );
    }
    setCartEmpty(
      filtered?.length <= 0 && searchValue == '' && searchValue?.length <= 0
    );
    return filtered;
  }, [cart, updateQty, searchValue]);

  console.log(mov);

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
        }}
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
                Cart
              </CustomText>
            </Row>

            <SearchSvg
              marginRight={10}
              onPress={() => {
                setSearchValue('');
                setOpenSearch(!openSearch);
              }}
            />
          </Row>
          {openSearch && (
            <Row marginTop={10}>
              <SearchInput
                placeholder="Search"
                handleChange={(val) => setSearchValue(val)}
                value={searchValue}
                filtered={false}
              />
            </Row>
          )}
        </Col>

        {isLoadingGetCart || isLoadingDeleteCartItem ? (
          <Loader style={{ flex: 1 }} />
        ) : (
          <>
            <FlatList
              data={filteredData}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing || isLoadingGetCart}
              onRefresh={() => setRefetch(!refetch)}
              contentContainerStyle={{
                marginHorizontal: 15,
                paddingBottom: subtotal < mov ? 170 : 110,
                flexGrow: 1,
              }}
              ListEmptyComponent={<EmptyCart />}
            />
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
              {subtotal < mov && filteredData?.length > 0 && (
                <Row marginBottom={10}>
                  <CustomText
                    color={COLORS.primary}
                    align="center"
                    fontSize={12}
                    fontFamily={fonts.PoppinsRegular}
                  >
                    Total amount is lower than minimum order value for your
                    delivery country, add more items or increase item quantity
                    in your cart
                  </CustomText>
                </Row>
              )}
              {!!filteredData && filteredData?.length > 0 && (
                <Row marginBottom={10}>
                  <CustomText
                    color={COLORS.gray_1}
                    fontSize={12}
                    fontFamily={fonts.PoppinsLight}
                    align="left"
                  >
                    Minimum Order Value
                  </CustomText>
                  <CustomText
                    color={COLORS.primary}
                    align="right"
                    fontSize={12}
                    fontFamily={fonts.PoppinsLight}
                  >
                    {formatCurrency(mov, 2, country?.currency?.symbol)}
                  </CustomText>
                </Row>
              )}

              {!!filteredData && filteredData?.length > 0 && (
                <Row
                  style={{
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <View style={{ alignItems: 'flex-start', marginRight: 10 }}>
                    <CustomText
                      color={COLORS.black}
                      align="center"
                      fontSize={13}
                      fontFamily={fonts.PoppinsRegular}
                    >
                      Subtotal
                    </CustomText>
                    <CustomText
                      color={COLORS.black}
                      align="center"
                      fontSize={20}
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
                    <CustomText
                      color={COLORS.gray_1}
                      align="center"
                      fontSize={12}
                      fontFamily={fonts.PoppinsLight}
                    >
                      Delivery fees not included
                    </CustomText>
                  </View>
                  <View style={{ flexGrow: 1 }}>
                    <Button
                      text={'Checkout'}
                      onPress={() => navigation.navigate('Checkout')}
                      disabled={
                        !filteredData ||
                        filteredData.length == 0 ||
                        subtotal < mov
                      }
                    />
                  </View>
                </Row>
              )}
            </Col>
          </>
        )}
      </SafeAreaWrap>
      <DeleteCartModal
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        item={selectedItem}
        onConfirm={() => handleDeleteCartItem(selectedItem)}
      />
    </>
  );
};

export default Cart;

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
