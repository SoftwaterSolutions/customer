/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import fonts from '../../constants/fonts';
import CustomText from '../CustomText/CustomText';
import SearchIcon from '../../assets/svgs/searchYellow.svg';
import SearchFilter from '../../assets/svgs/searchFilter.svg';
import CloseSvg from '../../assets/svgs/cross-circle.svg';
import FilterModal from '../Filter/FilterModal';

const Wrapper = styled.View`
  height: 45px;
  border-width: 1px;
  border-color: ${(props) =>
    props?.active ? COLORS?.primary : COLORS?.inputBg};
  border-radius: 5px;
  background-color: ${(props) => COLORS?.inputBgLight};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => props?.marginTop || 0}px;
  padding-horizontal: 12px;
  flex-grow: 1;
`;

const TextWrap = styled.TextInput`
  height: 100%;
  font-family: ${fonts?.PoppinsRegular};
  font-size: 13px;
  color: ${COLORS?.inputBorder};
  align-items: center;
  flex-grow: 1;
`;

const Container = styled.View`
  align-items: flex-start;
  margin-top: ${(props) => props?.marginTop || 0}px;
  flex-grow: 1;
`;

const SearchInput = ({
  marginTop = 0,
  placeholder = '',
  placeholderTextColor = COLORS.placeHolderLight,
  inputType = 'default',
  returnValue = true,
  handleChange = () => {},
  value,
  filtered = true,
  setFilterVisible = () => {},
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <Container marginTop={marginTop}>
      <Wrapper active={focused}>
        <SearchIcon marginRight={10} />
        <TextWrap
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          keyboardType={inputType}
          onChangeText={
            returnValue
              ? (e) => {
                  handleChange(e);
                }
              : handleChange('name')
          }
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
          }}
          value={value}
        />
        {value && (
          <CloseSvg marginRight={10} onPress={() => handleChange('')} />
        )}
        {filtered && <SearchFilter onPress={() => setFilterVisible(true)} />}
      </Wrapper>
    </Container>
  );
};

export default SearchInput;
