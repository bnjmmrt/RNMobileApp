import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { ReactNode, useEffect, useRef } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../utils/dimensions';
import { CustomText } from '../CustomText';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { fontFamily } from 'src/utils/functions';

const BottomTabBarComponent: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const labelRefs = useRef<(Animatable.View & View)[]>([]);

  const { showBottomTabs } = useSelector(
    (state: RootState) => ({
      showBottomTabs: state.bottomTabBar.showBottomTabs,
    }),
    shallowEqual,
  );

  useEffect(() => {
    state.routes.forEach((_, index) => {
      const isFocused = state.index === index;
      const animation = isFocused
        ? { 0: { scale: 0 }, 1: { scale: 1 } }
        : { 0: { scale: 1 }, 1: { scale: 0 } };

      labelRefs.current[index]?.animate(animation);
    });
  }, [state.index]);

  return (
    <View
      style={[
        styles.container,
        {
          display: showBottomTabs ? 'flex' : 'none',
        },
      ]}>
      <View style={styles.tabStyle}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.tabButton,
                { backgroundColor: isFocused ? '#fff' : 'transparent' },
                { flex: isFocused ? 1 : 0.6 },
              ]}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={onPress}>
              <View style={styles.iconContainer}>
                {/* Show the icon only if the tab is not focused */}
                {!isFocused && options.tabBarIcon && (
                  <Image
                    source={options.tabBarIcon as number}
                    style={[
                      styles.tabIcon,
                      { tintColor: isFocused ? COLORS.black : COLORS.white },
                    ]}
                  />
                )}
                {/* Show the label only if the tab is focused */}
                {/* <Animatable.View
                                    ref={(el) => {
                                        if (el) labelRefs.current[index] = el;
                                    }}
                                    style={{ opacity: isFocused ? 1 : 0 }}
                                > */}
                {isFocused && (
                  <CustomText style={styles.tabLabel}>{label}</CustomText>
                )}
                {/* </Animatable.View> */}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    bottom: verticalScale(30),
    alignSelf: 'center',
  },
  tabStyle: {
    width: Wp(100) - verticalMarginScale(32),
    backgroundColor: COLORS.grayMiddle,
    borderRadius: radiusScale(999),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    borderRadius: radiusScale(999),
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalMarginScale(14),
    marginHorizontal: horizontalMarginScale(5),
    marginVertical: horizontalMarginScale(4),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    height: verticalScale(20),
    width: verticalScale(20),
    resizeMode: 'contain',
  },
  tabLabel: {
    color: COLORS.black,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium
  },
});

export default BottomTabBarComponent;
