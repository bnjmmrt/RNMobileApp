import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';


interface TabItem {
    id: string;
    label: any;
    title: string;
    subTitle: string;
  }
  

type DynamicTabBarProps = {
    onTabChange?: (tab: TabItem) => void;
    tabs: TabItem[];
};

const DynamicTabBar: React.FC<DynamicTabBarProps> = ({ onTabChange, tabs }) => {
    const [activeTab, setActiveTab] = useState<TabItem>(tabs[1]);


    useEffect(()=>{
        setActiveTab(activeTab);
        onTabChange?.(activeTab); // Notify parent component if callback is provided
    },[activeTab])
    const handleTabPress = (tab: TabItem) => {
        setActiveTab(tab);
        onTabChange?.(tab); // Notify parent component if callback is provided
    };

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab.id === tab.id && styles.activeTab]}
                    onPress={() => handleTabPress(tab)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab.id === tab.id && styles.activeTabText,
                        ]}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
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
        padding: 2,
        alignSelf: 'center',
        width: '90%',
        marginVertical: 10,
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

export default DynamicTabBar;
