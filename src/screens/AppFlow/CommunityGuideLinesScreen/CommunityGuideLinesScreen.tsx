import React, { useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, COMMUNITY_GUIDELINE } from '../../../utils/constants';
import IMAGES from '../../../assets/images';
import Button from '../../../component/Button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { changeSafeAreaViewConfig, fontFamily } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { ROUTES } from 'src/navigation/Route';
import {
  horizontalScale,
  verticalScale,
  fontScale,
  verticalMarginScale,
} from '../../../utils/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import useApi from 'src/axios/useApi';

interface PrincipleItemProps {
  icon: any;
  title: string;
  description: string;
}

const PrincipleItem: React.FC<PrincipleItemProps> = ({
  icon,
  title,
  description,
}) => (
  <View style={styles.principleItem}>
    <View style={styles.iconContainer}>
      <Image source={icon} style={styles.icon} />
    </View>
    <View style={styles.principleContent}>
      <Text style={styles.principleTitle}>{title}</Text>
      <Text style={styles.principleText}>{description}</Text>
    </View>
  </View>
);

const PRINCIPLES: PrincipleItemProps[] = [
  {
    icon: IMAGES.lock_01,
    title: 'Privacy',
    description: COMMUNITY_GUIDELINE.description_1,
  },
  {
    icon: IMAGES.heart_hand,
    title: 'Respect',
    description: COMMUNITY_GUIDELINE.description_2,
  },
  {
    icon: IMAGES.ticket_01,
    title: 'Responsible Engagement',
    description: COMMUNITY_GUIDELINE.description_3,
  },
];

const CommunityGuideLinesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { apiRequest } = useApi<any>();

  const agreeToCommunityGuidelines = async () => {
    try {
      await apiRequest(
        'put',
        `/auth/user/${userId}/agree-community-guidelines`,
        {},
      );
    } catch (error) {
      console.error('Error agreeing to community guidelines:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME,
        statusBarStyle: 'light-content',
      });
    }, []),
  );

  const onAgreeClick = async () => {
    await agreeToCommunityGuidelines();
    navigation.navigate('AppStack', { screen: ROUTES.BottomTabBar });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={IMAGES.rumorLogoDark}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome{'\n'}to Rumor!</Text>

        <Text style={styles.description}>
          {COMMUNITY_GUIDELINE.description}
        </Text>

        <View style={styles.principlesContainer}>
          {PRINCIPLES.map((principle, index) => (
            <PrincipleItem key={index} {...principle} />
          ))}
        </View>

        <Button
          style={styles.agreeButton}
          title="I Agree"
          colorTheme="light"
          onPress={onAgreeClick}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalMarginScale(80),
    paddingBottom: verticalMarginScale(20),
  },
  logoContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    height: verticalScale(80),
    width: verticalScale(80),
    borderRadius: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalMarginScale(24),
  },
  logo: {
    height: verticalScale(40),
    width: verticalScale(40),
    tintColor: COLORS.black,
  },
  title: {
    fontSize: fontScale(48),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: verticalMarginScale(16),
  },
  description: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.light_text,
    textAlign: 'center',
    marginBottom: verticalMarginScale(24),
  },
  principlesContainer: {
    gap: verticalMarginScale(8),
  },
  principleItem: {
    backgroundColor: COLORS.black2,
    borderRadius: 8,
    padding: horizontalScale(16),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderWidth: 1,
    borderColor: COLORS.surface_disabled_icon,
    borderRadius: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(16),
  },
  icon: {
    width: horizontalScale(16),
    height: horizontalScale(16),
    tintColor: COLORS.white,
  },
  principleContent: {
    flex: 1,
  },
  principleTitle: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.white,
    marginBottom: verticalMarginScale(8),
  },
  principleText: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.text,
  },
  agreeButton: {
    width: '100%',
    marginTop: verticalMarginScale(50),
  },
});

export default CommunityGuideLinesScreen;
