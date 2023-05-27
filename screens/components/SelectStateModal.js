/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  Dimensions,
  Animated,
  ScrollView,
  View,
  useWindowDimensions,
  RefreshControl,
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
import Loader from '../../components/Loader/Loader';
import { SvgUri } from 'react-native-svg';
import SearchInput from '../../components/Input/SearchInput';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAreasMutation } from '../../redux/features/user/userApi';
import { saveToUserStore } from '../../redux/features/user/userSlice';
import { useToast } from 'react-native-toast-notifications';
import { saveArea } from '../../redux/features/auth/authSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

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

const SelectStateModal = ({ visible, setVisible }) => {
  const { height, width } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const [searchValue, setSearchValue] = useState('');
  const [refetch, setRefetch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { area, user, country } = useSelector((state) => state.userAuth);
  const { areas } = useSelector((state) => state.userStore);

  const [selected, setSelected] = useState(area);
  const dispatch = useDispatch();
  const toast = useToast();

  const [getAreas, { isLoading: isLoadingAreas }] = useGetAreasMutation();

  const fetchAreas = async () => {
    const res = await getAreas();
    if (res?.data?.status === 'success') {
      dispatch(saveToUserStore({ key: 'areas', value: res.data?.data }));
    } else {
      toast.show('Something went wrong', {
        type: 'error',
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    setRefreshing(false);
    setSearchValue('');
    fetchAreas();
  }, [dispatch, user]);

  useEffect(() => {
    setRefreshing(true);
    if (!refreshing) {
      setSearchValue('');
      fetchAreas();
    }
  }, [dispatch, user, refetch]);

  const filteredAreas = useMemo(() => {
    let filtered = areas;
    if (searchValue !== '' && searchValue?.length > 0) {
      filtered = filtered?.filter((x) =>
        x?.name?.toLowerCase().includes(searchValue?.toLowerCase())
      );
    }
    return filtered;
  }, [searchValue]);

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
    if (!!selected) {
      Animated.spring(translateY, {
        toValue: height,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setTimeout(async () => {
        console.log({ selected });
        await dispatch(saveArea(selected));
        setVisible(false);
      }, 300);
    }
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
          <CloseView
            onPress={() => {
              return;
            }}
          />
          <Animated.View
            style={{
              transform: [{ translateY }],
              width: '100%',
              alignSelf: 'flex-end',
            }}
          >
            <WhiteBg>
              <Row justify={'center'} marginBottom={20}>
                <CustomText
                  color={COLORS.black}
                  align="center"
                  fontSize={16}
                  fontFamily={fonts.PoppinsMedium}
                >
                  Select Delivery Area
                </CustomText>
              </Row>
              <SearchInput
                placeholder="Search"
                handleChange={(val) => setSearchValue(val)}
                value={searchValue}
                filtered={false}
              />
              {isLoadingAreas && !refreshing ? (
                <Loader style={{ height: height / 2 }} />
              ) : filteredAreas?.length == 0 ? (
                <PressableRow
                  align={'flex-start'}
                  width={`${width - 48}px`}
                  marginTop={14}
                  marginBottom={14}
                  style={{ height: height / 2 }}
                >
                  <CustomText fontSize={13} fontFamily={fonts.PoppinsRegular}>
                    No matching results found
                  </CustomText>
                  <CustomText fontSize={13} fontFamily={fonts.PoppinsRegular}>
                    Drag down to refetch
                  </CustomText>
                </PressableRow>
              ) : (
                // <Col align={'flex-start'} marginTop={10} height={200}>
                <Col
                  style={{ maxHeight: height / 2 }}
                  marginTop={10}
                  marginBottom={40}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                      <RefreshControl
                        refreshing={isLoadingAreas}
                        onRefresh={() => setRefetch(!refetch)}
                      />
                    }
                  >
                    {filteredAreas?.map((item, index) => (
                      <PressableRow
                        key={item?.id}
                        align={'center'}
                        onPress={() => setSelected(item)}
                        width={`${width - 48}px`}
                        paddingTop={14}
                        paddingBottom={14}
                        marginBottom={2}
                        style={{ height: 50 }}
                      >
                        <CustomText
                          style={{ height: 22, alignSelf: 'center' }}
                          top={3}
                          fontSize={13}
                          fontFamily={fonts.PoppinsRegular}
                        >
                          {item?.name}
                        </CustomText>
                        {selected?.id == item?.id && <TickSvg />}
                      </PressableRow>
                    ))}
                  </ScrollView>
                  <Button
                    top={20}
                    onPress={closeModal}
                    text={'Select'}
                    textColor={COLORS.primary}
                    bgColor={COLORS.white}
                    style={{
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                    }}
                  />
                </Col>
              )}
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default SelectStateModal;
