/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  Dimensions,
  Animated,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import CloseSvg from '../../assets/svgs/cross-circle.svg';
import TickSvg from '../../assets/svgs/tickYellow.svg';
import DebitCardSvg from '../../assets/svgs/debitCard.svg';
import CreditCardSvg from '../../assets/svgs/creditCard.svg';
import EmptyCheck from '../../assets/svgs/emptyCircleCheck.svg';
import FilledCheck from '../../assets/svgs/filledCircleCheck.svg';
import VoucherSvg from '../../assets/svgs/voucher.svg';
import LeftArrow from '../../assets/svgs/leftArrow.svg';
import CustomText from '../../components/CustomText/CustomText';
import fonts from '../../constants/fonts';
import TextInput from '../../components/Input/TextInput';
import Button from '../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import Loader from '../../components/Loader/Loader';
import { Col, PressableRow, Row } from '../../components/CustomGrid/CustomGrid';
import AddDeliveryAddressModal from './AddDeliveryAddressModal';
import { useGetDeliveryAddressesMutation } from '../../redux/features/user/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { saveToUserStore } from '../../redux/features/user/userSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { capitalize } from '../../helpers/formatText';
import EmptySvg from '../../assets/svgs/emptySavedItems.svg';
import { RefreshControl } from 'react-native';

const BlackBg = styled.View`
  justify-content: space-between;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 8, 15, 0.74);
`;

const CloseView = styled.TouchableOpacity`
  flex: 1;
`;

const WhiteBg = styled.View`
  background-color: ${COLORS.white};
  width: 100%;
  height: 100%;
  padding-top: 5px;
  padding-bottom: 20px;
`;

const Box = styled.View`
  height: 20px;
  width: 20px;
`;

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
`;

const CloseWrapper = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  justify-content: center;
  align-items: center;
  margin-right: -5px;
  margin-top: -5px;
`;

const DeliveryAddressModal = ({
  visible,
  setVisible,
  selectedAddress,
  setSelectedAddress,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { height } = useWindowDimensions();
  const { user, area, country, token } = useSelector((state) => state.userAuth);
  const { deliveryAddresses } = useSelector((state) => state.userStore);
  const translateY = useRef(new Animated.Value(height)).current;

  const [refetch, setRefetch] = useState(false);
  const [addDeliveryAddressVisible, setAddDeliveryAddressVisible] =
    useState(false);

  const [getDeliveryAddresses, { isLoading: isLoadingDeliveryAddresses }] =
    useGetDeliveryAddressesMutation();

  const fetchDeliveryAddresses = async () => {
    console.log({ customer_id: token });
    const res = await getDeliveryAddresses({
      customer_id: user.id,
      country: country?.name,
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

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        delay: 50,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.spring(translateY, {
      toValue: height,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  const EmptyComponent = () => {
    return (
      <Col
        style={{ flexGrow: 1 }}
        align={'center'}
        justify={'center'}
        paddingHorizontal={36}
      >
        <EmptySvg width={120} height={160} />
        <Row width={'240px'} justify="center">
          <CustomText
            color={COLORS.primary}
            align="center"
            top={16}
            fontSize={14}
            bottom={16}
            fontFamily={fonts.PoppinsSemiBold}
          >
            No delivery address for your set delivery area
          </CustomText>
        </Row>
        <Row width={'240px'} justify="center">
          <CustomText
            color={COLORS.gray_2}
            align="center"
            fontSize={13}
            top={10}
            bottom={100}
            fontFamily={fonts.PoppinsMedium}
          >
            Proceed to add new delivery address
          </CustomText>
        </Row>
      </Col>
    );
  };

  const options = useMemo(() => {
    let filtered = deliveryAddresses || [];
    if (area?.name) {
      filtered = filtered?.filter((x) => x?.state == area?.state_name);
      filtered = filtered?.filter((x) => x?.city == area?.name);
    }
    filtered = filtered?.filter(
      (x) => x?.country?.toLowerCase() == country?.name?.toLowerCase()
    );
    filtered = filtered?.map((x) => {
      return {
        ...x,
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
  }, [deliveryAddresses, area, country]);

  return (
    <>
      <Modal transparent={true} visible={visible}>
        <BlackBg>
          <Animated.View
            style={{
              transform: [{ translateY }],
              width: '100%',
              alignSelf: 'flex-end',
            }}
          >
            <WhiteBg style={{ flexGrow: 1 }}>
              <Row paddingLeft={15} paddingRight={15}>
                <Row justify={'flex-start'} align={'center'} width={'200px'}>
                  <LeftArrow marginRight={15} onPress={closeModal} />
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
              {isLoadingDeliveryAddresses ? (
                <Loader style={{ height: height - 100 }} />
              ) : options?.length > 0 ? (
                <View style={{ flexGrow: 1, paddingHorizontal: 24 }}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                      <RefreshControl
                        refreshing={isLoadingDeliveryAddresses}
                        onRefresh={() => setRefetch(!refetch)}
                      />
                    }
                  >
                    {options?.map((option) => (
                      <PressableRow
                        paddingTop={15}
                        paddingBottom={15}
                        borderRadius={5}
                        showBorder
                        onPress={async () => {
                          await dispatch(
                            saveToUserStore({
                              key: 'currentDeliveryAddress',
                              value: option,
                            })
                          );
                          closeModal();
                        }}
                      >
                        <Col width={'80%'}>
                          <CustomText
                            color={COLORS.black}
                            align="left"
                            fontSize={14}
                            top={3}
                            fontFamily={fonts.PoppinsMedium}
                          >
                            {option?.title}
                          </CustomText>
                          <CustomText
                            color={COLORS.black}
                            align="left"
                            fontSize={12}
                            top={3}
                            fontFamily={fonts.PoppinsRegular}
                          >
                            {option?.name}
                          </CustomText>
                          <CustomText
                            color={COLORS.gray_1}
                            align="left"
                            fontSize={12}
                            top={3}
                            fontFamily={fonts.PoppinsRegular}
                          >
                            {option?.address}
                          </CustomText>
                          <CustomText
                            color={COLORS.gray_1}
                            align="left"
                            fontSize={12}
                            top={3}
                            fontFamily={fonts.PoppinsRegular}
                          >
                            {option?.phoneNumber}
                          </CustomText>
                        </Col>
                        {selectedAddress?.name == option?.name && <TickSvg />}
                      </PressableRow>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <EmptyComponent />
              )}
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </Modal>
      <AddDeliveryAddressModal
        visible={addDeliveryAddressVisible}
        setVisible={setAddDeliveryAddressVisible}
      />
    </>
  );
};

export default DeliveryAddressModal;
