/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import ChevronRightSvg from '../../assets/svgs/rightChevron.svg';
import ChevronDownSvg from '../../assets/svgs/downChevron.svg';
import LeftArrow from '../../assets/svgs/leftArrow.svg';
import CustomText from '../../components/CustomText/CustomText';
import fonts from '../../constants/fonts';
import TextInput from '../../components/Input/TextInput';
import Button from '../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Col,
  PressableRow,
  Row,
  ScrollCol,
  SpacedRow,
} from '../../components/CustomGrid/CustomGrid';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import Loader from '../../components/Loader/Loader';
import RangeSlider from 'react-native-range-slider-expo';
import CheckedSvg from '../../assets/svgs/checked.svg';
import UnCheckedSvg from '../../assets/svgs/unchecked.svg';
import { useDispatch, useSelector } from 'react-redux';
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
  height: ${(props) => props.height || '100%'};
  padding-top: 20px;
  padding-horizontal: 24px;
  padding-bottom: 20px;
`;

const Box = styled.View`
  height: 20px;
  width: 20px;
`;

const CloseWrapper = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  justify-content: center;
  align-items: center;
  margin-right: -5px;
  margin-top: -5px;
`;

const FilterModal = ({ visible, setVisible, reset }) => {
  const { height } = useWindowDimensions();
  const dispatch = useDispatch();
  const translateY = useRef(new Animated.Value(height)).current;

  const {
    uomsFilter,
    brandsFilter,
    priceToFilter,
    priceFromFilter,
    filterByUom,
    filterByBrand,
  } = useSelector((state) => state.userStore);

  const [selectedUom, setSelectedUom] = useState(uomsFilter || []);
  const [selectedBrand, setSelectedBrand] = useState(brandsFilter || []);
  const [openUom, setOpenUom] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [range, setRange] = useState({ low: 0, high: 100000 });
  const [fromValue, setFromValue] = useState(priceFromFilter?.toString());
  const [toValue, setToValue] = useState(priceToFilter?.toString());
  const [upperPriceRange, setUpperPriceRange] = useState('100000');
  const [lowerPriceRange, setLowerPriceRange] = useState('0');
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

  const handleApplyFilter = () => {
    dispatch(saveToUserStore({ key: 'filterByUom', value: selectedUom }));
    dispatch(saveToUserStore({ key: 'filterByBrand', value: selectedBrand }));
    dispatch(
      saveToUserStore({ key: 'filterByPriceFrom', value: lowerPriceRange })
    );
    dispatch(
      saveToUserStore({ key: 'filterByPriceTo', value: upperPriceRange })
    );
    closeModal();
  };

  const handleReset = () => {
    setSelectedUom(uomsFilter);
    setSelectedBrand(brandsFilter);
    setUpperPriceRange(priceToFilter?.toString());
    setLowerPriceRange(priceFromFilter?.toString());
  };

  useEffect(() => {
    handleReset();
    handleApplyFilter();
  }, [reset]);

  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={false}
      >
        <BlackBg>
          <Animated.View
            style={{
              transform: [{ translateY }],
              width: '100%',
              alignSelf: 'flex-end',
            }}
          >
            <WhiteBg>
              <Row>
                <Row justify={'flex-start'} align={'center'} width={'200px'}>
                  <LeftArrow marginRight={15} onPress={closeModal} />
                  <CustomText
                    color={COLORS.black}
                    align="left"
                    fontSize={16}
                    top={1}
                    fontFamily={fonts.PoppinsMedium}
                  >
                    Filter
                  </CustomText>
                </Row>
                <CustomText
                  color={COLORS.primary}
                  align="left"
                  fontSize={13}
                  top={3}
                  fontFamily={fonts.PoppinsMedium}
                  onPress={handleReset}
                >
                  RESET ALL
                </CustomText>
              </Row>

              <PressableRow
                marginTop={15}
                marginBottom={20}
                paddingBottom={10}
                showBorder
                onPress={() => setOpenUom(!openUom)}
              >
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={13}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Unit of Measure
                </CustomText>
                {openUom ? <ChevronDownSvg /> : <ChevronRightSvg />}
              </PressableRow>
              {openUom && (
                <Row
                  showBorder
                  marginBottom={15}
                  paddingBottom={10}
                  style={{ maxHeight: 105 }}
                >
                  <ScrollView>
                    {uomsFilter.map((option) => (
                      <PressableRow
                        paddingBottom={10}
                        paddingTop={4}
                        justify={'flex-start'}
                      >
                        {selectedUom?.includes(option) ? (
                          <CheckedSvg
                            onPress={() =>
                              setSelectedUom(
                                selectedUom.filter((item) => item !== option)
                              )
                            }
                          />
                        ) : (
                          <UnCheckedSvg
                            onPress={() =>
                              setSelectedUom([...selectedUom, option])
                            }
                          />
                        )}
                        <CustomText
                          color={COLORS.black}
                          align="left"
                          fontSize={12}
                          left={10}
                          fontFamily={fonts.PoppinsRegular}
                        >
                          {option}
                        </CustomText>
                      </PressableRow>
                    ))}
                  </ScrollView>
                </Row>
              )}
              <PressableRow
                marginBottom={20}
                paddingBottom={10}
                showBorder
                onPress={() => setOpenBrand(!openBrand)}
              >
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={13}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Brand
                </CustomText>
                {openBrand ? <ChevronDownSvg /> : <ChevronRightSvg />}
              </PressableRow>
              {openBrand && (
                <Row
                  showBorder
                  marginBottom={15}
                  paddingBottom={10}
                  style={{ maxHeight: 105 }}
                >
                  <ScrollView>
                    {brandsFilter.map((option) => (
                      <PressableRow paddingBottom={10} justify={'flex-start'}>
                        {selectedBrand?.includes(option) ? (
                          <CheckedSvg
                            onPress={() =>
                              setSelectedBrand(
                                selectedBrand.filter((item) => item !== option)
                              )
                            }
                          />
                        ) : (
                          <UnCheckedSvg
                            onPress={() =>
                              setSelectedBrand([...selectedBrand, option])
                            }
                          />
                        )}
                        <CustomText
                          color={COLORS.black}
                          align="left"
                          fontSize={12}
                          top={3}
                          left={10}
                          fontFamily={fonts.PoppinsRegular}
                        >
                          {option}
                        </CustomText>
                      </PressableRow>
                    ))}
                  </ScrollView>
                </Row>
              )}
              <PressableRow paddingBottom={10}>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={13}
                  top={3}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Price
                </CustomText>
              </PressableRow>
              <Row height={25}>
                <RangeSlider
                  min={range?.low}
                  max={range?.high}
                  fromValue={parseInt(lowerPriceRange)}
                  toValue={parseInt(upperPriceRange)}
                  fromValueOnChange={(value) =>
                    setLowerPriceRange(value.toString())
                  }
                  toValueOnChange={(value) => {
                    setUpperPriceRange(value.toString());
                  }}
                  step={100}
                  styleSize={'medium'}
                  fromKnobColor={COLORS.primary}
                  toKnobColor={COLORS.primary}
                  inRangeBarColor={COLORS.primary}
                  outOfRangeBarColor={COLORS.gray_2}
                  showValueLabels={false}
                  knobSize={16}
                  barHeight={5}
                  showRangeLabels={false}
                  containerStyle={{
                    paddingVertical: 0,
                    paddingHorizontal: 3,
                    margin: 0,
                    height: 25,
                  }}
                  initialFromValue={priceFromFilter}
                  initialToValue={priceToFilter}
                />
              </Row>
              <Row>
                <Col width={'45%'}>
                  <CustomText
                    bottom={3}
                    fontSize={11}
                    fontFamily={fonts.PoppinsRegular}
                  >
                    FROM
                  </CustomText>
                  <TextInput
                    value={lowerPriceRange}
                    handleChange={(e) => setLowerPriceRange(e)}
                    height={'30px'}
                    width={'85%'}
                    inputType="numeric"
                    disabled
                    inputBg={COLORS.white}
                  />
                </Col>
                <Col width={'45%'}>
                  <CustomText
                    bottom={3}
                    fontSize={11}
                    fontFamily={fonts.PoppinsRegular}
                  >
                    TO
                  </CustomText>
                  <TextInput
                    value={upperPriceRange}
                    handleChange={(e) => setUpperPriceRange(e)}
                    height={'30px'}
                    width={'85%'}
                    inputType="numeric"
                    disabled={true}
                    inputBg={COLORS.white}
                  />
                </Col>
              </Row>
              <Col marginTop={20} style={{ flexGrow: 1 }} justify={'flex-end'}>
                <Button
                  text="Apply"
                  top={15}
                  bottom={30}
                  onPress={handleApplyFilter}
                />
              </Col>
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default FilterModal;
