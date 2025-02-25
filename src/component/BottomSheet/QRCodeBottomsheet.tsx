import React, { useRef, forwardRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import BottomSheetComponent from './BottomSheet';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { dateFormat, fontFamily } from '../../utils/functions';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import IMAGES from '@images/index';
import AvatarInitials from '../AvatarInitials';

interface QRCodeBottomsheetProps {
  title: string;
  subTitle: string;
  imageURL: string;
  name: string;
  isQRShown: boolean;
}
const QRCodeBottomsheet = forwardRef((props: QRCodeBottomsheetProps, ref) => {
  const cancelClick = () => {
    ref.current?.close();
  };
 
  const [vipTooltipShown, setVipTooltipShown] = useState(false);

  const showTooltip = () => {
    console.log('showTooltipshowTooltipshowTooltip');
    setVipTooltipShown(true)
  };
  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[props.isQRShown ? '80%' : '75%']}
      onClose={() => console.log(ref)}>
      <ScrollView>
        <View style={styles.container}>
          <Text numberOfLines={2} style={styles.title}>
            {props.title}
          </Text>

          <Text style={[styles.subTitle]}>{dateFormat(props?.subTitle,'dddd, MMMM Do, hh:mm:A GT')}</Text>
          <View style={styles.pic_Container}>
            <AvatarInitials name={props.name} size={32} />
            <Text style={styles.name}>{props.name}</Text>
            <Image source={IMAGES.info_filled} />
          </View>

          <ImageBackground
          resizeMode='contain'
          source={IMAGES.ticketBg}
          style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height / 2,
              shadowOffset: {height: -1, width: -1}, shadowOpacity: 0.05}}
          ><View style={{alignItems: 'center', paddingTop: 25, height: '100%'}}>
          {props.isQRShown ? (
            <Image
              source={{ uri: props.imageURL }}
              style={{
                width: horizontalMarginScale(220),
                height: verticalMarginScale(220),
              }}
            />
          ) : (
            <Image
              source={IMAGES.ticket}
              style={{
                marginTop: verticalMarginScale(12),
              }}
            />
          )}
         
         <View style={styles.vipContainer}>
            <Text style={styles.vipText}>VIP</Text>
            <TouchableOpacity onPress={showTooltip}>
               <Image source={IMAGES.info_filled} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.infoText}>{LABLE.SHOW_QR_CHECKIN_MESSAGE}</Text>

        </View>
        

          </ImageBackground>

          {/* <View style={styles.card}>
            <View style={styles.ticket}>
              {props.isQRShown ? (
                <Image
                  source={{ uri: props.imageURL }}
                  style={{
                    width: horizontalMarginScale(232),
                    height: verticalMarginScale(232),
                  }}
                />
              ) : (
                <Image
                  source={IMAGES.ticket}
                  style={{
                    marginTop: verticalMarginScale(12),
                  }}
                />
              )}

              <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <View key={index} style={styles.divider} />
                ))}
              </View>
              <View style={styles.vipContainer}>
                <Text style={styles.vipText}>VIP</Text>
                <TouchableOpacity onPress={showTooltip}>
                  <Image source={IMAGES.info_filled} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
            <Image source={IMAGES.half_circle} style={styles.cardBottom} />
          </View> */}
          <Text style={styles.infoText}>{LABLE.SHOW_QR_CHECKIN_MESSAGE}</Text>
        </View>
      </ScrollView>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    // paddingVertical: verticalMarginScale(16),
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
    color: COLORS.black,
    fontSize: fontScale(18),
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
  },
  name: {
    fontSize: fontScale(14),
    fontWeight: '500',
    color: COLORS.black,
    paddingHorizontal: verticalMarginScale(6),
  },
  card: {
    width: horizontalScale(272),
    borderTopLeftRadius: radiusScale(10),
    borderTopEndRadius: radiusScale(10),
    shadowColor: COLORS.black,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 2, height: 4 },
    elevation: 10,
    backgroundColor: COLORS.white,
  },
  cardBottom: {
    width: horizontalScale(272),
    height: Platform.OS === 'android' ? 10 : 20,
    top: 10,
    resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover',
  },
  ticket: {
    paddingTop: verticalMarginScale(6),
    backgroundColor: COLORS.white,
    width: horizontalScale(272),
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
    borderRadius: radiusScale(50),
    marginHorizontal: Platform.OS === 'android' ? 3.5 : 3.2,
    marginVertical: verticalMarginScale(20),
  },
  vipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40
  },
  vipText: {
    fontSize: fontScale(20),
    fontWeight: 'bold',
    marginRight: verticalMarginScale(10),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center'
  },
  icon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  infoText: {
    fontSize: fontScale(14),
    color: 'gray',
    marginTop: verticalMarginScale(50),
    zIndex: 10
  },
});

export default QRCodeBottomsheet;
