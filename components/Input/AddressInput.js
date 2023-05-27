/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {CloseSvg, LocationSvg} from '../../assets/svg';
import {COLORS} from '../../constants/colors';
import styled from 'styled-components';
import CustomText from '../CustomText/CustomText';
import Fonts from '../../constants/fonts';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
  width: 100%;
`;

const CustomRow = ({data, index}) => {
  return (
    <Row key={index}>
      <LocationSvg />
      <View>
        <CustomText
          color={COLORS.black_4}
          align='left'
          fontWeight={400}
          left={8}
          fontSize={14}
          fontFamily={Fonts.PoppinsRegular}>
          {data.description}
        </CustomText>
        <CustomText
          color={COLORS.greyPlaceholderTextColor}
          align='left'
          fontWeight={400}
          left={8}
          fontSize={12}
          fontFamily={Fonts.PoppinsRegular}>
          {data?.structured_formatting?.secondary_text}
        </CustomText>
      </View>
    </Row>
  );
};

const AddressInput = ({
  placeholder = 'Search',
  marginTop = 16,
  hideFocus = false,
  icon = null,
  onSelectItem = () => {},
  value = '',
  emptyInput = false,
  zIndex = 1000,
  initialValue = {},
}) => {
  const [focused, setFocused] = useState(false);

  const [addressText, setAddressText] = useState(value);
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText(value || initialValue?.address);
  }, []);

  useEffect(() => {
    emptyInput && ref.current?.setAddressText('');
  }, [emptyInput]);

  return (
    <View
      style={{
        position: 'relative',
        zIndex: zIndex,
      }}>
      <GooglePlacesAutocomplete
        ref={ref}
        GooglePlacesSearchQuery={{
          rankby: 'distance',
        }}
        placeholder={placeholder}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          const country = details?.address_components?.filter(x =>
            x?.types.includes('country'),
          )[0].long_name;
          const country_short_name = details?.address_components?.filter(x =>
            x?.types.includes('country'),
          )[0].short_name;
          const {lat, lng} = details?.geometry?.location;
          const address = details?.formatted_address;
          setAddressText(address);
          onSelectItem({lat, lng, address, country, country_short_name});
        }}
        enablePoweredByContainer={false}
        query={{
          key: 'AIzaSyBaKld94OVIQ3ifigG8X02wEfOa4JzVRS4',
          language: 'en',
          types: 'geocode',
        }}
        keyboardShouldPersistTaps='always'
        keepResultsAfterBlur={true}
        textInputProps={{
          autoFocus: false,
          onFocus: () => setFocused(true),
          onBlur: () => {
            setFocused(false);
          },
          onChangeText: text => {
            setAddressText(text);
            onSelectItem({address: text});
          },
          placeholderTextColor: COLORS.greyPlaceholderTextColor,
        }}
        styles={{
          textInputContainer: [{marginTop}],
          textInput: [
            style.container,
            {
              borderColor:
                focused && !hideFocus ? COLORS.primary : COLORS.border,
              backgroundColor:
                focused && !hideFocus ? COLORS.primary_bg : COLORS.white,
              borderWidth: 1,
            },
            {paddingLeft: 16},
            {paddingRight: 16},
          ],
          predefinedPlacesDescription: {
            color: COLORS.greyPlaceholderTextColor,
          },
          listView:
            focused && addressText.length !== 0 ? style.containerWrapper : null,
        }}
        onFail={error => {
          const errorMessage =
            typeof error === 'string'
              ? error
              : (error && error.message) || 'There was an error';

          Alert.alert(
            'Error',
            errorMessage,
            [{text: 'OK', onPress: () => {}}],
            {
              cancelable: false,
            },
          );
        }}
        predefinedPlaces={[]}
        predefinedPlacesAlwaysVisible
        renderRow={(data, index) => {
          return <CustomRow data={data} index={index} />;
        }}
      />
      {icon && icon}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 4,
    borderWidth: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  containerWrapper: {
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    maxHeight: 340,
    position: 'absolute',
    top: 80,
    marginTop: 4,
    backgroundColor: COLORS.white,
  },
});

export default AddressInput;
