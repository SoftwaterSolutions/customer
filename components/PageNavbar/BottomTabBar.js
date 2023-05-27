import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

const getIcon = (label, isFocused) => {
  switch (label) {
    case 'Home':
      return <></>;

    case 'Cart':
      return <></>;

    case 'Notification':
      return <></>;

    default:
      return null;
  }
};

export default function BottomTabBar(props) {
  const {state, descriptors, navigation} = props;

  return (
    <View
      style={bottomTabBarStyles.bottomtabar}
      bg={'bottomBarBg'}
      safeAreaBottom={true}
      alignItems={'center'}
      height={responsiveHeight(90)}
      py={2}
      pb={1}>
      {state.routes.map((route, index) => {
        // @ts-ignore
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            style={bottomTabBarStyles.bottomTabButton}
            key={index}
            accessibilityRole='button'
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            justifyItems={'flex-start'}>
            {getIcon(label, isFocused)}
          </Pressable>
        );
      })}
    </View>
  );
}

const bottomTabBarStyles = StyleSheet.create({
  bottomtabar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    // backgroundColor: '#FFFFFF', //COLORS.layoutContainer,
  },
  bottomTabButton: {
    flex: 1,
    alignItems: 'center',
  },
});
