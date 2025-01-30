import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Image } from 'react-native-animatable';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { Wp, Hp } from '../../utils/dimensions';
import FeedItem from './FeedItem';

interface FeaturedEventsProps {
  item: {
    id: string;
    title: string;
    date: string;
    type: string;
    location: string;
    image: string;
  }[];
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ item }) => {


  // Handle the "Next" button press
  const handlEventPress = () => {

  };

  return (
    <View style={styles.container} onTouchEnd={() => console.log("~~~~~touched~~~~")}>
      <Text style={styles.titleStyle}>Featured Events</Text>
      <ScrollView horizontal style={{height: Hp(41)}}>
        {
          item.map((value, index) => {
            return <FeedItem item={value} key={index} isFeatured />
          })
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 10,
        width: Wp(100),
        // height: Hp(25),
        backgroundColor: COLORS.lighter_gray,
        marginTop: 15
    },
    titleStyle: {
        fontSize: 32,
        fontFamily: fontFamily.RomieTrial_Bold,
        color: COLORS.black,
        lineHeight: 40,
        paddingLeft: 12
    }
});

export default FeaturedEvents;