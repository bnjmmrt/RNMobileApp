import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BUTTON_LABLE, LABLE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import ProfileScreenStyle from './ProfileScreenStyle';
import { SafeAreaView } from 'react-native';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
// Define the type for navigation props
interface ProfileScreenProps extends NativeStackScreenProps<any, any> { }
interface TabItem {
  id: string;
  label: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
  location: string;
  image: string

}
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const styles = ProfileScreenStyle();
  const tabsData: TabItem[] = [
    { id: '1', label: BUTTON_LABLE.UPCOMING },
    { id: '2', label: BUTTON_LABLE.INVITED },
    { id: '3', label: BUTTON_LABLE.APPLIED },
    { id: '4', label: BUTTON_LABLE.PAST },
  ];
  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[0]);

  const events: EventItem[] = [
    { id: '1', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders },
    { id: '1', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders1 },
    { id: '1', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders },
    { id: '1', title: 'Revolve Festival', date: 'Fri, Apr 13, 9:00PM – 11:00PM EST', type: 'RSVP to See Location', location: 'Los Angeles, California', image: IMAGES.eventCoverPlaceholders1 },
  ];

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };
  return (

    <SafeAreaView style={styles.container}>
      <BeforeAppStaticComponent
        title={LABLE.STREAMLINE_YOUR_LIFESTYLE}
        subTitle={LABLE.MANAGE_YOUR_EVENTS} />
      {/* <HeaderComponent />
      <SearchInput />
      <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} /> */}
      {/* <View style={styles.contentContainer}>
        <FlatList
          data={events}
          style={{ padding: 10}}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventItem item={item} />
          )}
        />

      </View> */}

    </SafeAreaView>
  );
};

export default ProfileScreen;
