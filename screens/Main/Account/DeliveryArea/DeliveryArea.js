import {
  FlatList,
  Image,
  ScrollView,
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
import SearchSvg from '../../../../assets/svgs/searchYellow.svg';
import SearchInput from '../../../../components/Input/SearchInput';
import TickSvg from '../../../../assets/svgs/tickYellow.svg';
import { areas } from '../../../components/SelectAreaModal';
import { useFocusEffect } from '@react-navigation/native';
import { saveToUserStore } from '../../../../redux/features/user/userSlice';
import { useGetDeliveryAddressesMutation } from '../../../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import AddDeliveryAddressModal from '../../../components/AddDeliveryAddressModal';
import { capitalize } from '../../../../helpers/formatText';

const DeliveryArea = ({ navigation }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user, area } = useSelector((state) => state.userAuth);
  const { deliveryAddresses, currentDeliveryAddress } = useSelector(
    (state) => state.userStore
  );
  const { height, width } = useWindowDimensions();
  const { countries, country } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [stateId, setStateId] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selected, setSelected] = useState(currentDeliveryAddress);
  const [searchValue, setSearchValue] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  const [addDeliveryAddressVisible, setAddDeliveryAddressVisible] =
    useState(false);

  const [getDeliveryAddresses, { isLoading: isLoadingDeliveryAddresses }] =
    useGetDeliveryAddressesMutation();

  const fetchDeliveryAddresses = async () => {
    const res = await getDeliveryAddresses({
      customer_id: user.id,
    });

    if (res?.data?.status === 'success') {
      dispatch(
        saveToUserStore({ key: 'deliveryAddresses', value: res.data?.data })
      );
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDeliveryAddresses();
    }, [user, addDeliveryAddressVisible, refetch])
  );

  const options = useMemo(() => {
    let filtered = deliveryAddresses || [];
    setSelected(currentDeliveryAddress);
    // filtered = filtered?.filter((x) => x?.state == area?.state);
    // filtered = filtered?.filter((x) => x?.city == area?.name);
    filtered = filtered?.map((x, index) => {
      return {
        ...x,
        uid: index + x?.tag + x?.contact_name,
        title: capitalize(x?.tag),
        name: capitalize(x?.contact_name),
        address: capitalize(
          x?.street_address +
            ', ' +
            x?.city +
            ', ' +
            x?.state +
            ', ' +
            x?.country
        ),
        phoneNumber: x?.contact_phone,
      };
    });
    return filtered;
  }, [deliveryAddresses, area, currentDeliveryAddress]);

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  const ItemCard = ({ item, index, onPress, cartItems }) => (
    <PressableRow
      paddingTop={15}
      paddingBottom={15}
      borderRadius={5}
      showBorder
      key={item?.uid}
    >
      <Col width={'80%'}>
        <CustomText
          color={COLORS.black}
          align="left"
          fontSize={14}
          top={3}
          fontFamily={fonts.PoppinsMedium}
        >
          {item?.title}
        </CustomText>
        <CustomText
          color={COLORS.black}
          align="left"
          fontSize={12}
          top={3}
          fontFamily={fonts.PoppinsRegular}
        >
          {item?.name}
        </CustomText>
        <CustomText
          color={COLORS.gray_1}
          align="left"
          fontSize={12}
          top={3}
          fontFamily={fonts.PoppinsRegular}
        >
          {item?.address}
        </CustomText>
        <CustomText
          color={COLORS.gray_1}
          align="left"
          fontSize={12}
          top={3}
          fontFamily={fonts.PoppinsRegular}
        >
          {item?.phoneNumber}
        </CustomText>
      </Col>
      {selected?.id == item?.id && <TickSvg />}
    </PressableRow>
  );

  const EmptyComponent = () => {
    return (
      <Col
        style={{ flexGrow: 1 }}
        align={'center'}
        justify={'center'}
        marginBottom={90}
        height={height - 100}
      >
        <EmptySvg width={120} height={160} />
        <Row width={'240px'} justify="center">
          <CustomText
            color={COLORS.primary}
            align="center"
            fontSize={14}
            fontFamily={fonts.PoppinsMedium}
          >
            You have not added any delivery address
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
            Delivery addresses added will appear here
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
            text={'Add New Address'}
            onPress={() => setAddDeliveryAddressVisible(true)}
          />
        </Col>
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
              Delivery Address
            </CustomText>
          </Row>
          <CustomText
            color={COLORS.primary}
            align="left"
            fontSize={13}
            top={3}
            fontFamily={fonts.PoppinsMedium}
            onPress={() => setAddDeliveryAddressVisible(true)}
          >
            ADD NEW +
          </CustomText>
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
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={(item) => item?.uid}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => setRefetch(true)}
          contentContainerStyle={{
            marginHorizontal: 24,
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
      <AddDeliveryAddressModal
        visible={addDeliveryAddressVisible}
        setVisible={setAddDeliveryAddressVisible}
      />
    </>
  );
};

export default DeliveryArea;

const styles = StyleSheet.create({});
