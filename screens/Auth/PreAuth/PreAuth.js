import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import styled from 'styled-components';
import FoodStuff from '../../../assets/svgs/toppng 1.svg';
import PackageArrived from '../../../assets/svgs/undraw_package_arrived.svg';
import LogoSvg from '../../../assets/svgs/logo.svg';
import LogoSmallSvg from '../../../assets/svgs/logo_small.svg';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../../constants/colors';
import LoadingScreen from '../../../components/LoadingScreen';
import Button from '../../../components/Button/Button';

export default function PreAuth({ navigation }) {
  const window = useWindowDimensions();

  const slides = [
    {
      key: 1,
      logoIcon: true,
      title: 'Order Your Favourite Groceries Here',
      subtitle: 'Get fresh and tasty groceries. ',
      image: <FoodStuff />,
      backgroundColor: COLORS.white,
      // lastPage: false,
    },
    {
      key: 2,
      logoIcon: true,
      title: 'Delivery To Your Doorstep',
      subtitle: 'Fast and smooth delivery to your home',
      image: <PackageArrived />,
      backgroundColor: COLORS.white,
      // lastPage: false,
    },
    {
      key: 3,
      logoIcon: false,
      logo: <LogoSvg />,
      image: <FoodStuff width={window.width} />,
      backgroundColor: COLORS.white,
      lastPage: true,
    },
  ];

  const renderItem = ({ item }) => {
    return item.logoIcon === true ? (
      <View style={styles.safeArea}>
        {item.logoIcon && <LogoSmallSvg style={styles.logoIcon} />}
        <View style={{ flex: 1, marginBottom: 120 }}>
          <View style={styles.btm}>
            {item.image && item.image}
            {item.title && <Text style={styles.title}>{item.title}</Text>}
            {item.subtitle && (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
      </View>
    ) : (
      <View style={styles.paddedCenterView}>
        <View style={styles.top}>
          <View style={[styles.center, { marginTop: 50 }]}>{item.logo}</View>
        </View>
        <View style={styles.btm}>
          <View style={[styles.center, { marginBottom: 50 }]}>
            {item.image}
          </View>
          <View style={{ marginHorizontal: 24 }}>
            <Button
              text={'Sign in'}
              style={{ marginBottom: 15 }}
              onPress={() => navigation.navigate('SignIn')}
            />
            <Button
              text={'Sign up'}
              style={{
                marginBottom: 40,
                borderColor: COLORS.primary,
                borderWidth: 1,
              }}
              textColor={COLORS.primary}
              bgColor={COLORS.white}
              onPress={() => navigation.navigate('SignUp')}
            />
          </View>
        </View>
      </View>
    );
  };

  const keyExtractor = (item) => item.key;

  const renderPagination = (activeIndex) => {
    if (activeIndex === 2) {
      return <></>;
    }
    return (
      <View>
        <View style={[styles.paginationContainer]}>
          <View style={styles.paginationDots}>
            {slides.length > 0 &&
              [slides[0], slides[1], slides[2]]
                // .filter((item) => item.logoIcon !== false)
                .map((item, i) => (
                  <View
                    key={i}
                    style={
                      i === activeIndex
                        ? [
                            styles.activeDot,
                            { backgroundColor: COLORS.primary },
                          ]
                        : [
                            styles.dot,
                            { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
                          ]
                    }
                  />
                ))}
          </View>
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            height: 45,
            width: 100,
            backgroundColor: COLORS.primary,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            ...styles.center,
          }}
          onPress={() => navigation.navigate('Intro')}
        >
          <Text
            style={{
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <StatusBar style="dark" />
      <AppIntroSlider
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={slides}
        renderPagination={renderPagination}
        // renderNextButton={renderNextButton}
        // onDone={() => navigation.navigate('Intro')}
        // dotStyle={{backgroundColor:COLORS.gray_1,}}
        // activeDotStyle={{backgroundColor:COLORS.primary}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  paddedCenterView: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    position: 'absolute',
    top: 60,
    flex: 1,
  },
  btm: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 74,
    backgroundColor: COLORS.white,
  },
  statusbar: {
    height: 40,
  },
  activeDot: {
    width: 30,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.black,
    paddingVertical: 10,
    marginTop: 30,
  },
  subtitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.gray_1,
    fontStyle: 'normal',
    marginBottom: 16,
  },
  desc: {
    // ...FONTS.h3,
    color: COLORS.subtitle,
    paddingVertical: 10,
  },
  logo: {
    marginBottom: 30,
  },
  logoIcon: {
    marginBottom: 54,
  },
  redBtn: {
    width: 312,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.mainBg,
  },
  blackBtn: {
    width: 312,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
  btnTxt: {
    // ...FONTS.btn,
    color: COLORS.white,
  },
});
