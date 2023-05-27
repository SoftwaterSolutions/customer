import { FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeAreaWrap from '../../../../components/SafeAreaWrap/SafeAreaWrap';

import fonts from '../../../../constants/fonts';
import CustomText from '../../../../components/CustomText/CustomText';
import { COLORS } from '../../../../constants/colors';
import { Col, Row } from '../../../../components/CustomGrid/CustomGrid';
import { useDispatch, useSelector } from 'react-redux';
import LeftArrow from '../../../../assets/svgs/leftArrow.svg';
import FaceBookSvg from '../../../../assets/svgs/facebook.svg';
import TwitterSvg from '../../../../assets/svgs/twitter.svg';
import EmailSvg from '../../../../assets/svgs/email.svg';

const ContactUs = ({ navigation }) => {
  const dispatch = useDispatch();
  const { countries, country } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const contacts = [
    { title: 'helpdesk@fooddy.com', icon: <EmailSvg />, id: 1 },
    { title: '@fooddyOfficial', icon: <TwitterSvg />, id: 2 },
    { title: 'FooddyCustomerCare', icon: <FaceBookSvg />, id: 3 },
  ];

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  const ItemCard = ({ item, index, onPress }) => (
    <Row
      justify={'flex-start'}
      align={'center'}
      style={{ height: 48 }}
      paddingLeft={12}
      paddingRight={12}
      borderRadius={5}
      marginBottom={5}
    >
      {item?.icon}
      <CustomText
        color={COLORS.black}
        align="left"
        left={15}
        top={3}
        fontSize={14}
        fontFamily={fonts.PoppinsRegular}
      >
        {item?.title}
      </CustomText>
    </Row>
  );

  const Header = () => {
    return (
      <Col paddingHorizontal={15} paddingBottom={16}>
        <Row>
          <Row justify={'flex-start'} align={'center'}>
            <LeftArrow marginRight={15} onPress={() => navigation.goBack()} />
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={16}
              top={1}
              fontFamily={fonts.PoppinsMedium}
            >
              Contact us
            </CustomText>
          </Row>
        </Row>
      </Col>
    );
  };

  const PageContent = ({ item, index }) => {
    return (
      <>
        <FlatList
          data={contacts}
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

export default ContactUs;

const styles = StyleSheet.create({});
