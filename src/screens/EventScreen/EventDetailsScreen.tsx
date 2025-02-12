import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { BUTTON_LABLE, COLORS, EVENT_STATUS } from '../../utils/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { event_mock } from './eventMock';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { useFetchEventDetailsQuery } from 'src/redux/actions/eventApiAction';
interface EventDetailsScreenProps extends NativeStackScreenProps<any, any> { }

type RouteParams = {
  params: {
    item: {}
  };
};



const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams>>();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { data, isLoading, refetch } = useFetchEventDetailsQuery(
    { eventId: route?.params?.id },
    { refetchOnMountOrArgChange: true }
  );
  console.log("Event details", route.params.id);

  useEffect(() => {
    console.log("Event data:", data)
  }, [data])
  console.log("Event details", route.params.id);
  const statusMap = [
    { id: "1", label: EVENT_STATUS.AWAITING },
    { id: "2", label: EVENT_STATUS.INVITED },
    { id: "3", label: EVENT_STATUS.DECLINED_BY_HOST },
    { id: "4", label: EVENT_STATUS.DECLINED_BY_YOU },
    { id: "5", label: EVENT_STATUS.GOING },
  ];
  const [images, setImages] = useState(statusMap);

  // const styles = EventDetailsScreenStyle();

  const onNextClick = () => {
    data && navigation.navigate('RSPVScreen', { event: data.data })
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
          <Text style={styles.titleStyle}>{route?.params?.name}</Text>
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
          <EventOverview item={route?.params} />
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={data?.data?.currentGuestStatus == "APPLIED" ? "Update Application" : BUTTON_LABLE.RSVP}
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
    marginVertical: 10,
    height: 50,
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