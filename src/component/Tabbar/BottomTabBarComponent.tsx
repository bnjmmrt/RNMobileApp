import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Hp, Wp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';

const BottomTabBarComponent: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const labelRefs = useRef<(Animatable.View & View)[]>([]);

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
        <View style={styles.container}>
            <View style={styles.tabStyle}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel ?? options.title ?? route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true
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
                            ]}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            onPress={onPress}
                        >
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
                                        <Text style={styles.tabLabel}>{label}</Text>
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
        bottom: Hp(4),
        alignSelf: 'center',
    },
    tabStyle: {
        height: 60,
        width: Wp(90),
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    tabButton: {    
        borderRadius: 100,
        height: 40,
        backgroundColor: COLORS.white,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabIcon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    tabLabel: {
        color: COLORS.black,
        fontSize: 12,
        fontFamily: fontFamily.ABCDiatype_Regular
    },
});

export default BottomTabBarComponent;
