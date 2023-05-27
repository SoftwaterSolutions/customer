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
  FlatList,
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
import {
  useGetAllAreasMutation,
  useGetAreasMutation,
} from '../../redux/features/user/userApi';
import { saveToUserStore } from '../../redux/features/user/userSlice';
import { useToast } from 'react-native-toast-notifications';
import { saveArea } from '../../redux/features/auth/authSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import DropdownInput from '../../components/Input/DropdownInput';
import { removeDuplicates, sortByProperty } from '../../helpers/formatArray';

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

const SelectAreaModal = ({ visible, setVisible }) => {
  const { height, width } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const [searchValue, setSearchValue] = useState('');
  const [refetch, setRefetch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { area, user, country } = useSelector((state) => state.userAuth);
  const { areas } = useSelector((state) => state.userStore);

  const [id, setId] = useState(null);
  const [selected, setSelected] = useState(area?.name || null);
  const dispatch = useDispatch();
  const [states, setStates] = useState([]);

  const [stateId, setStateId] = useState(null);
  const toast = useToast();

  const [getAreas, { isLoading: isLoadingAreas }] = useGetAreasMutation();
  const [getAllAreas, { isLoading: isLoadingAllAreas }] =
    useGetAllAreasMutation();

  const fetchAreas = async () => {
    const res = await getAllAreas();
    if (res?.data?.status === 'success') {
      dispatch(
        saveToUserStore({
          key: 'areas',
          value: res.data?.data?.filter((x) => {
            return !!x?.status;
          }),
        })
      );
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

  useEffect(() => {
    setStates(
      removeDuplicates(
        areas?.map((x) => {
          return x?.state_name;
        })
      )?.map((x) => {
        return { label: x, value: x, id: x };
      })
    );
    setStateId(
      removeDuplicates(
        areas?.map((x) => {
          return x?.state_name;
        })
      )[0]
    );
  }, [country, areas]);

  useEffect(() => {
    if (visible) {
      setSearchValue('');
      Animated.spring(translateY, {
        toValue: 20,
        delay: 50,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    if (id) {
      Animated.spring(translateY, {
        toValue: height,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setTimeout(async () => {
        await dispatch(saveArea(filteredAreas.find((x) => x?.id === id)));
        setVisible(false);
      }, 300);
    }
  };
  const filteredAreas = useMemo(() => {
    let filtered = areas || [];
    filtered = filtered?.filter((x) => {
      return x?.status;
    });
    if (stateId?.length > 0 && stateId !== '') {
      filtered = filtered?.filter((x) => x?.state_name == stateId);
    }
    if (searchValue !== '' && searchValue?.length > 0) {
      filtered = filtered?.filter(
        (x) =>
          x?.name?.toLowerCase().includes(searchValue?.toLowerCase()) ||
          x?.lga?.toLowerCase().includes(searchValue?.toLowerCase())
      );
    }
    filtered = sortByProperty(filtered, 'name');
    return filtered;
  }, [searchValue, stateId, areas, states]);

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
              <DropdownInput
                placeholder="State/Province"
                options={states}
                setOptions={setStates}
                setValue={setStateId}
                value={stateId}
                onSelectItem={(e) => setStateId(e.value)}
                zIndex={5}
                loading={true}
                label=""
                marginBottom={15}
                dropDownDirection="BOTTOM"
                listMode="SCROLLVIEW"
                maxHeight={200}
              />
              {stateId ? (
                <>
                  {(isLoadingAreas || isLoadingAllAreas) && !refreshing ? (
                    <Loader style={{ height: height / 2 }} />
                  ) : filteredAreas?.length == 0 && !searchValue ? (
                    <>
                      <PressableRow
                        align={'flex-start'}
                        justify={'center'}
                        width={`${width - 48}px`}
                        marginTop={14}
                        marginBottom={14}
                        style={{ height: height / 2 }}
                      >
                        <CustomText
                          fontSize={13}
                          align="center"
                          fontFamily={fonts.PoppinsRegular}
                        >
                          We are not yet available in this state/province
                        </CustomText>
                        {/* <CustomText
                          fontSize={13}
                          fontFamily={fonts.PoppinsRegular}
                        >
                          Shopping
                        </CustomText> */}
                      </PressableRow>
                    </>
                  ) : (
                    // <Col align={'flex-start'} marginTop={10} height={200}>
                    <>
                      <SearchInput
                        placeholder="Search"
                        handleChange={(val) => setSearchValue(val)}
                        value={searchValue}
                        filtered={false}
                      />
                      <Col
                        style={{ maxHeight: height / 2 }}
                        marginTop={10}
                        marginBottom={40}
                      >
                        <FlatList
                          data={filteredAreas}
                          renderItem={({ item, index }) => {
                            return (
                              <PressableRow
                                key={item?.id}
                                align={'center'}
                                onPress={() => {
                                  setId(item?.id);
                                }}
                                width={`${width - 48}px`}
                                paddingTop={14}
                                paddingBottom={14}
                                marginBottom={2}
                                style={{ height: 50 }}
                              >
                                <CustomText
                                  style={{ height: 22, alignSelf: 'center' }}
                                  color={
                                    id == item?.id
                                      ? COLORS.primary
                                      : COLORS.black
                                  }
                                  top={3}
                                  fontSize={13}
                                  fontFamily={fonts.PoppinsRegular}
                                >
                                  {`${item?.name} (${item?.lga})`}
                                </CustomText>
                                {id == item?.id && <TickSvg />}
                              </PressableRow>
                            );
                          }}
                          showsVerticalScrollIndicator={false}
                          refreshControl={
                            <RefreshControl
                              refreshing={isLoadingAreas || isLoadingAllAreas}
                              onRefresh={() => setRefetch(!refetch)}
                            />
                          }
                        />
                        {/* <ScrollView
                          showsVerticalScrollIndicator={false}
                          refreshControl={
                            <RefreshControl
                              refreshing={isLoadingAreas || isLoadingAllAreas}
                              onRefresh={() => setRefetch(!refetch)}
                            />
                          }
                        >
                          {filteredAreas?.map((item, index) => (
                            <PressableRow
                              key={item?.id}
                              align={'center'}
                              onPress={() => {
                                setId(item?.id);
                                // setSelected(item);
                              }}
                              width={`${width - 48}px`}
                              paddingTop={14}
                              paddingBottom={14}
                              marginBottom={2}
                              style={{ height: 50 }}
                            >
                              <CustomText
                                style={{ height: 22, alignSelf: 'center' }}
                                color={
                                  id == item?.id ? COLORS.primary : COLORS.black
                                }
                                top={3}
                                fontSize={13}
                                fontFamily={fonts.PoppinsRegular}
                              >
                                {`${item?.name} (${item?.lga})`}
                              </CustomText>
                              {id == item?.id && <TickSvg />}
                            </PressableRow>
                          ))}
                        </ScrollView> */}
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
                          disabled={!id}
                        />
                      </Col>
                    </>
                  )}
                </>
              ) : (
                <Row marginBottom={200}>
                  <CustomText
                    align={'left'}
                    fontSize={13}
                    fontFamily={fonts.PoppinsRegular}
                  >
                    Select a state/province
                  </CustomText>
                </Row>
              )}
            </WhiteBg>
          </Animated.View>
        </BlackBg>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default SelectAreaModal;
