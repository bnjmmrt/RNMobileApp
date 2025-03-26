import IMAGES from '@images/index';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import QRGenerator from 'react-native-qr-code-styling';
import Tooltip, { Placement } from 'react-native-tooltip-2';
import { useSelector } from 'react-redux';
import { formatTicketDate } from 'src/utils/dateFunctions';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import { base64RumorLogo, COLORS, LABLE } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import AvatarInitials from '../AvatarInitials';
import BottomSheetComponent, { BottomSheetMethods } from './BottomSheet';

interface QRCodeBottomsheetProps {
  title: string;
  subTitle: string;
  timeZone: string;
  imageURL: string;
  isQRShown: boolean;
  profilePic?: string;
}

const RenderQrCode = React.memo(({ imageURL }: { imageURL: string }) => {
  return (
    <QRGenerator
      width={horizontalScale(250)}
      height={verticalScale(250)}
      type={'svg'}
      value={imageURL}
      margin={0}
      qrOptions={{
        typeNumber: '16',
        mode: 'Byte',
        errorCorrectionLevel: 'Q',
      }}
      dotOptions={{
        type: 'dots',
        color: COLORS.black,
      }}
      cornerSquareOptions={{
        type: 'extra-rounded',
      }}
      cornerDotOptions={{
        type: 'extra-rounded',
        color: COLORS.black,
      }}
      backgroundOptions={{
        round: 0,
        color: '#ffffff',
      }}
      image={base64RumorLogo}
      imageOptions={{
        saveAsBlob: true,
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
      }}
    />
  );
});

const RenderToolTip = React.memo(
  ({
    isVisible,
    setIsVisible,
    contentText,
    placement,
    arrowStyle,
  }: {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    contentText: string;
    placement: Placement | undefined;
    arrowStyle: ViewStyle;
  }) => {
    return (
      <Tooltip
        contentStyle={styles.toolTipStyle}
        isVisible={isVisible}
        displayInsets={{ left: 0, right: 0, top: 0, bottom: 0 }}
        arrowStyle={arrowStyle}
        backgroundColor="transparent"
        topAdjustment={verticalScale(0)}
        content={
          <View>
            <Text style={styles.tooltipHeadStyle}>{contentText}</Text>
          </View>
        }
        placement={placement}
        onClose={() => setIsVisible(false)}>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Image source={IMAGES.info_filled} style={styles.icon} />
        </TouchableOpacity>
      </Tooltip>
    );
  },
);

const QRCodeBottomsheet = forwardRef((props: QRCodeBottomsheetProps, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
  }));

  const userDetails = useSelector(
    (state: any) => state.appFlowApiData.profileData,
  );

  const [showProfileToolitip, setShowProfileToolitip] = useState(false);
  const [showVIPToolitip, setShowVIPToolitip] = useState(false);
  const [numLines, setNumLines] = useState(0);

  const name = `${userDetails?.firstName} ${userDetails?.lastName}`;
  const snap = numLines > 0 ? `${numLines * 5 + 70}%` : `75%`;

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={[props.isQRShown ? snap : '65%']}
      onClose={() => {}}>
      <ScrollView>
        <View style={styles.container}>
          <Text
            numberOfLines={3}
            style={styles.title}
            onTextLayout={e => setNumLines(e.nativeEvent.lines.length)}>
            {`${props.title}`}
          </Text>

          <Text style={[styles.subTitle]}>
            {formatTicketDate(props?.subTitle, props?.timeZone)}
          </Text>
          <View>
            <View style={styles.pic_Container}>
              <AvatarInitials
                name={userDetails?.name || name}
                size={32}
                imgUrl={props?.profilePic}
              />
              <Text style={styles.name}>{userDetails?.name || name}</Text>
              <RenderToolTip
                isVisible={showProfileToolitip}
                setIsVisible={setShowProfileToolitip}
                contentText={`This QR code is valid for ${
                  userDetails?.name || name
                } only. If you have additional guests in your party, they will receive a link to download Rumor and view their ticket.`}
                placement={Placement.BOTTOM}
                arrowStyle={{ top: -10 }}
              />
            </View>
          </View>
          {/* <Image
            source={{ uri: props.imageURL }}
            style={{
              width: horizontalMarginScale(220),
              height: verticalMarginScale(220),
            }}
          /> */}
          <ImageBackground
            source={props.isQRShown ? IMAGES.ticketBg : IMAGES.ticketBgSm}
            style={{
              width: props.isQRShown ? Wp(85) : 340,
              height: props.isQRShown ? Hp(55) : 340,
              marginTop: props.isQRShown ? 10 : 0,
              alignItems: 'center',
            }}>
            {props.isQRShown ? (
              <View
                style={{
                  height: verticalScale(290),
                  paddingTop: verticalMarginScale(40),
                }}>
                <RenderQrCode imageURL={props.imageURL} />
              </View>
            ) : (
              <ImageBackground
                resizeMode="contain"
                source={IMAGES.ticket}
                style={styles.cardTicketBg}>
                <Text style={styles.cardName}>{userDetails?.name || name}</Text>
              </ImageBackground>
            )}
            <View
              style={[
                styles.vipContainer,
                {
                  // position: 'absolute',
                  // width: Wp('80%'),
                  // height: Wp('80%'),
                  // alignItems: 'flex-end',
                  // justifyContent: 'center',
                },
              ]}>
              <Text style={styles.vipText}>VIP</Text>
              <RenderToolTip
                isVisible={showVIPToolitip}
                setIsVisible={setShowVIPToolitip}
                contentText={`Exclusive VIP access including VIP parking, expedited entry, backstage access, and premium viewing areas.Exclusive VIP access including VIP parking, expedited entry, backstage access, and premium viewing areas.`}
                placement={Placement.TOP}
                arrowStyle={{ bottom: 10 }}
              />
            </View>
            <Text style={styles.infoText}>
              {props.isQRShown
                ? LABLE.SHOW_QR_CHECKIN_MESSAGE
                : 'Show this Ticket Confirmation at event check-in'}
            </Text>
          </ImageBackground>
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
    fontFamily: fontFamily.ABCDiatype_Regular,
    paddingHorizontal: verticalMarginScale(6),
  },
  cardTicketBg: {
    marginTop: 40,
    width: 232,
    height: 148,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 20,
  },
  cardName: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: fontFamily.ABCDiatype_Bold,
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
    marginTop: 25,
  },
  vipText: {
    fontSize: fontScale(20),
    marginRight: verticalMarginScale(10),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  infoText: {
    fontSize: fontScale(14),
    color: 'gray',
    marginTop: verticalMarginScale(100),
    zIndex: 10,
  },

  toolTipStyle: {
    backgroundColor: COLORS.dark_gray,
    paddingHorizontal: verticalMarginScale(16),
    width: '80%',
  },
  tooltipHeadStyle: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.white,
  },
});

export default QRCodeBottomsheet;
