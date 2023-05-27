/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  Dimensions,
  Animated,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components';
import { COLORS } from '../../../constants/colors';
import CloseSvg from '../../../assets/svgs/cross-circle.svg';
import CustomText from '../../../components/CustomText/CustomText';
import fonts from '../../../constants/fonts';
import TextInput from '../../../components/Input/TextInput';
import Button from '../../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Col,
  PressableRow,
  Row,
  ScrollCol,
} from '../../../components/CustomGrid/CustomGrid';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import Loader from '../../../components/Loader/Loader';
import { SvgUri } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { saveArea, saveCountry } from '../../../redux/features/auth/authSlice';
import { Image } from 'react-native';

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

const CountryModal = ({ visible, setVisible }) => {
  const dispatch = useDispatch();
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const { countries } = useSelector((state) => state?.userAuth);

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
      duration: 300,
      useNativeDriver: true,
    }).start();
    setVisible(false);
  };

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
              <SpacedRow>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={16}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Select country
                </CustomText>
                <CloseWrapper onPress={closeModal}>
                  <CloseSvg />
                </CloseWrapper>
              </SpacedRow>

              {countries?.length == 0 || !countries ? (
                <Loader style={{ height: 200 }} />
              ) : (
                // <Col align={'flex-start'} marginTop={10} height={200}>
                <Col
                  style={{ maxHeight: height / 2 }}
                  marginTop={10}
                  marginBottom={40}
                >
                  <ScrollView style={{ width: '100%' }}>
                    {countries.map((item, index) => (
                      <PressableRow
                        key={item?._id}
                        showBorder
                        align={'center'}
                        onPress={() => {
                          dispatch(saveCountry(item));
                          dispatch(saveArea(null));
                          closeModal();
                        }}
                        paddingTop={20}
                        paddingBottom={20}
                      >
                        <CustomText>{item?.name}</CustomText>
                        {item?.flags?.png ? (
                          <Image
                            style={{ width: 25, height: 15 }}
                            source={{ uri: item?.flags?.png }}
                          />
                        ) : item?.flags?.png ? (
                          <SvgUri
                            width={'25px'}
                            height={'20px'}
                            uri={item?.flags?.svg}
                          />
                        ) : (
                          <></>
                        )}
                      </PressableRow>
                    ))}
                  </ScrollView>
                </Col>
              )}
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default CountryModal;
