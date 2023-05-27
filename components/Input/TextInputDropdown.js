import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styled from 'styled-components';
import {COLORS} from '../../constants/colors';
import Fonts from '../../constants/fonts';

const Wrapper = styled.View`
  height: 56px;
  width: ${props => props?.width || 100}%;
  border-width: 1px;
  border-color: ${props => (props?.active ? COLORS?.primary : COLORS?.border)};
  border-radius: 4px;
  background-color: ${props =>
    props?.active ? COLORS.primary_bg : COLORS?.white};
  flex-direction: row;
  align-items: center;
  margin-top: ${props => props?.marginTop || 0}px;
  z-index: 99;
`;

const TextInput = styled.TextInput`
  height: 100%;
  width: 75%;
  padding-left: 16px;
  font-family: ${Fonts?.PoppinsRegular};
  font-size: 14px;
  font-weight: 400;
  color: ${COLORS?.black};
  align-items: center;
`;

const TextInputDropDown = ({
  marginTop = 0,
  placeholder = '',
  dropDownPlaceholder = '',
  placeholderTextColor = COLORS.greyPlaceholderTextColor,
  inputType = 'default',
  loadingDropdown = true,
  items = [],
  setItems = () => {},
  handleChange = () => {},
  handleSelect = () => {},
  val,
  value = [],
  setValue = () => {},
}) => {
  const [focused, setFocused] = useState(false);

  const [open, setOpen] = useState(false);

  return (
    <Wrapper active={focused} marginTop={marginTop}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={inputType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={e => handleChange(e)}
        value={val}
      />
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onSelectItem={e => handleSelect(e)}
        placeholder={dropDownPlaceholder}
        style={[
          styles.container,
          {backgroundColor: focused ? COLORS?.transparent : COLORS.white},
        ]}
        textStyle={styles.text}
        labelStyle={styles.label}
        dropDownContainerStyle={styles.dropDownContainer}
        listItemLabelStyle={styles.listItemLabel}
        listItemContainerStyle={styles.listItemContainer}
        listMode='SCROLLVIEW'
        itemSeparator={true}
        itemSeparatorStyle={styles.itemSeparator}
        searchable={false}
        searchTextInputStyle={styles.searchInput}
        searchContainerStyle={styles.searchContainer}
        loading={loadingDropdown}
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 110,
    borderWidth: 0,
    left: -24,
  },
  text: {
    color: COLORS.greyPlaceholderTextColor,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  label: {
    color: COLORS.black,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  dropDownContainer: {
    position: 'absolute',
    left: -24,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 214,
    backgroundColor: COLORS.white,
    width: 110,
  },
  listItemLabel: {
    color: COLORS.black,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'right',
  },
  listItemContainer: {
    height: 48,
    zIndex: 99,
  },
  itemSeparator: {
    backgroundColor: COLORS.border,
  },
  searchInput: {
    height: 46,
    borderRadius: 4,
    backgroundColor: COLORS.scroll,
    borderWidth: 0,
  },
  searchContainer: {
    borderBottomColor: COLORS.border,
  },
});

export default TextInputDropDown;
