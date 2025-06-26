/* eslint-disable react-native/no-inline-styles */
import { BottomSheetView } from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
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
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import { base64RumorLogo, COLORS, LABLE } from '../../utils/constants';
import { fontFamily, getNumberOfLines } from '../../utils/functions';
import AvatarInitials from '../AvatarInitials';
import { CustomText } from '../CustomText';
import BottomSheetComponent, { BottomSheetMethods } from './BottomSheet';

interface QRCodeBottomsheetProps {
  data: any;
  isQRShown: boolean;
  profilePic?: string;
}

const TicketWrapper = ({
  ticketType,
  ticketDescription,
  showVIPToolitip,
  setShowVIPToolitip,
  children,
  isQr,
}: {
  children: React.ReactNode;
  ticketType: string;
  ticketDescription: string;
  showVIPToolitip: boolean;
  setShowVIPToolitip: React.Dispatch<React.SetStateAction<boolean>>;
  isQr: boolean;
}) => {
  const ticketBottomWidth = isQr
    ? '100%'
    : Dimensions.get('screen').width - horizontalMarginScale(120);
  return (
    <BottomSheetView style={styles.ticketWrapper}>
      <BottomSheetView style={{ flex: 1, padding: horizontalMarginScale(20) }}>
        {children}
      </BottomSheetView>
      <RenderDashedLine />
      <BottomSheetView style={{ padding: horizontalMarginScale(20) }}>
        <BottomSheetView style={styles.vipContainer}>
          <CustomText style={styles.vipText}>{ticketType}</CustomText>
          {ticketDescription && (
            <RenderToolTip
              isVisible={showVIPToolitip}
              setIsVisible={setShowVIPToolitip}
              contentText={ticketDescription}
              placement={Placement.TOP}
              isFromBottom={true}
              arrowStyle={{ bottom: 10 }}
            />
          )}
        </BottomSheetView>
      </BottomSheetView>

      <View
        style={{
          borderBottomLeftRadius: radiusScale(4),
          borderBottomRightRadius: radiusScale(4),
          bottom: -verticalScale(11),
          height: verticalScale(12),
        }}>
        <Image
          source={IMAGES.ticketBottom}
          style={{
            height: '100%',
            width: ticketBottomWidth,
            borderBottomLeftRadius: radiusScale(4),
            borderBottomRightRadius: radiusScale(4),
          }}
          resizeMode="stretch"
        />
      </View>
    </BottomSheetView>
  );
};

const RenderQrCode = React.memo(({ imageURL }: { imageURL: string }) => {
  try {
    return (
      <QRGenerator
        width={Wp(70)}
        height={Wp(70)}
        type={'svg'}
        value={imageURL}
        // margin={0}
        qrOptions={{
          typeNumber: 16,
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
          type: 'dots',
          color: COLORS.black,
        }}
        backgroundOptions={{
          color: '#ffffff',
        }}
        image={base64RumorLogo}
        imageOptions={{
          hideBackgroundDots: true,
          imageSize: 0.3,
          margin: 0,
        }}
      />
    );
  } catch (error) {
    return (
      <View
        style={{
          width: Wp(70),
          height: Wp(70),
          backgroundColor: '#ffebee',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: 'red' }}>QR Error</Text>
      </View>
    );
  }
});

