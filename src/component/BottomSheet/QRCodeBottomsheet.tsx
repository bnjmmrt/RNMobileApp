import React, {useRef, forwardRef} from 'react';
import {View, StyleSheet, Text, Image, Platform, Alert, ScrollView} from 'react-native';
import BottomSheetComponent from './BottomSheet';
import {BUTTON_LABLE, COLORS} from '../../utils/constants';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import useCalender from 'src/utils/hooks/useCalender';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IMAGES from '@images/index';
import AvatarInitials from '../AvatarInitials';

interface QRCodeBottomsheetProps {
  title: string;
  subTitle: string;
  imageURL: string;
  name: string;
  isQRShown:boolean
}
const QRCodeBottomsheet = forwardRef((props: QRCodeBottomsheetProps, ref) => {
  const cancelClick = () => {
    ref.current?.close();
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[props.isQRShown ? '93%' : '85%']}
      onClose={() => console.log(ref)}>
        <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{props.title}</Text>

        <Text style={[styles.subTitle]}>{props.subTitle}</Text>
        <View style={styles.pic_Container}>
          <AvatarInitials name={props.name} size={48} />
          <Text style={styles.name}>{props.name}</Text>
          <Image source={IMAGES.info_filled}  />
        </View>

        <View style={styles.card}>
          <View style={styles.qrContainer}>
            <View style={styles.ticket}>
           <Image source={props.imageURL} style={styles.image} /> 

              <View style={{flexDirection: 'row'}}>
                {Array.from({length: 6}).map((_, index) => (
                  <View key={index} style={styles.divider} />
                ))}
              </View>
              <View style={styles.vipContainer}>
                <Text style={styles.vipText}>VIP</Text>
                <Image source={IMAGES.info_filled} style={styles.icon} />
              </View>
            </View>
          </View>
          <Image source={IMAGES.half_circle} style={styles.cardBottom} />
        </View>
        <Text style={styles.infoText}>Show this QR code at event check-in</Text>
      </View>
      </ScrollView>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    paddingVertical: verticalMarginScale(12),
    gap: 8,
    // justifyContent:"center",
    alignItems: 'center',
  },
  btnStyle: {
    borderRadius: fontScale(100),
  },
  clearButton: {
    borderWidth: horizontalScale(1),
    backgroundColor: COLORS.tabBorderColor,
    // borderColor: COLORS.black,
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: verticalMarginScale(2),
    marginBottom: verticalMarginScale(12),
    textAlign: 'center',
  },
  pic_Container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: fontScale(14),
    fontWeight: '500',
    color: COLORS.black,
    paddingHorizontal: verticalMarginScale(6),
  },
  card: {
    width: horizontalScale(270),
    borderTopLeftRadius: radiusScale(10),
    borderTopEndRadius: radiusScale(10),
    shadowColor: COLORS.black,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: {width: 2, height: 4},
    elevation: 10,
    backgroundColor:Platform.OS === "android" ? COLORS.white:''
  },
  cardBottom: {
    width: horizontalScale(270),
    height: Platform.OS === 'android' ? 10 : 20,
    top: Platform.OS === 'android' ? 10 : -7,
    resizeMode:  Platform.OS === 'ios' ? 'contain':'cover',
  },
  qrContainer: {},
  ticket: {
  
    padding:verticalMarginScale(20),
    backgroundColor: COLORS.white,
    width: horizontalScale(270),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: radiusScale(10),
    borderTopEndRadius: radiusScale(10),
  },
  image: {},
  divider: {
    width: horizontalScale(40),
    height: verticalScale(4),
    backgroundColor: COLORS.borderGray,
    borderRadius:radiusScale(50),
    marginHorizontal: Platform.OS === 'android' ? 4.5 : 3.2,
    marginVertical:verticalMarginScale(20),
  },
  vipContainer: {
   
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipText: {
    fontSize: fontScale(20),
    fontWeight: 'bold',
    marginRight: verticalMarginScale(10),
  },
  icon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  infoText: {
    fontSize: fontScale(14),
    color: 'gray',
    marginTop: verticalMarginScale(20),
  },
});

export default QRCodeBottomsheet;
