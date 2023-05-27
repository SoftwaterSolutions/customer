/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
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
import SuccessBigSvg from '../../assets/svgs/success_big.svg';
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
  align-items: center;
  justify-content: center;
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

const SuccessModal = ({ visible, setVisible, text }) => {
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;

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
              <SuccessBigSvg marginBottom={70} />
              <CustomText
                color={COLORS.primary}
                align="center"
                fontSize={13}
                bottom={150}
                left={15}
                right={15}
                fontFamily={fonts.PoppinsRegular}
              >
                {text}
              </CustomText>
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
                <Button
                  top={20}
                  onPress={closeModal}
                  text={'Continue shopping'}
                  textColor={COLORS.primary}
                  bgColor={COLORS.white}
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                  }}
                />
                <Button text={'View Order details'} top={10} />
              </Col>
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </Modal>
    </>
  );
};

export default SuccessModal;
