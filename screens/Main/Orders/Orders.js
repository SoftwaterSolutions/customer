import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
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
import EmptyOrderSvg from '../../../assets/svgs/emptyOrder.svg';
import Button from '../../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SearchInput from '../../../components/Input/SearchInput';
import { NairaSign } from '../../../constants/text';
const sampleProductImage = require('../../../assets/svgs/mango.png');
import MinusSvg from '../../../assets/svgs/minus.svg';
import PlusSvg from '../../../assets/svgs/plus.svg';
import DeleteSvg from '../../../assets/svgs/delete.svg';
import DeleteCartModal from '../../components/DeleteCartModal';
import { useGetUserOrdersMutation } from '../../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { saveToUserStore } from '../../../redux/features/user/userSlice';
import { formatCurrency } from '../../../helpers/formatText';
import moment from 'moment/moment';
import Loader from '../../../components/Loader/Loader';

const Orders = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { height, width } = useWindowDimensions();
  const { countries, country } = useSelector((state) => state.userAuth);
  const { orders } = useSelector((state) => state.userStore);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [orderEmpty, setOrderEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [getUserOrders, { isLoading: isLoadingGetUserOrders }] =
    useGetUserOrdersMutation();

  const fetchOrders = async () => {
    const res = await getUserOrders();
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'orders', value: res.data?.data || [] }));
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
      fetchOrders();
    }, [dispatch, refetch])
  );

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  const ItemCard = ({ item, index, onPress, cartItems }) => (
    <PressableCol
      borderRadius={4}
      marginTop={8}
      marginBottom={8}
      padding={15}
      style={{ height: 80 }}
      onPress={() => navigation.navigate('OrderDetails', { id: item?.id })}
    >
      <Row>
        <CustomText
          color={COLORS.black}
          align="center"
          fontSize={13}
          fontFamily={fonts.PoppinsMedium}
        >
          {item?.orderId}
        </CustomText>
        <CustomText
          color={item?.payment_status !== 'paid' ? COLORS.red : COLORS.green}
          align="center"
          fontSize={13}
          fontFamily={fonts.MontserratMedium}
        >
          {item?.extAmount}
        </CustomText>
      </Row>
      <Row>
        <CustomText
          color={COLORS.gray_3}
          align="center"
          fontSize={13}
          fontFamily={fonts.PoppinsMedium}
        >
          {item?.extTime}
        </CustomText>
        <CustomText
          color={COLORS.gray_3}
          align="center"
          fontSize={13}
          fontFamily={fonts.PoppinsMedium}
        >
          {item?.extItemNo}
        </CustomText>
      </Row>
    </PressableCol>
  );

  const EmptyOrder = () => {
    return (
      <Col
        style={{ flexGrow: 1 }}
        align={'center'}
        justify={'center'}
        marginBottom={90}
        height={height - 100}
      >
        <EmptyOrderSvg width={120} height={160} />
        <Row width={'240px'} justify="center">
          <CustomText
            color={COLORS.primary}
            align="center"
            fontSize={14}
            fontFamily={fonts.PoppinsMedium}
          >
            You do not have any orders yet
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
            Your orders will show here once you start placing orders
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
    let filtered = orders || [];
    console.log(filtered[0]?.country_id?.name || {});
    filtered = filtered?.map((x) => {
      return {
        ...x,
        orderId: `Order ID. ${x?.order_id}`,
        extAmount: formatCurrency(
          x?.total_amount,
          2,
          x?.country_id?.name?.toLowerCase()?.includes('nigeria')
            ? '₦'
            : x?.country_id?.currency?.symbol
        ),
        extTime: moment(x?.createdAt).format('ddd MMM DD, yyyy'),
        extItemNo: `x${JSON.parse(x?.items)?.length} ${
          JSON.parse(x?.items)?.length > 1 ? 'Items' : 'Item'
        }`,
      };
    });
    return filtered;
  }, [searchValue, country, orders]);

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
                Orders
              </CustomText>
            </Row>

            <SearchSvg
              marginRight={10}
              onPress={() => setOpenSearch(!openSearch)}
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

        {isLoadingGetUserOrders ? (
          <Loader style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => setRefetch(true)}
            contentContainerStyle={{
              marginHorizontal: 15,
              paddingBottom: 20,
              flexGrow: 1,
            }}
            ListEmptyComponent={<EmptyOrder />}
          />
        )}
      </SafeAreaWrap>

      <DeleteCartModal visible={deleteVisible} setVisible={setDeleteVisible} />
    </>
  );
};

export default Orders;

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
