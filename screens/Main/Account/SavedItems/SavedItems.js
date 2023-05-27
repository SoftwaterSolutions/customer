import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
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
import EmptySvg from '../../../../assets/svgs/emptySavedItems.svg';
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
import { saveToUserStore } from '../../../../redux/features/user/userSlice';
import { removeUndefinedOrNull } from '../../../../helpers/formatArray';
import { useFocusEffect } from '@react-navigation/native';
import {
  useAddToCartMutation,
  useDeleteSavedItemMutation,
  useGetCartMutation,
  useGetSavedItemsMutation,
} from '../../../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import { formatCurrency } from '../../../../helpers/formatText';
import DeleteCartModal from '../../../components/DeleteCartModal';
import AddToCartModal from '../../../components/AddToCartModal';

const SavedItems = ({ navigation }) => {
  const dispatch = useDispatch();
  const { countries, country, area } = useSelector((state) => state.userAuth);
  const { savedItems, cart } = useSelector((state) => state.userStore);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [refetchCart, setRefetchCart] = useState(false);
  const toast = useToast();
  const [getSavedItems, { isLoading: isLoadingGetSavedItems }] =
    useGetSavedItemsMutation();
  const [getCart, { isLoading: isLoadingCart }] = useGetCartMutation();
  const [addToCart, { isLoading: isLoadingAddToCart }] = useAddToCartMutation();
  const [deleteSavedItem, { isLoading: isLoadingDeleteSavedItem }] =
    useDeleteSavedItemMutation();
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const handleDeleteSavedItem = async ({ id }) => {
    const res = await deleteSavedItem(id);
    console.log({ res: res?.error?.data });
    if (res?.data?.status === 'success') {
      toast.show(`${name} has been added to saved items`, {
        type: 'success',
        duration: 2000,
      });
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

  const fetchSavedItems = async () => {
    const res = await getSavedItems({
      area_id: area?.id,
      country_id: country?._id,
    });
    console.log(res);
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'savedItems', value: res.data?.data }));
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
      fetchSavedItems();
    }, [dispatch, countries, refetch])
  );

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [refetchCart])
  );

  const filteredProducts = useMemo(() => {
    let filtered = savedItems?.items || [];
    if (filtered && filtered?.length > 0) {
      filtered = filtered?.filter((prod) => prod?.country_id == country?._id);

      filtered = filtered?.map((x) => {
        const connectedMarket = area?.market;

        let selectedObject = null;
        if (area?.market) {
          for (let i = 0; i < x?.priceByMarketId.length; i++) {
            const priceByMarket = x?.priceByMarketId[i];

            if (priceByMarket?.market_id?._id === connectedMarket?._id) {
              selectedObject = priceByMarket;
              break;
            }
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
        console.log({ selectedObject });
      });
      filtered = removeUndefinedOrNull(filtered);
    }
    console.log(filtered);
    return filtered;
  }, [area, savedItems, isLoadingGetSavedItems]);

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  const ItemCard = ({ item, index, onPress, cartItems }) => (
    <Col
      borderRadius={4}
      marginTop={8}
      marginBottom={8}
      padding={15}
      style={{ height: 125 }}
    >
      <Row justify={'flex-start'} showBorder paddingBottom={10}>
        <Image
          source={{ uri: item?.imageCover }}
          style={{ width: 54, height: 54, marginRight: 10 }}
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
              {item?.priceByMarket?.uom_id?.name}
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
                item?.priceByMarket?.price,
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
            top={5}
            fontFamily={fonts.PoppinsMedium}
          >
            {formatCurrency(
              item?.priceByMarket?.price,
              2,
              country?.name?.toLowerCase()?.includes('nigeria')
                ? '₦'
                : country?.currency?.symbol
            )}
          </CustomText>
        </View>
      </Row>
      <Row paddingTop={5}>
        <Row width={'50%'} justify={'flex-start'}>
          <DeleteSvg
            onPress={() => {
              setSelectedItem(item);
              setDeleteVisible(true);
            }}
          />
        </Row>
        <Button
          text={'Add to Cart'}
          height={'30px'}
          width={'120px'}
          textSize={12}
          onPress={() => {
            setSelectedItem(item);
            setAddModalVisible(true);
          }}
        />
      </Row>
    </Col>
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
          No saved items yet
        </CustomText>
        <CustomText
          color={COLORS.gray_2}
          align="center"
          fontSize={13}
          top={10}
          bottom={100}
          fontFamily={fonts.PoppinsMedium}
        >
          You can view your saved items here
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
              Saved Items
            </CustomText>
          </Row>
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
        </Row>
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <FlatList
          data={filteredProducts || []}
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
      <AddToCartModal
        setVisible={setAddModalVisible}
        visible={addModalVisible}
        item={selectedItem}
      />
      <DeleteCartModal
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        item={selectedItem}
        onConfirm={() => handleDeleteSavedItem(selectedItem)}
      />
    </>
  );
};

export default SavedItems;

const styles = StyleSheet.create({});
