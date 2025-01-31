import React, { useState, useRef, useCallback } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import EventDetailsScreenStyle from './EventDetailsScreenStyle';
import HeaderComponent from '../../component/HeaderComponent';
import SearchInput from '../../component/SearchInput';
import DynamicTabBar from '../../component/ActiveTabBar/DynamicTabBar';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { BUTTON_LABLE, COLORS, EVENT_STATUS } from '../../utils/constants';
import UpcomingEvents from './Tabs/UpcomingEvents';
import InvitedEvents from './Tabs/InvitedEvents';
import AppliedEvents from './Tabs/AppliedEvents';
import PastEvents from './Tabs/PastEvents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AfterAppStaticComponent from 'src/component/BeforeAppStaticComponent/AfterAppStaticComponent';
import BackButton from 'src/component/BackButton/BackButton';
import { Image } from 'react-native-animatable';
import IMAGES from '@images/index';
import FastImage from '@d11/react-native-fast-image';
import { fontFamily } from 'src/utils/functions';
import { Hp, Wp } from 'src/utils/dimensions';
import { RouteProp, useRoute } from '@react-navigation/native';
import BackButtonOverlay from 'src/component/BackButton/BackButtonOverlay';
import EventStatus from 'src/component/Event/EventStatus';
import EventHostItem from 'src/component/Event/EventHostItem';
import { FlatList } from 'react-native-gesture-handler';
import EventVenue from 'src/component/Event/EventVenue';
import EventOverview from 'src/component/Event/EventOverview';
import Button from 'src/component/Button';
interface EventDetailsScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
  params: {
    item: {}
  };
};


const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ navigation }) => {

  const route = useRoute<RouteProp<RouteParams>>();
  console.log(route.params);
  const statusMap = [
    { id: "1", label: EVENT_STATUS.AWAITING },
    { id: "2", label: EVENT_STATUS.INVITED },
    { id: "3", label: EVENT_STATUS.DECLINED_BY_HOST },
    { id: "4", label: EVENT_STATUS.DECLINED_BY_YOU },
    { id: "5", label: EVENT_STATUS.GOING },
  ];
  const [images, setImages] = useState(statusMap)

  // const styles = EventDetailsScreenStyle();

  const onNextClick = () => {

  }

  return (
    <View style={{ ...styles.container }}>

      <ScrollView>
        <View style={{ ...styles.contentContainer }}>

          <View style={{}}>
            <FastImage
              source={{ uri: route?.params?.imageCover }}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.icon}
            />
          </View>
          <Text style={styles.titleStyle}>{"Tao Desert Nights Desert Storm NYC House Party"}</Text>
          <EventStatus status={1} />
          <FlatList
            data={images}
            horizontal
            pagingEnabled={false}
            style={{ marginVertical: 20 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <EventHostItem item={item} />
            )}
          />
          <EventVenue item={route?.params?.item} />
          <EventOverview item={route?.params?.item} />


          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.RSVP}
            colorTheme="dark"
            onPress={onNextClick}
          />
        </View>

      </ScrollView>
      <BackButtonOverlay onPress={() => navigation.goBack()} />
    </View>
  );
};

export default EventDetailsScreen;
const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingVertical: 7,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    alignItems: 'center',
    // height: 100,
  },
  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    paddingVertical: 5,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  icon: {
    // marginRight: 10,
    borderRadius: 20,
    height: Hp(60),
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  titleStyle: {
    fontSize: 30,
    fontFamily: fontFamily.RomieTrial_Bold,
    marginBottom: 5,
    padding: 10,

  },
  subtitle: {
    color: COLORS.black2,
    fontSize: 14,
    paddingHorizontal: 5,
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
});