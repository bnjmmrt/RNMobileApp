/* eslint-disable react-native/no-inline-styles */
import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  FlatList,
  Dimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import {
  fontScale,
  verticalScale,
  horizontalScale,
} from '../../utils/dimensions';
import IMAGES from '@images/index';
import BottomSheetComponent, { BottomSheetMethods } from './BottomSheet';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import MessagesIcons from '../../assets/svgs/icons/messages.svg';
import FormCard from '../FormCard/FormCard';

const { width } = Dimensions.get('window');

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
  const [activeFormIndex, setActiveFormIndex] = useState(0);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const flatListRef = useRef<FlatList>(null);

  // Create test data by duplicating and modifying IDs
  // const originalForms = props.signupForms || [];
  // const duplicatedForms = originalForms.map((form, index) => ({
  //   ...form,
  //   id: `${form.id}_duplicate_${index}`,
  //   name: `form.name_${index}`,
  //   url: form.url + 'yam',
  // }));
  // const testSignupForms = [...originalForms, ...duplicatedForms];

  const { signupForms } = props;
  const activeForm = signupForms[activeFormIndex];


  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.open(),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleCopyLink = () => {
    if (activeForm?.url) {
      Clipboard.setString(activeForm.url);
      FlashMessageComponent.show('success', 'Link copied to clipboard');
    }
  };

  const handleMessages = () => {
    if (activeForm?.url) {
      const messageUrl = `sms:&body=${encodeURIComponent(activeForm.url)}`;
      Linking.openURL(messageUrl).catch(err => {
        console.error('Error opening Messages app:', err);
      });
    }
  };

  const handleMore = async () => {
    if (activeForm?.url) {
      try {
        await Share.share({
          message: `${activeForm.name}\n${activeForm.url}`,
          url: activeForm.url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const renderFormContent = () => {
    if (signupForms.length <= 1) {
      return (
        <FormCard
          styling={activeForm?.styling}
          eventName={activeForm?.eventName}
          name={activeForm?.name}
        />
      );
    }

    const carouselItems = signupForms.map(form => ({
      uri: { uri: form.styling },
      eventName: form.eventName,
      name: form.name,
    }));

    return (
      <View style={styles.carouselContainer}>
        <FlatList
          data={carouselItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={width}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={styles.carouselItemContainer}>
              <FormCard
                styling={item.uri.uri}
                eventName={item.eventName}
                name={item.name}
              />
            </View>
          )}
          onScroll={event => {
            const scrollPosition = event.nativeEvent.contentOffset.x;
            const index = Math.round(scrollPosition / width);
            if (index !== activeFormIndex) {
              setActiveFormIndex(index);
            }
          }}
          scrollEventThrottle={16}
        />

        <View style={styles.paginationContainer}>
          {carouselItems.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setActiveFormIndex(index);
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }}
              style={[
                styles.paginationDot,
                {
                  opacity: index === activeFormIndex ? 1 : 0.2,
                  marginRight: index === carouselItems.length - 1 ? 0 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <BottomSheetComponent
      ref={bottomSheetRef}
      snapPoints={['80%', '90%']}
      onClose={() => {}}
      backgroundColor={COLORS.white}>
      <View style={styles.content}>
        <Text style={styles.title}>Share Sign Up Form</Text>
        <Text style={styles.subtitle}>Anyone with the link can RSVP</Text>

        {renderFormContent()}

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
            <View style={[styles.messagesIconContainer]}>
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(32),
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
  carouselContainer: {
    width: '100%',
  },
  carouselItemContainer: {
    width,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(12),
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: COLORS.black,
  },
});

export default SignupFormsBottomSheet;
