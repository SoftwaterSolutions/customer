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
import CloseSvg from '../../assets/svgs/cross-circle.svg';
import TickSvg from '../../assets/svgs/tickYellow.svg';
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
} from '../../components/CustomGrid/CustomGrid';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
} from '@expo-google-fonts/poppins';
import Loader from '../../components/Loader/Loader';
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

const SortModal = ({ visible, setVisible }) => {
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const { sortFilter } = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(sortFilter);

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

  const handleConfirm = () => {
    dispatch(saveToUserStore({ key: 'sortFilter', value: selected }));
    closeModal();
  };

  const options = [
    // {
    //   id: 'Popularity',
    //   name: 'Popularity',
    // },
    {
      id: 'Highest Price',
      name: 'Highest Price',
    },
    {
      id: 'Lowest Price',
      name: 'Lowest Price',
    },
  ];

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
              <SpacedRow marginBottom={15}>
                <CustomText
                  color={COLORS.black}
                  align="left"
                  fontSize={16}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Sort by
                </CustomText>
                <CloseWrapper onPress={closeModal}>
                  <CloseSvg />
                </CloseWrapper>
              </SpacedRow>

              <ScrollView showsVerticalScrollIndicator={false}>
                {options.map((item, index) => (
                  <PressableRow
                    key={item?.id}
                    // showBorder
                    align={'center'}
                    paddingHorizontal={15}
                    paddingTop={15}
                    paddingBottom={15}
                    onPress={() => {
                      setSelected(item?.id);
                    }}
                  >
                    <CustomText fontSize={13} fontFamily={fonts.PoppinsRegular}>
                      {item?.name}
                    </CustomText>
                    {selected == item?.id && <TickSvg marginBottom={5} />}
                  </PressableRow>
                ))}
              </ScrollView>
              <Button
                top={20}
                onPress={handleConfirm}
                text={'Apply'}
                textColor={COLORS.primary}
                bgColor={COLORS.white}
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                }}
                bottom={30}
              />
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default SortModal;
