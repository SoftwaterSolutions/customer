import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import styled from 'styled-components';
import ChevDown from '../../assets/svgs/dropdown.svg';
import { COLORS } from '../../constants/colors';
import CustomText from '../CustomText/CustomText';
import { SvgUri } from 'react-native-svg';
import fonts from '../../constants/fonts';
import CountryModal from '../../screens/Auth/components/CountryModal';
import ChangeCountryModal from '../../screens/components/ChangeCountryModal';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useGetCountriesMutation } from '../../redux/features/auth/authApi';
import {
  saveCountries,
  saveCountry,
} from '../../redux/features/auth/authSlice';
import { setCountryList } from '../../redux/features/external/externalSlice';
import { Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const Wrapper = styled.TouchableOpacity`
  height: 32px;
  width: ${(props) => props?.width || 60}px;
  border-width: 1px;
  border-color: ${(props) =>
    props?.active ? COLORS?.primary : COLORS?.inputBorder};
  border-radius: 4px;
  background-color: ${(props) =>
    props?.active ? 'rgba(154, 226, 254, 0.1)' : COLORS?.white};
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props?.marginTop || 0}px;
  padding-horizontal: 12px;
  z-index: 200;
`;

const Flag = styled.Image`
  height: 12px;
  width: 16px;
`;

const CountryCodeWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${(props) => props?.width || '25%'};
  height: ${(props) => props?.height || '30px'};
  z-index: 2000;
`;

const TextInput = styled.TextInput`
  height: 100%;
  border-left-width: 1px;
  border-left-color: ${COLORS?.border};
  width: 75%;
  padding-left: 16px;
  font-family: ${fonts?.PoppinsRegular};
  font-size: 14px;
  font-weight: 400;
  color: ${COLORS?.black};
  align-items: center;
`;

const CountrySelect = ({
  marginTop = 0,
  visible,
  setVisible,
  disabled,
  reset,
}) => {
  const dispatch = useDispatch();
  const { countries, country, user } = useSelector((state) => state.userAuth);
  const isFocused = useIsFocused();
  const [getCountries, { isLoading }] = useGetCountriesMutation();

  const fetchCountries = async () => {
    const res = await getCountries({ status: true });
    if (res?.data?.status === 'success') {
      console.log(res?.data?.data);
      dispatch(saveCountries(res?.data?.data));
    }
  };

  useEffect(() => {
    (reset || visible) && fetchCountries();
  }, [isFocused, visible, reset]);

  useEffect(() => {
    dispatch(
      saveCountry(
        country
          ? countries?.find(
              (ctry) =>
                ctry?.name?.toLowerCase() == country?.name?.toLowerCase()
            )
          : countries?.find((ctry) => ctry?.name?.toLowerCase() == 'nigeria')
      )
    );
  }, [countries, user?.country]);

  const value = useMemo(() => {
    let filtered = country;
    return filtered || [];
  }, [countries, country, user]);

  return (
    <>
      <Wrapper
        active={visible}
        marginTop={marginTop}
        onPress={() => setVisible(!visible)}
      >
        <CountryCodeWrap>
          {isLoading ? (
            <ActivityIndicator size={20} color={COLORS.primary} />
          ) : value?.flags?.png ? (
            <Image
              style={{ width: 20, height: 10 }}
              source={{ uri: value?.flags?.png }}
            />
          ) : value?.flags?.svg ? (
            <SvgUri width={'20px'} height={'16px'} uri={value?.flags?.svg} />
          ) : (
            <></>
          )}
          <ChevDown marginLeft={5} />
        </CountryCodeWrap>
      </Wrapper>
      {disabled ? (
        <ChangeCountryModal visible={visible} setVisible={setVisible} />
      ) : (
        <CountryModal visible={visible} setVisible={setVisible} />
      )}
    </>
  );
};

export default CountrySelect;
