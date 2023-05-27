/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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
import { PressableRow, Row } from '../../components/CustomGrid/CustomGrid';
import { useGetPaymentMethodsMutation } from '../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { isSubstringInArray } from '../../helpers/formatArray';
import { useFocusEffect } from '@react-navigation/native';
import { capitalize } from '../../helpers/formatText';
import { saveToUserStore } from '../../redux/features/user/userSlice';

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
  padding-top: 20px;
  padding-horizontal: 24px;
  padding-bottom: 20px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
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

const PaymentMethodModal = ({
  visible,
  setVisible,
  selectedMethod,
  setSelectedMethod,
}) => {
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const dispatch = useDispatch();
  const toast = useToast();
  const { user, country } = useSelector((state) => state.userAuth);
  const { paymentMethods } = useSelector((state) => state.userStore);
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 20,
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
  const [getPaymentMethods, { isLoading: isLoadingPaymentMethods }] =
    useGetPaymentMethodsMutation();

  const fetchPaymentMethods = async () => {
    const res = await getPaymentMethods();
    if (res?.data?.status === 'success') {
      dispatch(
        saveToUserStore({ key: 'paymentMethods', value: res.data?.data })
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
      fetchPaymentMethods();
    }, [user, visible])
  );

  const options = useMemo(() => {
    let filtered = paymentMethods || [];
    filtered = filtered?.filter((x) => x?.status);
    if (isSubstringInArray(country?.name, ['nigeria'])) {
      filtered = filtered?.filter(
        (x) => !isSubstringInArray(x?.name, ['stripe'])
      );
    }
    if (!isSubstringInArray(country?.name, ['nigeria'])) {
      filtered = filtered?.filter((x) =>
        isSubstringInArray(x?.name, ['stripe'])
      );
    }
    filtered = filtered?.map((x) => {
      return {
        ...x,
        name: capitalize(x?.name),
        svg: isSubstringInArray(x?.name, ['paystack', 'stripe']) ? (
          <DebitCardSvg />
        ) : isSubstringInArray(x?.name, ['voucher']) ? (
          <VoucherSvg />
        ) : (
          <CreditCardSvg />
        ),
      };
    });
    return filtered;
  }, [paymentMethods]);

  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={false}
      >
        <BlackBg>
          <CloseView onPress={closeModal} />
          <Animated.View
            style={{
              transform: [{ translateY }],
              width: '100%',
              alignSelf: 'flex-end',
              paddingBottom: 20,
            }}
          >
            <WhiteBg>
              <SpacedRow>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={16}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Select Payment Method
                </CustomText>
                <CloseWrapper onPress={closeModal}>
                  <CloseSvg />
                </CloseWrapper>
              </SpacedRow>

              {options?.map((option) => (
                <PressableRow
                  // bgColor={'red'}
                  paddingRight={15}
                  paddingLeft={15}
                  paddingTop={15}
                  paddingBottom={15}
                  borderRadius={5}
                  marginBottom={10}
                  style={{
                    borderColor: COLORS.primary,
                    borderBottomColor: COLORS.primary,
                    borderWidth: 1,
                  }}
                  showBorder
                  onPress={async () => {
                    setSelectedMethod(option);
                    await dispatch(
                      saveToUserStore({
                        key: 'currentPaymentMethod',
                        value: { ...option, svg: <></> },
                      })
                    );
                    closeModal();
                  }}
                >
                  <Row justify={'flex-start'} width={'60%'} align="center">
                    {option?.svg}
                    <CustomText
                      color={COLORS.black}
                      align="left"
                      fontSize={13}
                      top={1}
                      left={15}
                      fontFamily={fonts.PoppinsRegular}
                    >
                      {option?.name}
                    </CustomText>
                  </Row>
                  {selectedMethod?.name == option?.name ? (
                    <FilledCheck
                      onPress={async () => {
                        setSelectedMethod(option);
                        await dispatch(
                          saveToUserStore({
                            key: 'currentPaymentMethod',
                            value: { ...option, svg: <></> },
                          })
                        );
                        closeModal();
                      }}
                    />
                  ) : (
                    <EmptyCheck
                      onPress={async () => {
                        setSelectedMethod(option);
                        await dispatch(
                          saveToUserStore({
                            key: 'currentPaymentMethod',
                            value: { ...option, svg: <></> },
                          })
                        );
                        closeModal();
                      }}
                    />
                  )}
                </PressableRow>
              ))}
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default PaymentMethodModal;
