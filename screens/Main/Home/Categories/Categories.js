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
import LoadingScreen from '../../../../components/LoadingScreen';
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
import {
  saveArea,
  saveCountry,
  saveToken,
} from '../../../../redux/features/auth/authSlice';
import SelectAreaModal from '../../../components/SelectAreaModal';
import ChangeCountryModal from '../../../components/ChangeCountryModal';
import FilterModal from '../../../../components/Filter/FilterModal';
import {
  useAddToCartMutation,
  useAddToSavedItemsMutation,
  useDeleteSavedItemMutation,
  useGetAreaMutation,
  useGetCategoriesMutation,
  useGetProductsMutation,
  useGetSavedItemsMutation,
} from '../../../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { saveToUserStore } from '../../../../redux/features/user/userSlice';
const fruitCat = require('../../../../assets/svgs/fruitCat.png');
const beverageCat = require('../../../../assets/svgs/beverageCat.png');
const spiceCat = require('../../../../assets/svgs/spiceCat.png');
const grainCat = require('../../../../assets/svgs/grainCat.png');
const meatCat = require('../../../../assets/svgs/meatCat.png');
const oilCat = require('../../../../assets/svgs/oilCat.png');
import FilledLikeSvg from '../../../../assets/svgs/filledLike.svg';
import EmptyLikeSvg from '../../../../assets/svgs/emptyLike.svg';
import Button from '../../../../components/Button/Button';
import * as Crypto from 'expo-crypto';
import { randomUUID } from 'expo-crypto';
import { capitalize, formatCurrency } from '../../../../helpers/formatText';
import {
  extractPropsByInputArray,
  extractValueFromArray,
  removeDuplicates,
  removeDuplicatesByKey,
  removeUndefinedOrNull,
} from '../../../../helpers/formatArray';
import AddToCartModal from '../../../components/AddToCartModal';
const sampleProductImage = require('../../../../assets/svgs/sampleProduct.png');

