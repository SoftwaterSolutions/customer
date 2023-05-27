import React, {useState} from 'react';
import {useEffect} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import styled from 'styled-components';
import ChevDown from '../../assets/svgs/dropdown.svg';
import {COLORS} from '../../constants/colors';
import CustomText from '../CustomText/CustomText';
import {SvgUri} from 'react-native-svg';
import fonts from '../../constants/fonts';

const Container = styled.View`
  align-items: flex-start;
  margin-top: ${props => props?.marginTop || 0}px;
`;
const Wrapper = styled.View`
  height: 50px;
  width: ${props => props?.width || 100}%;
  border-width: 1px;
  border-color: ${props =>
    props?.active ? COLORS?.primary : COLORS?.inputBorder};
  border-radius: 4px;
  background-color: ${props => COLORS?.inputBg};
  flex-direction: row;
  align-items: center;
  margin-top: ${props => props?.marginTop || 0}px;
  padding-horizontal: 12px;
  z-index: 200;
`;

const Flag = styled.Image`
  height: 12px;
  width: 16px;
`;

const CountryCodeWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: ${props => props?.width || '25%'};
  height: ${props => props?.height || '30px'};
  z-index: 2000;
`;

const TextInput = styled.TextInput`
  height: 100%;
  border-left-width: 1px;
  border-left-color: ${COLORS?.inputBorder};
  width: 75%;
  padding-left: 16px;
  font-family: ${fonts?.PoppinsRegular};
  font-size: 13px;
  font-weight: 400;
  color: ${COLORS?.black};
  align-items: center;
`;

const PhoneInput = ({
  val,
  label = 'Phone number',
  marginTop = 0,
  placeholder = '',
  placeholderTextColor = COLORS.placeHolder,
  inputType = 'default',
  countries = [],
  handleChange = () => {},
  onCountrySelect = () => {},
}) => {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState({
    name: 'Nigeria',
    id: 2,
    phoneCode: '+234',
    imageUrl:
      'https://res.cloudinary.com/drpsbqyn8/image/upload/v1667651401/Kloud%20Depot/Countries/Country_Nigeria_xdjkmr.svg',
  });
  const [svgUri, setSvgUri] = useState(countries?.[0]?.imageUrl);
  useEffect(() => {
    if (countries.length) {
      setValue(countries[0]);
      onCountrySelect(countries[0]);
    }
  }, [countries]);

  return (
    <Container marginTop={marginTop}>
      <CustomText
        color={COLORS.black}
        align='left'
        fontSize={12}
        bottom={5}
        fontFamily={fonts.PoppinsMedium}>
        {label}
      </CustomText>
      <Wrapper active={focused}>
        <CountryCodeWrap onPress={() => setVisible(!visible)}>
          {value?.name === 'Nigeria' && (
            <SvgUri width={'16px'} height={'16px'} uri={value.imageUrl} />
          )}
          {value?.name === 'Ghana' && (
            <SvgUri width={'16px'} height={'16px'} uri={value.imageUrl} />
          )}
          <CustomText
            color={COLORS.grey_3}
            align='left'
            fontWeight={500}
            fontSize={14}
            left={4}
            right={4}
            fontFamily={fonts.PoppinsRegular}>
            {value?.phoneCode}
          </CustomText>
          <ChevDown />
        </CountryCodeWrap>
        {visible && (
          <View style={styles.modalContainer}>
            {countries.map((x, index) => {
              return (
                <CountryCodeWrap
                  key={x?.id}
                  width={'100%'}
                  height={'40px'}
                  onPress={() => {
                    onCountrySelect(x);
                    setValue(x);
                    setSvgUri(x?.imageUrl);
                    setVisible(!visible);
                  }}>
                  <SvgUri width={'16px'} height={'16px'} uri={x?.imageUrl} />

                  <CustomText
                    color={COLORS.grey_3}
                    align='left'
                    fontWeight={500}
                    fontSize={14}
                    left={4}
                    right={4}
                    fontFamily={fonts.PoppinsRegular}>
                    {x?.phoneCode}
                  </CustomText>

                  <ChevDown />
                </CountryCodeWrap>
              );
            })}
          </View>
        )}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={inputType}
          onChangeText={e => {
            handleChange(e);
          }}
          value={val}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Wrapper>
    </Container>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS?.white,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 10,
    top: 55,
    shadowColor: '#171717',
    ...Platform.select({
      ios: {
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
      default: {
        elevation: 20,
      },
    }),
  },
});
