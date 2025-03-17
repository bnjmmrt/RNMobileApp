import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  Clipboard,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import {
  fontScale,
  verticalScale,
  horizontalScale,
  radiusScale,
} from '../../utils/dimensions';
import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import BottomSheetComponent, { BottomSheetMethods } from './BottomSheet';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import MessagesIcons from '../../assets/svgs/icons/messages.svg';

interface SignupForm {
  id: string;
  name: string;
  styling: string;
  url: string;
  description: string;
  eventName: string;
}

interface SignupFormsBottomSheetProps {
  signupForms: SignupForm[];
}

const SignupFormsBottomSheet = forwardRef<
  BottomSheetMethods,
  SignupFormsBottomSheetProps
>((props, ref) => {
  const form = props.signupForms[0]; // Only show the first form
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  // Forward ref methods while keeping local access
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.open(),
    close: () => bottomSheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      bottomSheetRef.current?.showFlashMessage(type, message),
  }));

  const handleCopyLink = () => {
    if (form?.url) {
      Clipboard.setString(form.url);
      // Show flash message using FlashMessageComponent
      FlashMessageComponent.show('success', 'Link copied to clipboard');
    }
  };

  const handleMessages = () => {
    if (form?.url) {
      // Open iMessage with the link
      const messageUrl = `sms:&body=${encodeURIComponent(form.url)}`;
      Linking.openURL(messageUrl).catch(err => {
        console.error('Error opening Messages app:', err);
      });
    }
  };

  const handleMore = () => {
    if (form?.url) {
      // Open native share dialog
      Share.share({
        message: form.url,
        url: form.url, // iOS only
        title: form.name || 'Sign Up Form',
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    }
  };

  return (
    <BottomSheetComponent
      ref={bottomSheetRef}
      snapPoints={['80%', '100%']}
      onClose={() => {}}
      backgroundColor={COLORS.white}>
      <View style={styles.content}>
        <Text style={styles.title}>Share Sign Up Form</Text>
        <Text style={styles.subtitle}>Anyone with the link can RSVP</Text>

        <View style={styles.formCard}>
          <FastImage
            source={{ uri: form?.styling }}
            style={styles.formImage}
            defaultSource={IMAGES.eventCoverPlaceholders1}
            resizeMode="cover"
          />
          <View style={styles.formTextContainer}>
            <Text style={styles.eventNameText}>
              {form?.eventName || '[Event Name]'}
            </Text>
            <Text style={styles.formNameText}>
              {form?.name || '[Sign-Up Form Name]'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopyLink}>
            <View style={styles.iconContainer}>
              <Image source={IMAGES.link03} style={styles.actionIcon} />
            </View>
            <Text style={styles.actionText}>Copy Link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMessages}>
            <View
              style={[styles.messagesIconContainer]}>
              <MessagesIcons width={60} height={60} />
            </View>
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleMore}>
            <View style={styles.iconContainer}>
              <Image source={IMAGES.dots} style={styles.actionIcon} />
            </View>
            <Text style={styles.actionText}>More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    marginBottom: verticalScale(16),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.light_gray,
    marginBottom: verticalScale(32),
    textAlign: 'center',
  },
  formCard: {
    width: verticalScale(205),
    marginHorizontal: 'auto',
    borderRadius: radiusScale(16),
    overflow: 'hidden',
    backgroundColor: COLORS.lighter_gray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: verticalScale(32),
  },
  formImage: {
    width: '100%',
    height: verticalScale(300),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  formTextContainer: {
    padding: horizontalScale(16),
  },
  eventNameText: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  formNameText: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.light_gray,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: horizontalScale(80),
  },
  iconContainer: {
    width: horizontalScale(60),
    height: verticalScale(60),
    borderRadius: 30,
    backgroundColor: COLORS.lighter_gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  actionIcon: {
    width: horizontalScale(24),
    height: verticalScale(24),
    tintColor: COLORS.black,
  },
  messageIcon: {
    tintColor: COLORS.black,
  },
  messagesIconContainer: {
    width: horizontalScale(60),
    height: verticalScale(60),
    borderRadius: 30,
    backgroundColor: '#00D856',
    alignItems: 'center',
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  actionText: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.black,
  },
});

export default SignupFormsBottomSheet;