const Categories = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { width, height } = useWindowDimensions();
  const { user, area, countries, country } = useSelector(
    (state) => state.userAuth
  );
  const {
    sortFilter,
    filterByPriceFrom,
    filterByPriceTo,
    filterByBrand,
    filterByUom,
  } = useSelector((state) => state.userStore);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [selectAreaModalVisible, setSelectAreaModalVisible] = useState(false);
  const [changeCountryModalVisible, setChangeCountryModalVisible] =
    useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [resetFilter, setResetFilter] = useState(true);
  const [availableCategory, setAvailableCategory] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { categories, products, savedItems } = useSelector(
    (state) => state.userStore
  );
  const [getSavedItems, { isLoading: isLoadingGetSavedItems }] =
    useGetSavedItemsMutation();
  const [deleteSavedItem, { isLoading: isLoadingDeleteSavedItems }] =
    useDeleteSavedItemMutation();
  const [addToSavedItems, { isLoading: isLoadingAddToSavedItems }] =
    useAddToSavedItemsMutation();

  const handleDeleteSavedItem = async ({ item_id, saved_item_id, name }) => {
    const res = await deleteSavedItem({ item_id, saved_item_id });
    console.log('deleteSavedItem', res?.data?.data);
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
    console.log('addToSavedItem', res?.data?.data);
    if (res?.data?.status === 'success') {
      toast.show(`${name} has been added to saved items`, {
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
      if (country?.name?.toLowerCase() == 'nigeria') {
        !area && setSelectAreaModalVisible(true);
      }
    }, [area, country])
  );

  const [getCategories, { isLoading: isLoadingCategories }] =
    useGetCategoriesMutation();
  const [getProducts, { isLoading: isLoadingProducts }] =
    useGetProductsMutation();
  const [getArea, { isLoading: isLoadingArea }] = useGetAreaMutation();
  const [addToCart, { isLoading: isLoadingAddToCart }] = useAddToCartMutation();

  const fetchArea = async () => {
    console.log('{ fetchArea: res.data?.data }');
    const res = await getArea(area?.id);
    if (res?.data?.status === 'success') {
      dispatch(saveArea(res.data?.data));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };
  const fetchCategories = async () => {
    console.log('{ fetchCategories: res.data?.data }');
    const res = await getCategories();
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'categories', value: res.data?.data }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };
  const fetchProducts = async () => {
    console.log('{ products: res.data?.data }');
    const res = await getProducts();
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'products', value: res.data?.data }));
      setResetFilter(!resetFilter);
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
    } else {
      toast.show(res?.error?.data?.message || 'Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('{selectAreaModalVisible}');
      !selectAreaModalVisible && !modalVisible && fetchCategories();
      !selectAreaModalVisible && !modalVisible && fetchProducts();
      !selectAreaModalVisible && !modalVisible && area?.id && fetchArea();
    }, [
      dispatch,
      country,
      refetch,
      area?.id,
      selectAreaModalVisible,
      modalVisible,
    ])
  );

  useEffect(() => {
    fetchSavedItems();
  }, []);

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
      setAvailableCategory(
        removeDuplicatesByKey(
          extractValueFromArray(filtered, 'category_id'),
          'name'
        )
      );
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
    categories,
  ]);

  const renderCategory = ({ item, index }) => {
    return <CartegoryCard item={item} index={index} />;
  };

  const CartegoryCard = ({ item, index, onPress, cartItems }) => (
    <PressableCol
      // bgColor="red"
      borderRadius={10}
      height={162}
      // align="center"
      justifyContent="center"
      style={{
        margin: 8,
        width: width * 0.45,
      }}
      key={item?.id}
      onPress={() => navigation.navigate('CategoryPage', item)}
    >
      <Row
        style={{
          flexGrow: 1,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        justify="center"
      >
        <Image
          style={{ width: '90%', height: '80%', borderRadius: 5 }}
          source={{ uri: item?.image }}
          resizeMode="cover"
        />
      </Row>
      <Row
        justify={'center'}
        style={{
          height: 40,
        }}
        // bgColor={'red'}
        showBorderTop={true}
        borderTop={2}
        borderTopColor={COLORS.primary}
      >
        <CustomText
          color={COLORS.black}
          align="center"
          fontWeight={500}
          fontSize={12}
          fontFamily={fonts.PoppinsMedium}
        >
          {item?.name}
        </CustomText>
      </Row>
    </PressableCol>
  );

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
      {console.log(savedItems?.items, item?.id)}
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
          }}
          loading={isLoadingAddToCart}
        />
      </PressableRow>
    </Col>
  );

  const renderCategories = () => (
    <FlatList
      data={availableCategory || []}
      numColumns={2}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing || isLoadingCategories}
      onRefresh={() => setRefetch(!refetch)}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        marginHorizontal: 10,
        width: width - 20,
      }}
    />
  );

  const renderProducts = () => (
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
      ItemSeparatorComponent={Separator}
    />
  );

  const Separator = () => <View style={{ height: 10 }} />;

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
          justifyContent: 'space-between',
        }}
      >
        <Col paddingHorizontal={16}>
          <Row>
            <CustomText
              color={COLORS.black}
              align="left"
              fontWeight={500}
              top={1}
              fontSize={15}
              fontFamily={fonts.PoppinsMedium}
              onPress={() => setSelectAreaModalVisible(true)}
            >
              Grocery categories
            </CustomText>
            <CountrySelect
              visible={modalVisible}
              setVisible={setModalVisible}
            />
          </Row>
          <Row marginTop={10} marginBottom={5}>
            <SearchInput
              placeholder="Search"
              handleChange={(val) => setSearchValue(val)}
              value={searchValue}
              setFilterVisible={setFilterModalVisible}
            />
            {/* <OptionIcon marginHorizontal={10} /> */}
          </Row>
        </Col>
        <Col bgColor={COLORS.mainBg} style={{ flexGrow: 1 }}>
          {searchValue == '' ||
          searchValue?.length <= 0 ||
          !searchValue ||
          !availableCategory
            ? renderCategories()
            : renderProducts()}
        </Col>
      </SafeAreaWrap>
      <AddToCartModal
        setVisible={setAddModalVisible}
        visible={addModalVisible}
        item={selectedItem}
      />
      <SelectAreaModal
        visible={selectAreaModalVisible}
        setVisible={setSelectAreaModalVisible}
      />
      <ChangeCountryModal
        visible={changeCountryModalVisible}
        setVisible={setChangeCountryModalVisible}
      />
      <FilterModal
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
        reset={resetFilter}
      />
    </>
  );
};

export default Categories;

const styles = StyleSheet.create({});