const RenderToolTip = React.memo(
  ({
    isVisible,
    setIsVisible,
    contentText,
    placement,
    isFromBottom,
  }: {
    isVisible: boolean;
    isFromBottom: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    contentText: string;
    placement: Placement | undefined;
    arrowStyle: ViewStyle;
  }) => {
    let myHeight = getNumberOfLines(contentText);
    return (
      <Tooltip
        contentStyle={[
          styles.toolTipStyle,
          {
            width: myHeight > 2 ? '77%' : '100%',
            height: verticalScale(
              myHeight > 2
                ? Platform.OS === 'android'
                  ? myHeight * 21
                  : myHeight * 20
                : myHeight * 30,
            ),
          },
        ]}
        isVisible={isVisible}
        displayInsets={{ left: 0, right: 0, top: 0, bottom: 0 }}
        backgroundColor="transparent"
        showChildInTooltip={false}
        topAdjustment={verticalScale(0)}
        childContentSpacing={
          Platform.OS === 'android'
            ? !isFromBottom
              ? -verticalMarginScale(20)
              : verticalMarginScale(30)
            : 0
        }
        content={
          <View>
            <CustomText
              // textProps={{ numberOfLines: 4 }}
              style={styles.tooltipHeadStyle}>
              {contentText}
            </CustomText>
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

const RenderDashedLine = React.memo(({}: {}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: horizontalMarginScale(10),
      }}>
      <View style={styles.dash} />
      <View style={styles.dash} />
      <View style={styles.dash} />
      <View style={styles.dash} />
      <View style={styles.dash} />
      <View style={styles.dash} />
    </View>
  );
});

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
  const snap = numLines > 0 ? `${numLines * 8 + 70}%` : '75%';

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={[props.isQRShown ? snap : '65%']}
      onClose={() => {}}>
      <ScrollView>
        <View style={styles.container}>
          <CustomText
            textProps={{
              numberOfLines: 3,
              onTextLayout: e => setNumLines(e.nativeEvent.lines.length),
            }}
            style={styles.title}>
            {`${props?.data?.title}`}
          </CustomText>

          <CustomText style={[styles.subTitle]}>
            {formatTicketDate(props?.data?.subTitle, props?.data?.timeZone)}
          </CustomText>

          <View style={styles.pic_Container}>
            <AvatarInitials
              name={userDetails?.name || name}
              size={32}
              imgUrl={props?.profilePic}
            />
            <CustomText style={styles.name}>
              {userDetails?.name || name}
            </CustomText>
            <RenderToolTip
              isVisible={showProfileToolitip}
              setIsVisible={setShowProfileToolitip}
              contentText={`This QR code is valid for ${
                userDetails?.name || name
              } only. If you have additional guests in your party, they will receive a link to download Rumor and view their ticket.`}
              placement={Placement.BOTTOM}
              arrowStyle={{ top: -9 }}
              isFromBottom={false}
            />
          </View>

          {props.isQRShown ? (
            <TicketWrapper
              ticketType={props?.data?.ticketType}
              ticketDescription={props?.data?.ticketDescription}
              setShowVIPToolitip={setShowVIPToolitip}
              showVIPToolitip={showVIPToolitip}
              isQr={true}
              children={<RenderQrCode imageURL={props?.data?.qrUrl} />}
            />
          ) : (
            <TicketWrapper
              ticketType={props?.data?.ticketType}
              ticketDescription={props?.data?.ticketDescription}
              setShowVIPToolitip={setShowVIPToolitip}
              showVIPToolitip={showVIPToolitip}
              isQr={false}
              children={
                <ImageBackground
                  resizeMode="contain"
                  source={IMAGES.ticket}
                  style={styles.cardTicketBg}>
                  <Text style={styles.cardName}>
                    {userDetails?.name || name}
                  </Text>
                </ImageBackground>
              }
            />
          )}
          <View
            style={{
              marginBottom: verticalMarginScale(20),
              marginTop: verticalMarginScale(20),
            }}>
            <CustomText style={styles.infoText}>
              {props.isQRShown
                ? LABLE.SHOW_QR_CHECKIN_MESSAGE
                : 'Show this Ticket Confirmation at event check-in'}
            </CustomText>
          </View>
        </View>
      </ScrollView>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    // marginBottom: verticalMarginScale(20),
    gap: 8,
    // justifyContent:"center",
    alignItems: 'center',
    backgroundColor: COLORS.white,
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
    fontSize: fontScale(18),
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
    paddingHorizontal: verticalMarginScale(6),
  },
  cardTicketBg: {
    width: Dimensions.get('screen').width - horizontalMarginScale(160),
    height: verticalScale(148),
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: horizontalMarginScale(20),
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
    color: COLORS.light_gray,
  },
  toolTipStyle: {
    backgroundColor: COLORS.dark_gray,
    width: '80%',
    paddingHorizontal: horizontalMarginScale(10),
    height: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(20),
  },
  // toolTipStyle: {
  //   backgroundColor: COLORS.dark_gray,
  //   paddingHorizontal: verticalMarginScale(16),
  //   width: '80%',
  // },
  tooltipHeadStyle: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.white,
  },

  ticketWrapper: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderTopLeftRadius: radiusScale(4),
    borderTopRightRadius: radiusScale(4),
    borderBottomLeftRadius: radiusScale(1),
    borderBottomRightRadius: radiusScale(1),
    marginTop: verticalMarginScale(16),
    marginBottom: verticalMarginScale(16),
    backgroundColor: COLORS.white,
  },

  halfCircleContainer: {
    bottom: -verticalScale(12),
    // position: 'absolute',
    // left: 0,
    // right: 0,
  },

  dash: {
    backgroundColor: COLORS.borderGray,
    height: verticalScale(3),
    borderRadius: radiusScale(10),
    flex: 1,
  },
});

export default QRCodeBottomsheet;
