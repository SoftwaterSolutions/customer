import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
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
import CountrySelect from '../../../../components/Input/CountrySelect';
import { useDispatch, useSelector } from 'react-redux';
import SearchInput from '../../../../components/Input/SearchInput';
import OptionIcon from '../../../../assets/svgs/hamburger.svg';
import SelectMarketModal from '../../../components/SelectAreaModal';
import ChangeCountryModal from '../../../components/ChangeCountryModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BasketSvg from '../../../../assets/svgs/basket.svg';
import SortSvg from '../../../../assets/svgs/sort.svg';
import EmptyLikeSvg from '../../../../assets/svgs/emptyLike.svg';
import FilledLikeSvg from '../../../../assets/svgs/filledLike.svg';
import Button from '../../../../components/Button/Button';
import SortModal from '../../../components/SortModal';
import FilterModal from '../../../../components/Filter/FilterModal';
import {
  useAddToCartMutation,
  useAddToSavedItemsMutation,
  useDeleteSavedItemMutation,
  useGetProductsMutation,
  useGetSavedItemsMutation,
} from '../../../../redux/features/user/userApi';
import { saveToUserStore } from '../../../../redux/features/user/userSlice';
import { useToast } from 'react-native-toast-notifications';
import {
  extractValueFromArray,
  removeDuplicates,
  removeObjectFromArray,
  removeUndefinedOrNull,
  sortByProperty,
} from '../../../../helpers/formatArray';
import { capitalize, formatCurrency } from '../../../../helpers/formatText';
const sampleProductImage = require('../../../../assets/svgs/sampleProduct.png');
import * as Crypto from 'expo-crypto';
import AddToCartModal from '../../../components/AddToCartModal';

