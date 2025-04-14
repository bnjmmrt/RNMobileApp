import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { changeSafeAreaViewConfig, fontFamily } from '../../utils/functions';
import { COLORS } from '../../utils/constants';
import { radiusScale, verticalMarginScale } from 'src/utils/dimensions';
import { CustomText } from '../CustomText';
import { useFocusEffect } from '@react-navigation/native';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

export interface TabItem {
  id: string;
  label: any;
  title: string;
  subTitle: string;
}

type DynamicTabBarProps = {
  onTabChange?: (tab: TabItem) => void;
  tabs: TabItem[];
  activeTabIndex?: number;
  currentTab: TabItem
};

const DynamicTabBar: React.FC<DynamicTabBarProps> = ({
  onTabChange,
  tabs,
  activeTabIndex = 0,
  currentTab
}) => {
  const [activeTab, setActiveTab] = useState<TabItem>(currentTab ? currentTab : tabs[activeTabIndex]);
  useFocusEffect(
    useCallback(() => {
      console.log("hi siyaaa");
      onTabChange?.(activeTab);
    }, [activeTab]),
  );

  useEffect(() => {
    setActiveTab(activeTab);
    onTabChange?.(activeTab); // Notify parent component if callback is provided
  }, [activeTab]);

  const handleTabPress = (tab: TabItem) => {
    setActiveTab(tab);
    onTabChange?.(tab); // Notify parent component if callback is provided
  };

  return (
    <>
      {currentTab ?
        <View style={styles.container}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, currentTab.id === tab.id && styles.activeTab]}
              onPress={() => handleTabPress(tab)}>
              <CustomText
                style={[
                  styles.tabText,
                  currentTab.id === tab.id && styles.activeTabText,
                ]}>
                {tab.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View> :
        <View style={styles.container}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab.id === tab.id && styles.activeTab]}
              onPress={() => handleTabPress(tab)}>
              <CustomText
                style={[
                  styles.tabText,
                  activeTab.id === tab.id && styles.activeTabText,
                ]}>
                {tab.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      }
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(99),
    borderWidth: 1,
    borderColor: COLORS.tabBorderColor,
    padding: verticalMarginScale(4),
    alignSelf: 'center',
    width: '90%',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalMarginScale(12),
    borderRadius: radiusScale(99),
  },
  activeTab: {
    backgroundColor: COLORS.tabBorderColor,
    elevation: 2,
  },
  tabText: {
    color: COLORS.black,
  },
  activeTabText: {
    color: COLORS.black,
  },
});

export default DynamicTabBar;
