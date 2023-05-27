import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import SafeAreaWrap from '../../../components/SafeAreaWrap/SafeAreaWrap';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';
import LoadingScreen from '../../../components/LoadingScreen';
import fonts from '../../../constants/fonts';
import CustomText from '../../../components/CustomText/CustomText';
import { COLORS } from '../../../constants/colors';
import {
  Col,
  PressableCol,
  PressableRow,
  Row,
} from '../../../components/CustomGrid/CustomGrid';
import { useDispatch, useSelector } from 'react-redux';
import ChevronRightSvg from '../../../assets/svgs/chevron-right.svg';
import ProfileSvg from '../../../assets/svgs/profile-menu.svg';
import NotificationsSvg from '../../../assets/svgs/notification-menu.svg';
import SavedItemsSvg from '../../../assets/svgs/saved-item-menu.svg';
import DeliveryAreaSvg from '../../../assets/svgs/delivery-area-menu.svg';
import Pay4MeSvg from '../../../assets/svgs/pay4me-menu.svg';
import ChangePasswordSvg from '../../../assets/svgs/change-password-menu.svg';
import VoucherSvg from '../../../assets/svgs/voucher-menu.svg';
import PrivacyPolicySvg from '../../../assets/svgs/privacy-policy-menu.svg';
import TermsAndConditionsSvg from '../../../assets/svgs/terms-and-conditions-menu.svg';
import ContactUsSvg from '../../../assets/svgs/contact-us-menu.svg';
import AboutUsSvg from '../../../assets/svgs/about-us-menu.svg';
import EmptyDpSvg from '../../../assets/svgs/emptyDp.svg';
import LogoutSvg from '../../../assets/svgs/logout.svg';
import Button from '../../../components/Button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SearchInput from '../../../components/Input/SearchInput';
import { NairaSign } from '../../../constants/text';
import LogoutModal from '../../components/LogoutModal';
const sampleProductImage = require('../../../assets/svgs/mango.png');

const Account = ({ navigation }) => {
  const dispatch = useDispatch();
  const { countries, country, user } = useSelector((state) => state.userAuth);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const options = [
    { route: 'Profile', name: 'Profile', icon: <ProfileSvg />, id: 1 },
    {
      route: 'Notifications',
      name: 'Notifications',
      icon: <NotificationsSvg />,
      id: 2,
    },
    {
      route: 'SavedItems',
      name: 'Saved Items',
      icon: <SavedItemsSvg />,
      id: 3,
    },
    // {
    //   route: 'DeliveryArea',
    //   name: 'Delivery Address',
    //   icon: <DeliveryAreaSvg />,
    //   id: 4,
    // },
    // { route: 'Pay4Me', name: 'Pay4Me', icon: <Pay4MeSvg />, id: 5 },
    // { route: 'Voucher', name: 'Vouchers', icon: <VoucherSvg />, id: 6 },
    {
      route: 'ChangePassword',
      name: 'Change Password',
      icon: <ChangePasswordSvg />,
      id: 7,
    },
    {
      route: 'PrivacyPolicy',
      name: 'Privacy Policy',
      icon: <PrivacyPolicySvg />,
      id: 8,
    },
    {
      route: 'TermsAndConditions',
      name: 'Terms And Conditions',
      icon: <TermsAndConditionsSvg />,
      id: 9,
    },
    { route: 'ContactUs', name: 'Contact Us', icon: <ContactUsSvg />, id: 10 },
    { route: 'AboutUs', name: 'About Us', icon: <AboutUsSvg />, id: 11 },
  ];

  const ItemCard = ({ item, index, onPress, cartItems }) => (
    <PressableRow
      paddingHorizontal={18}
      onPress={() => navigation.navigate(item?.route)}
      borderRadius={5}
      marginBottom={5}
    >
      <View
        style={{
          flexDirection: 'row',
          height: 48,
          alignItems: 'center',
        }}
      >
        {item?.icon}
        <CustomText
          color={COLORS.black}
          align="center"
          fontSize={13}
          left={10}
          fontFamily={fonts.MontserratRegular}
        >
          {item?.name}
        </CustomText>
      </View>
      <ChevronRightSvg />
    </PressableRow>
  );

  const renderItem = ({ item, index }) => {
    return <ItemCard item={item} index={index} />;
  };

  return (
    <>
      <SafeAreaWrap
        style={{
          paddingTop: 20,
          paddingBottom: 20,
        }}
        bgColor={COLORS.mainBg}
      >
        <Row paddingLeft={24} paddingRight={24} paddingBottom={16}>
          <View>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={16}
              top={3}
              fontFamily={fonts.PoppinsSemiBold}
            >
              Account
            </CustomText>
            <CustomText
              color={COLORS.black}
              align="left"
              fontSize={13}
              top={3}
              fontFamily={fonts.MontserratRegular}
            >
              {user?.email}
            </CustomText>
          </View>
          {user?.picture ? (
            <Image
              source={{ uri: user?.picture }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              resizeMode="cover"
            />
          ) : (
            <EmptyDpSvg />
          )}
        </Row>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => setRefetch(true)}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 5,
            marginBottom: 25,
          }}
          ListFooterComponent={
            <PressableRow
              justify={'center'}
              height={48}
              onPress={() => setLogoutVisible(true)}
            >
              <LogoutSvg />
              <CustomText
                color={COLORS.primary}
                align="left"
                fontSize={16}
                top={1}
                left={10}
                fontFamily={fonts.PoppinsSemiBold}
              >
                Log out
              </CustomText>
            </PressableRow>
          }
        />
      </SafeAreaWrap>
      <LogoutModal visible={logoutVisible} setVisible={setLogoutVisible} />
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  counterInput: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    maxWidth: 42,
    minWidth: 25,
    textAlign: 'center',
    color: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
  },
});
