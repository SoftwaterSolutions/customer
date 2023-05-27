import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeAreaWrap from '../../../../components/SafeAreaWrap/SafeAreaWrap';

import fonts from '../../../../constants/fonts';
import CustomText from '../../../../components/CustomText/CustomText';
import { COLORS } from '../../../../constants/colors';
import {
  Col,
  PressableCol,
  PressableRow,
  Row,
} from '../../../../components/CustomGrid/CustomGrid';
import { useDispatch, useSelector } from 'react-redux';
import LeftArrow from '../../../../assets/svgs/leftArrow.svg';
import EmptySvg from '../../../../assets/svgs/emptySavedItems.svg';
import SearchSvg from '../../../../assets/svgs/searchYellow.svg';
import SearchInput from '../../../../components/Input/SearchInput';
import CompletedSvg from '../../../../assets/svgs/success_tiny.svg';
import PendingSvg from '../../../../assets/svgs/pending_small.svg';
import Button from '../../../../components/Button/Button';

const Pay4Me = ({ navigation }) => {
  const dispatch = useDispatch();
  const { countries, country } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedList, setSelectedList] = useState('orders');

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  const ItemCard = ({ item, index, onPress, cartItems }) => {
    const rand = Math.random() > 0.4;
    return (
      <PressableCol
        borderRadius={4}
        marginTop={8}
        marginBottom={8}
        padding={15}
        style={{ height: 80 }}
        onPress={() => navigation.navigate('OrderDetails')}
      >
        <Row>
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={13}
            fontFamily={fonts.MontserratMedium}
          >
            Order ID. 123456
          </CustomText>
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={13}
            fontFamily={fonts.MontserratMedium}
          >
            ₦132,000
          </CustomText>
        </Row>
        <Row>
          <CustomText
            color={COLORS.black}
            align="center"
            fontSize={13}
            fontFamily={fonts.PoppinsMedium}
          >
            Status
          </CustomText>
          <View
            style={{
              backgroundColor: rand ? COLORS.greenLight : COLORS.yellowLight,
              flexDirection: 'row',
              paddingVertical: 3,
              paddingHorizontal: 7,
              borderRadius: 15,
            }}
          >
            {rand ? (
              <CompletedSvg marginRight={5} />
            ) : (
              <PendingSvg marginRight={5} />
            )}
            <CustomText
              color={rand ? COLORS.green : COLORS.primary}
              align="left"
              fontSize={11}
              top={3}
              fontFamily={fonts.PoppinsRegular}
            >
              {rand ? 'Completed' : 'Pending'}
            </CustomText>
          </View>
        </Row>
      </PressableCol>
    );
  };

  const EmptyComponent = () => {
    return (
      <Col style={{ flexGrow: 1 }} align={'center'} justify={'center'}>
        <EmptySvg width={200} />
        <CustomText
          color={COLORS.gray_2}
          align="center"
          top={16}
          fontSize={16}
          fontFamily={fonts.PoppinsSemiBold}
        >
          No pay4me request/order yet
        </CustomText>
        <CustomText
          color={COLORS.gray_2}
          align="center"
          fontSize={13}
          top={10}
          bottom={100}
          fontFamily={fonts.PoppinsMedium}
        >
          You can view your pay4me transactions here
        </CustomText>
      </Col>
    );
  };

  const Header = () => {
    return (
      <Col paddingHorizontal={15} paddingBottom={16}>
        <Row>
          <Row justify={'flex-start'} align={'center'} width={'200px'}>
            <LeftArrow marginRight={15} onPress={() => navigation.goBack()} />
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={16}
              top={1}
              fontFamily={fonts.PoppinsMedium}
            >
              Pay4Me
            </CustomText>
          </Row>
          <SearchSvg
            marginRight={10}
            onPress={() => setOpenSearch(!openSearch)}
          />
        </Row>
        {openSearch && (
          <Row marginTop={10}>
            <SearchInput
              placeholder="Search"
              handleChange={(val) => setSearchValue(val)}
              value={searchValue}
              filtered={false}
            />
          </Row>
        )}
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <View style={{ marginHorizontal: 24 }}>
          <Row
            style={{ height: 30 }}
            bgColor={COLORS?.tabBg}
            borderRadius={5}
            marginTop={15}
            marginBottom={10}
          >
            <Button
              text="Orders"
              onPress={() => setSelectedList('orders')}
              height={'30px'}
              width={'50%'}
              textSize={12}
              textColor={
                selectedList === 'orders' ? COLORS?.black : COLORS?.gray_1
              }
              bgColor={
                selectedList === 'orders' ? COLORS?.primary : 'transparent'
              }
              // disabled={!isValid}
            />
            <Button
              text="Request"
              textSize={12}
              onPress={() => setSelectedList('request')}
              height={'30px'}
              width={'50%'}
              textColor={
                selectedList === 'request' ? COLORS?.black : COLORS?.gray_1
              }
              bgColor={
                selectedList === 'request' ? COLORS?.primary : 'transparent'
              }
              // disabled={!isValid}
            />
          </Row>
        </View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => setRefetch(true)}
          contentContainerStyle={{
            marginHorizontal: 15,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          ListEmptyComponent={<EmptyComponent />}
        />
      </>
    );
  };

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
        }}
        bgColor={COLORS.mainBg}
      >
        <Header />
        <PageContent />
      </SafeAreaWrap>
    </>
  );
};

export default Pay4Me;

const styles = StyleSheet.create({});
