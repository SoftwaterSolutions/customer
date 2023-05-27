import React, { useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { COLORS } from '../../constants/colors';
import fonts from '../../constants/fonts';
import CustomText from '../CustomText/CustomText';
import styled from 'styled-components';

const Container = styled.View`
  align-items: flex-start;
  margin-top: ${(props) => props?.marginTop || 0}px;
  width: ${(props) => props?.width || '100%'};
  padding-left: ${(props) => props?.paddingLeft || '0px'};
  padding-right: ${(props) => props?.paddingRight || '0px'};
  z-index: ${(props) => props?.zIndex || 10};
`;

const DropdownInput = ({
  marginTop = 0,
  marginBottom = 0,
  label = '',
  multiple = false,
  min,
  max,
  placeholder = 'Select an item',
  placeholderTextColor = COLORS.placeHolder,
  onSelectItem = () => {},
  options,
  setOptions,
  value,
  setValue,
  zIndex = 2000,
  loading,
  errors = '',
  width,
  modalHeight = 200,
  paddingLeft,
  paddingRight,
  dropDownDirection,
  dropDownContainerStyle,
  style,
  maxHeight = 200,
  props,
  listMode = 'MODAL',
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Container
        marginTop={marginTop}
        marginBottom={marginBottom}
        width={width}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        zIndex={zIndex}
      >
        {label && (
          <CustomText
            color={COLORS.black}
            align="left"
            fontSize={12}
            bottom={5}
            fontFamily={fonts.PoppinsMedium}
          >
            {label}
          </CustomText>
        )}
        <DropDownPicker
          open={open}
          value={value}
          items={options}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setOptions}
          onSelectItem={onSelectItem}
          zIndex={zIndex}
          placeholder={placeholder}
          placeholderStyle={{ color: placeholderTextColor }}
          style={[
            styles.container,
            {
              borderColor: open ? COLORS?.primary : COLORS?.inputBorder,
              backgroundColor: disabled ? COLORS?.white : COLORS?.inputBg,
            },
            style,
          ]}
          textStyle={styles.text}
          labelStyle={styles.label}
          dropDownContainerStyle={[
            styles.dropDownContainer,
            dropDownContainerStyle,
          ]}
          listItemLabelStyle={styles.listItemLabel}
          listItemContainerStyle={styles.listItemContainer}
          listMode={listMode}
          dropDownDirection={dropDownDirection}
          itemSeparator={true}
          itemSeparatorStyle={styles.itemSeparator}
          searchable={true}
          searchTextInputStyle={styles.searchInput}
          searchContainerStyle={styles.searchContainer}
          loading={loading}
          multiple={multiple}
          min={min}
          max={max}
          maxHeight={maxHeight}
          disabled={disabled}
          modalHeight={modalHeight}
          showArrowIcon={!disabled}
          modalContentContainerStyle={{
            backgroundColor: '#fff',
            height: '50%',
          }}
          {...props}
        />
        {errors.length > 0 && (
          <CustomText
            fontWeight="400"
            fontSize={11}
            style={{ marginTop: 5 }}
            color={COLORS.error}
          >
            {errors}
          </CustomText>
        )}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  text: {
    color: COLORS.greyPlaceholderTextColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 13,
    fontWeight: '400',
  },
  label: {
    color: COLORS.black,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 13,
    fontWeight: '400',
  },
  dropDownContainer: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  listItemLabel: {
    color: COLORS.black,
    fontFamily: fonts.PoppinsRegular,
    fontSize: 13,
    fontWeight: '400',
  },
  listItemContainer: {
    height: 50,
  },
  itemSeparator: {
    backgroundColor: COLORS.inputBorder,
  },
  searchInput: {
    height: 30,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    borderWidth: 0,
  },
  searchContainer: {
    borderBottomColor: COLORS.inputBorder,
  },
});

export default DropdownInput;