const CategoryPage = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { width, height } = useWindowDimensions();
  const currentCategory = route.params;
  const { countries, country, area } = useSelector((state) => state.userAuth);
  const {
    areas,
    products,
    sortFilter,
    filterByPriceFrom,
    filterByPriceTo,
    filterByBrand,
    filterByUom,
    savedItems,
  } = useSelector((state) => state.userStore);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [getProducts, { isLoading: isLoadingProducts }] =
    useGetProductsMutation();
  const [addToCart, { isLoading: isLoadingAddToCart }] = useAddToCartMutation();
  const [addToSavedItems, { isLoading: isLoadingAddToSavedItems }] =
    useAddToSavedItemsMutation();
  const [deleteSavedItem, { isLoading: isLoadingDeleteSavedItems }] =
    useDeleteSavedItemMutation();
  const [getSavedItems, { isLoading: isLoadingGetSavedItems }] =
    useGetSavedItemsMutation();

  const fetchSavedItems = async () => {
    const res = await getSavedItems({
      area_id: area?.id,
      country_id: country?._id,
    });
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

  const fetchProducts = async () => {
    const res = await getProducts();

    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'products', value: res.data?.data }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
      navigation.goBack();
    }
  };

  useFocusEffect(
    useCallback(
      () => {
        fetchProducts();
        fetchSavedItems();
      },
      [dispatch, countries?.find((ctry) => ctry?.name === country?.name)?._id],
      refetch
    )
  );

  const filteredProducts = useMemo(() => {
    let filtered = products || [];
    if (filtered && filtered?.length > 0) {
      filtered = filtered?.filter(
        (prod) =>
          prod?.category_id?.name?.toLowerCase() ==
          currentCategory?.name?.toLowerCase()
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
      dispatch(
        saveToUserStore({
          value: removeDuplicates(
            extractValueFromArray(
              extractValueFromArray(filtered, 'uom_id'),
              'name'
            )
          ),
          key: 'uomsFilter',
        })
      );
      dispatch(
        saveToUserStore({
          value: removeDuplicates(
            extractValueFromArray(filtered, 'brand'),
            true,
            true
          ),
          key: 'brandsFilter',
        })
      );
      dispatch(
        saveToUserStore({
          value: Math.max(
            ...[
              ...removeDuplicates(extractValueFromArray(filtered, 'price')).map(
                (x) => {
                  return parseInt(x);
                }
              ),
            ].sort((a, b) => a - b)
          ),
          key: 'priceToFilter',
        })
      );
      dispatch(
        saveToUserStore({
          value: Math.min(
            ...[
              ...removeDuplicates(extractValueFromArray(filtered, 'price')).map(
                (x) => {
                  return parseInt(x);
                }
              ),
            ].sort((a, b) => a - b)
          ),
          key: 'priceFromFilter',
        })
      );

      if (filterByPriceFrom && filtered?.length > 0) {
        filtered = filtered?.filter(
          (x) => x?.priceByMarket?.price >= filterByPriceFrom
        );
      }
      if (filterByPriceTo && filtered?.length > 0) {
        filtered = filtered?.filter(
          (x) => x?.priceByMarket?.price <= filterByPriceTo
        );
      }
      if (filterByBrand && filtered?.length > 0) {
        filtered = filtered?.filter((x) => filterByBrand?.includes(x?.brand));
      }
      if (filterByUom && filtered?.length > 0) {
        filtered = filtered?.filter((x) =>
          filterByUom?.includes(x?.priceByMarket?.uom_id?.name)
        );
      }
      if (sortFilter == 'Lowest Price') {
        filtered = [...filtered]?.sort(
          (a, b) => a?.priceByMarket?.price - b?.priceByMarket?.price
        );
      }
      if (sortFilter == 'Highest Price') {
        filtered = [...filtered]?.sort(
          (a, b) => b?.priceByMarket?.price - a?.priceByMarket?.price
        );
      }
      if (searchValue !== '' && searchValue?.length > 0) {
        filtered = filtered?.filter((x) =>
          x?.name?.toLowerCase().includes(searchValue?.toLowerCase())
        );
      }
    }
    return filtered;
  }, [
    products,
    searchValue,
    area,
    sortFilter,
    filterByPriceFrom,
    filterByPriceTo,
    filterByBrand,
    filterByUom,
  ]);

  const renderProduct = ({ item, index }) => {
    return <ProductCard key={Crypto.randomUUID()} item={item} index={index} />;
  };

  const ProductCard = ({ item, index, onPress, cartItems }) => (
    <Col
      key={Crypto.randomUUID()}
      borderRadius={10}
      height={243}
      // align="center"
      justifyContent="center"
      style={{
        width: width * 0.45,
        marginRight: index % 2 === 0 ? width * 0.0125 : 0,
        marginLeft: index % 2 === 0 ? 0 : width * 0.0125,
      }}
    >
      <PressableRow
        justify={'flex-end'}
        paddingRight={10}
        marginTop={10}
        onPress={() =>
          savedItems?.items &&
          savedItems?.items?.find((x) => x == item?.id || x?.id == item?.id)
            ? handleDeleteSavedItem({
                item_id: item?.id,
                saved_item_id: savedItems?.id,
                name: item?.name,
              })
            : handleAddToSavedItems({
                name: item?.name,
                product_id: item?.id,
                area_id: area?.id,
                country_id: country?._id,
              })
        }
      >
        {savedItems?.items &&
        savedItems?.items?.find((x) => x == item?.id || x?.id == item?.id) ? (
          <FilledLikeSvg />
        ) : (
          <EmptyLikeSvg />
        )}
      </PressableRow>
      <PressableRow
        style={{
          flexGrow: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        marginBottom={10}
        justify="center"
        onPress={() => navigation.navigate('ProductDetails', item)}
      >
        <Image
          source={{ uri: item?.imageCover }}
          style={{ width: 150, height: 100 }}
          resizeMode="cover"
        />
      </PressableRow>
      <PressableCol
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
          fontSize={11}
          top={2}
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
      <PressableRow justify={'center'} marginBottom={10}>
        <Button
          text={'Add to Cart'}
          height={'30px'}
          textColor={COLORS.white}
          textSize={11}
          width={'90%'}
          onPress={() => {
            setSelectedItem(item);
            setAddModalVisible(true);
            // handleAddToCart({
            //   product_id: item?.id,
            //   area_id: area?.id,
            //   country_id: item?.country_id?.id,
            //   quantity: 1,
            //   name: item?.name,
            //   priceByMarket: item?.priceByMarket,
            //   totalAmount: item?.priceByMarket?.price * 1,
            // });
          }}
          loading={isLoadingAddToCart}
        />
      </PressableRow>
    </Col>
  );

  const Separator = () => <View style={{ height: 10 }} />;

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
          paddingBottom: 60,
          justifyContent: 'space-between',
        }}
      >
        <Col paddingHorizontal={16}>
          <Row marginTop={10} marginBottom={5}>
            <SearchInput
              placeholder="Search"
              handleChange={(val) => setSearchValue(val)}
              value={searchValue}
              setFilterVisible={setFilterModalVisible}
            />
          </Row>
        </Col>
        <Col paddingHorizontal={16}>
          <Row marginTop={10} marginBottom={10}>
            <Row width={'50%'} justify={'flex-start'} marginBottom={3}>
              <BasketSvg marginRight={15} />
              <CustomText
                color={COLORS.black}
                align="center"
                fontSize={14}
                fontFamily={fonts.PoppinsRegular}
              >
                {capitalize(currentCategory?.name)}
              </CustomText>
            </Row>
            <PressableRow
              width={'150px'}
              justify={'flex-end'}
              showBorder
              border_bottom={COLORS.primary}
              style={{
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
              paddingBottom={5}
              bottomWidth={2}
              onPress={() => setSortModalVisible(true)}
            >
              <CustomText
                color={COLORS.black}
                align="center"
                fontSize={14}
                fontFamily={fonts.PoppinsRegular}
              >
                Sort by
              </CustomText>
              <SortSvg marginLeft={65} />
            </PressableRow>
          </Row>
        </Col>
        <Col bgColor={COLORS.mainBg} style={{ flexGrow: 1 }}>
          <FlatList
            data={filteredProducts}
            numColumns={2}
            renderItem={renderProduct}
            keyExtractor={(item) => Crypto.randomUUID()}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing || isLoadingProducts}
            onRefresh={() => setRefetch(!refetch)}
            columnWrapperStyle={{
              paddingHorizontal: 16,
              justifyContent: 'space-between',
            }}
            contentContainerStyle={{
              width: width,
              paddingBottom: 40,
              justifyContent: 'space-between',
            }}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  height: 100,
                }}
              >
                <CustomText
                  color={COLORS.gray_3}
                  align="center"
                  fontSize={14}
                  fontFamily={fonts.PoppinsRegular}
                >
                  No product available in this category
                </CustomText>
              </View>
            }
          />
        </Col>
      </SafeAreaWrap>
      <AddToCartModal
        setVisible={setAddModalVisible}
        visible={addModalVisible}
        item={selectedItem}
      />
      <SortModal setVisible={setSortModalVisible} visible={sortModalVisible} />
      <FilterModal
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
      />
    </>
  );
};

export default CategoryPage;

const styles = StyleSheet.create({});
