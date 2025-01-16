import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, Platform, ImageSourcePropType, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

import LoginScreen from '../../screens/LoginScreen/LoginScreen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import PlansScreen from '../../screens/PlansScreen/PlansScreen';
import Mentoring from '../../screens/Mentoring/Mentoring';

interface TabItem {
    route: string;
    label: string;
    component: React.ComponentType<any>;
    color: string;
    icons: ImageSourcePropType;
}

const TabArr: TabItem[] = [
    { route: 'Plans', label: 'Plans', component: PlansScreen, color: 'white', icons: require('../../assets/images/planImg.png') },
    { route: 'Mentoring', label: 'Mentoring', component: Mentoring, color: 'white', icons: require('../../assets/images/user.png') },
    { route: 'Home', label: 'Home', component: HomeScreen, color: 'white', icons: require('../../assets/images/home.png') },
    { route: 'Koda AI', label: 'Koda AI', component: LoginScreen, color: 'white', icons: require('../../assets/images/sparkle.png') },
    { route: 'More', label: 'More', component: LoginScreen, color: 'white', icons: require('../../assets/images/more.png') },
];

interface DataItem {
    id: number;
    name: string;
    color: string;
}

const data: DataItem[] = [
    { id: 1, name: 'Explore Resources', color: '#E8DCF6' },
    { id: 2, name: 'Lists', color: '#DDEBFC' },
    { id: 3, name: 'TimeTable', color: '#4D4EB4' },
    { id: 4, name: 'Achievements', color: '#FAE4CF' },
];

const Tab = createBottomTabNavigator();

interface TabButtonProps {
    item: TabItem;
    onPress: () => void;
    accessibilityState: { selected: boolean };
    isModalVisible: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ item, onPress, accessibilityState, isModalVisible }) => {
    const focused = isModalVisible && item.route === 'More'
        ? true
        : (!isModalVisible && item.route !== 'More')
            ? accessibilityState.selected
            : false;

    const viewRef = useRef<Animatable.View & View>(null);
    const textViewRef = useRef<Animatable.View & View>(null);

    useEffect(() => {
        const animationProps = focused ? { scale: 1 } : { scale: 0 };
        viewRef.current?.animate({ 0: { scale: 0 }, 1: animationProps });
        textViewRef.current?.animate({ 0: { scale: 0 }, 1: animationProps });
    }, [focused]);

    const renderItemList = useCallback(({ item }: { item: DataItem }) => (
        <TouchableOpacity
            style={[styles.flatListItem, { backgroundColor: item.color }]}
            onPress={() => console.log(`Clicked on: ${item.name}`)}
        >
            <Text>{item.name}</Text>
        </TouchableOpacity>
    ), []);

    return (
        <Animatable.View
            style={[styles.container, { flex: focused ? 1 : 1, justifyContent: isModalVisible ? 'flex-end' : 'center' }]}
        >
            <TouchableOpacity
                onPress={() => { if (!isModalVisible || item.route !== 'More') onPress(); }}
                activeOpacity={1}
                style={[styles.touchableOpacity, { marginBottom: isModalVisible ? Platform.OS === 'ios' ? -16 : 20 : 0 }]}
            >
                <View>
                    <Animatable.View ref={viewRef} style={[StyleSheet.absoluteFillObject, { backgroundColor: item.color, borderRadius: 100, }]} />
                    <View style={[styles.btn, { backgroundColor: focused ? item.color : 'transparent', width: focused ? 80 : 60, height: 40 }]}>
                        <Image
                            source={item.icons}
                            style={[styles.icon,{tintColor: focused ? '#4E4EB4' : '#FFF'}]}
                        />
                        <Animatable.View ref={textViewRef}>
                            {focused && <Text style={styles.tabLabel}>{item.label}</Text>}
                        </Animatable.View>
                    </View>
                </View>
            </TouchableOpacity>
            {isModalVisible && item.route === 'More' && (
                <Animatable.View animation="fadeIn" style={styles.modalContainer}>
                    <FlatList
                        data={data}
                        numColumns={2}
                        renderItem={renderItemList}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.flatListContent}
                    />
                </Animatable.View>
            )}
        </Animatable.View>
    );
};

const AnimatedTab: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    return (
        <>
            {isModalVisible && (
                <View style={styles.overlay} />
            )}
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { ...styles.tabBar, height: isModalVisible ? 330 : 75, flexDirection:'row', justifyContent:'space-between' },
                }}
            >
                {TabArr.map((item, index) => (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarShowLabel: false,
                            tabBarButton: (props) => (
                                <TabButton
                                    {...props}
                                    item={item}
                                    isModalVisible={isModalVisible}
                                    onPress={() => {
                                        if (item.route === 'More') {
                                            setIsModalVisible(true);
                                        } else {
                                            props.onPress();
                                            setIsModalVisible(false);
                                        }
                                    }}
                                />
                            ),
                        }}
                    />
                ))}
            </Tab.Navigator>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: 65,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    touchableOpacity: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
    },
    tabLabel: {
        color: '#4E4EB4',
        marginLeft: 5,
        fontSize: 12,
        fontWeight:'500'
    },
    modalContainer: {
        position: 'absolute',
        bottom: 75,
        width: 361,
        paddingHorizontal: 16,
        right: -30,
    },
    flatListContent: {
        justifyContent: 'center',
    },
    flatListItem: {
        height: 100,
        width: 150,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        marginTop: 10,
    },
    tabBar: {
        position: 'absolute',
        margin: 16,
        borderRadius: 40,
        paddingHorizontal: 30,
        backgroundColor: '#4D4EB4',
        borderColor: 'transparent',
        paddingTop: Platform.OS === 'ios' ? 35 : 0,
        zIndex: 100,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, // Ensure the overlay ends just before the tab bar starts
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black overlay
        zIndex: 0, // Ensure the overlay is below the tab bar
        pointerEvents: 'none', // Allows interaction with the background elements
    },
});

export default AnimatedTab;
