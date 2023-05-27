/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import CustomText from '../../components/CustomText/CustomText';
import fonts from '../../constants/fonts';
import Button from '../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Col,
  PressableRow,
  Row,
  ScrollCol,
} from '../../components/CustomGrid/CustomGrid';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import Loader from '../../components/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { saveToUserStore } from '../../redux/features/user/userSlice';
import { Image } from 'react-native';
import {
  extractObjectWithMarketId,
  removeDuplicates,
} from '../../helpers/formatArray';
import EmptyCheck from '../../assets/svgs/uncheckbox.svg';
import FilledCheck from '../../assets/svgs/checkedbox.svg';
import MinusSvg from '../../assets/svgs/minus.svg';
import PlusSvg from '../../assets/svgs/plus.svg';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { formatCurrency } from '../../helpers/formatText';
import { useAddToCartMutation } from '../../redux/features/user/userApi';
import { useToast } from 'react-native-toast-notifications';
import Tooltip from 'react-native-walkthrough-tooltip';

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
  border-radius: 30px;
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
`;

const CloseWrapper = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  justify-content: center;
  align-items: center;
  margin-right: -5px;
  margin-top: -5px;
`;

const AddToCartModal = ({ visible, setVisible, item }) => {
  const { height, width } = useWindowDimensions();
  const toast = useToast();
  const translateY = useRef(new Animated.Value(height)).current;
  const { sortFilter } = useSelector((state) => state.userStore);
  const { country, area } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(1);

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
  const [addToCart, { isLoading: isLoadingAddToCart }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    const res = await addToCart({
      product_id: item?.id,
      area_id: area?.id,
      country_id: country?.id,
      quantity: quantity,
      name: item?.name,
      priceByMarket: selected,
      totalAmount: price,
    });
    if (res?.data?.status === 'success') {
      toast.show(`${item?.name} has been added to cart`, {
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

  const handleConfirm = async () => {
    await handleAddToCart();
    closeModal();
  };

  useEffect(() => {
    selected?.price && setPrice(quantity * selected?.price);
  }, [quantity, selected?.price]);

  const filteredProduct = useMemo(() => {
    let filtered = item || null;
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
      setSelected(extrPriceByMarket[0]);
      setQuantity(1);
      setPrice(extrPriceByMarket[0]?.price * quantity);
    }

    filtered = { ...filtered, extrPriceByMarket };
    return filtered;
  }, [area, item]);

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
            }}
          >
            <WhiteBg>
              {filteredProduct && (
                <Row>
                  <Image
                    source={{ uri: filteredProduct?.imageCover }}
                    style={{ width: 80, height: 80, marginRight: 10 }}
                    resizeMode="contain"
                  />
                  <View
                    style={{ flexGrow: 1, justifyContent: 'space-between' }}
                  >
                    <Row>
                      <CustomText
                        color={COLORS.black}
                        align="center"
                        fontSize={16}
                        fontFamily={fonts.PoppinsMedium}
                      >
                        {filteredProduct?.name}
                      </CustomText>
                    </Row>
                    <Row marginTop={10}>
                      <CustomText
                        color={COLORS.black}
                        align="center"
                        fontSize={14}
                        fontFamily={fonts.PoppinsMedium}
                      >
                        {formatCurrency(price, 2, country?.currency?.symbol)}
                      </CustomText>
                    </Row>
                  </View>
                </Row>
              )}
              <Row
                justify={'flex-end'}
                width={'60px'}
                style={{ position: 'absolute', top: 20, right: 20 }}
              >
                <CloseWrapper onPress={closeModal}>
                  <CloseSvg />
                </CloseWrapper>
              </Row>
              {filteredProduct && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filteredProduct?.extrPriceByMarket?.map((x, index) => {
                    // const [toolTipVisible, setToolTipVisible] = useState(false);

                    return (
                      <Row key={x?.uom_id?.id}>
                        <View
                          style={{
                            flexDirection: 'row',
                            // paddingHorizontal: 15,
                            paddingVertical: 15,
                            alignItems: 'center',
                          }}
                        >
                          {selected?.id == x?.id ? (
                            <FilledCheck
                              marginRight={15}
                              onPress={() => setSelected(x)}
                            />
                          ) : (
                            <EmptyCheck
                              marginRight={15}
                              onPress={() => setSelected(x)}
                            />
                          )}
                          {/* <Tooltip
                            animated={true}
                            //(Optional) When true, tooltip will animate in/out when showing/hiding
                            arrowSize={{ width: 16, height: 8 }}
                            //(Optional) Dimensions of arrow bubble pointing to the highlighted element
                            backgroundColor="rgba(0,0,0,0)"
                            //(Optional) Color of the fullscreen background beneath the tooltip.
                            isVisible={toolTipVisible}
                            //(Must) When true, tooltip is displayed
                            content={
                              <CustomText
                                fontSize={11}
                                marginTop={3}
                                fontFamily={fonts.PoppinsRegular}
                                onPress={() => setToolTipVisible(true)}
                              >
                                {x?.uom_id?.description}
                              </CustomText>
                            }
                            //(Must) This is the view displayed in the tooltip
                            placement="top"
                            //(Must) top, bottom, left, right, auto.
                            onClose={() => setToolTipVisible(false)}
                            //(Optional) Callback fired when the user taps the tooltip
                          > */}
                          <View
                            style={{
                              width: width - 170,
                            }}
                          >
                            <CustomText
                              fontSize={13}
                              marginTop={3}
                              fontFamily={fonts.PoppinsRegular}
                              onPress={() => setSelected(x)}
                            >
                              {`${x?.uom_id?.name}`}
                            </CustomText>
                            {selected?.id == x?.id &&
                              x?.uom_id?.description && (
                                <CustomText
                                  fontSize={10}
                                  marginTop={3}
                                  fontFamily={fonts.PoppinsRegular}
                                >
                                  {`${x?.uom_id?.description}`}
                                </CustomText>
                              )}
                          </View>

                          {/* </Tooltip> */}
                        </View>
                        {selected?.id == x?.id && (
                          <Row width={'90px'} justify={'flex-end'}>
                            <MinusSvg
                              onPress={() =>
                                quantity > 1 && setQuantity(quantity - 1)
                              }
                            />
                            <TextInput
                              keyboardType="numeric"
                              style={styles?.counterInput}
                              value={quantity.toString()}
                              onChangeText={(text) =>
                                setQuantity(parseInt(text))
                              }
                            />
                            <PlusSvg
                              onPress={() => setQuantity(quantity + 1)}
                            />
                          </Row>
                        )}
                      </Row>
                    );
                  })}
                </ScrollView>
              )}
              <Button
                top={20}
                onPress={handleConfirm}
                text={'Add to Cart'}
                loading={isLoadingAddToCart}
                // textColor={COLORS.primary}
                // bgColor={COLORS.white}
                // style={{
                //   borderWidth: 1,
                //   borderColor: COLORS.primary,
                // }}
                bottom={30}
              />
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </KeyboardAwareScrollView>
    </Modal>
  );
};
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

export default AddToCartModal;
