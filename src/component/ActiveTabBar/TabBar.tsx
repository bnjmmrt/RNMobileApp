import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';

type TabBarProps = {
    onTabChange?: (tab: string) => void;
    tabOneLabel: string;
    tabTwoLabel: string;
    width?:string;
    countOne?:number,
    countTwo?:number
};

const TabBar: React.FC<TabBarProps> = ({ onTabChange, tabOneLabel, tabTwoLabel,width='90%',countOne,countTwo }) => {
    const [activeTab, setActiveTab] = useState('01');

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        onTabChange?.(tab); // Notify parent component if callback is provided
    };

    const renderTab = (label: string, tabId: string,count:number) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tabId && styles.activeTab]}
            onPress={() => handleTabPress(tabId)}>
            <Text style={[styles.tabText, activeTab === tabId && styles.activeTabText]}>
                {label}
            </Text>
           {count && <View style={[styles.countView,{backgroundColor: activeTab === tabId?COLORS.black:COLORS.tabBorderColor}]}>
                <Text style={{fontSize:11,fontFamily:fontFamily.ABCDiatype_Medium,color:activeTab === tabId?COLORS.white:COLORS.black}}>{count}</Text>
            </View>}
        </TouchableOpacity>
    );

    return (
        <View style={[{...styles.container,width}]}>
            {renderTab(tabOneLabel, '01',countOne)}
            {renderTab(tabTwoLabel, '02',countTwo)}
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
        flexDirection:'row'
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
    countView:{
        width:15,height:16,marginLeft:4,borderRadius:100,justifyContent:'center',alignItems:'center'
    }
});

export default TabBar;
