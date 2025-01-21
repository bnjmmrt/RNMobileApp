import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';

type TabBarProps = {
    onTabChange?: (tab: string) => void;
    tabOneLabel: string;
    tabTwoLabel: string;
    width?:string
};

const TabBar: React.FC<TabBarProps> = ({ onTabChange, tabOneLabel, tabTwoLabel,width='90%' }) => {
    const [activeTab, setActiveTab] = useState('01');

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        onTabChange?.(tab); // Notify parent component if callback is provided
    };

    const renderTab = (label: string, tabId: string) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tabId && styles.activeTab]}
            onPress={() => handleTabPress(tabId)}>
            <Text style={[styles.tabText, activeTab === tabId && styles.activeTabText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[{...styles.container,width}]}>
            {renderTab(tabOneLabel, '01')}
            {renderTab(tabTwoLabel, '02')}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.tabBorderColor,
        padding: 4,
        alignSelf: 'center',
        marginVertical: 20,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: COLORS.tabBorderColor,
        elevation: 2,
    },
    tabText: {
        color: COLORS.black,
        fontSize: 14,
        paddingVertical: 2,
        fontFamily: fontFamily.ABCDiatype_Regular,
    },
    activeTabText: {
        color: COLORS.black,
    },
});

export default TabBar;
