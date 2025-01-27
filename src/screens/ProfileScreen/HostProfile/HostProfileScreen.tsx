import IMAGES from '@images/index';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import ButtonSmall from 'src/component/ButtonSmall';
import Header from 'src/component/Header/Header';
import Title from 'src/component/Title/Title';
import { COLORS } from 'src/utils/constants';
import { Wp } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import ReportHostView from './ReportHostView';
import ReportAndBlockHostView from './ReportandBlockView';
import { useNavigation } from '@react-navigation/native';

type ViewType = 'options' | 'report' | 'block' | 'unblock' | 'reportAndBlock' | null;

type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

const HostProfileScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheetRef | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(null);
  const {goBack} = useNavigation();

  const handleOpenBottomSheet = (view: ViewType) => {
    setActiveView(view);
    bottomSheetRef.current?.open();
  };

  const renderBottomSheetContent = () => {
    switch (activeView) {
      case 'options':
        return (
          <RenderOptions
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={() => bottomSheetRef.current?.close()}
          />
        );
      case 'report':
        return <ReportHostView onClose={() => bottomSheetRef.current?.close()} />;
      case 'block':
        return (
          <BlockHostView
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={() => bottomSheetRef.current?.close()}
          />
        );
      case 'unblock':
        return (
          <UnBlockHostView
            onPress={(e: string) => handleOpenBottomSheet(e as ViewType)}
            onClose={() => bottomSheetRef.current?.close()}
          />
        );
      case 'reportAndBlock':
        return <ReportAndBlockHostView onClose={() => bottomSheetRef.current?.close()} />;
      default:
        return null;
    }
  };

  const getSnapPoints = (): string => {
    switch (activeView) {
      case 'options':
        return '20%';
      case 'block':
        return '40%';
      default:
        return '55%';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:COLORS.white }}>
      <Header
        showProgressBar={false}
        rightIcon={IMAGES.dots}
        onPressRightIcon={() => handleOpenBottomSheet('options')}
        showBackButton={true}
        onPress={goBack}
      />

      <ScrollView nestedScrollEnabled>
        <View style={{ paddingHorizontal: 25 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <AvatarInitials imgUrl={'https://i.imgur.com/Lrupihs.png'} size={96} />
            <Title
              title={'Metropolitan Museum of Art'}
              subTitle={'The greatest museum that ever existed in the heart of New York City'}
              align="center"
            />
            <FlatList
              horizontal
              contentContainerStyle={{ gap: 16, marginVertical: 16 }}
              data={[
                { id: 1, icon: IMAGES.globe, url: 'www.google.com' },
                { id: 2, icon: IMAGES.insta, url: 'www.google.com' },
                { id: 3, icon: IMAGES.linkdin, url: 'www.google.com' },
                { id: 4, icon: IMAGES.x, url: 'www.google.com' },
                { id: 5, icon: IMAGES.tiktok, url: 'www.google.com' },
                { id: 6, icon: IMAGES.youtube, url: 'www.google.com' },
              ]}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => Linking.openURL(item?.url)}>
                  <Image style={{ width: 20, height: 20 }} source={item.icon} />
                </TouchableOpacity>
              )}
            />
            <ButtonSmall
              style={styles.smallBtnStyle}
              title={false ? 'Unfollow' : 'Follow'}
              colorTheme={true ? 'dark' : 'light'}
              borderType="SOLID"
            />
          </View>
          <Text style={styles.headerText}>Upcoming Events</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.dateText}>No upcoming events.</Text>}
            contentContainerStyle={{ gap: 16, marginVertical: 12 }}
            data={[1, 2, 3]}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { }}>
                <Image
                  style={{ width: Wp('42%'), height: 245, borderRadius: 8 }}
                  source={IMAGES.eventCoverPlaceholders}
                />
                <Text style={styles.eventNameText}>Event Name</Text>
                <Text style={styles.dateText}>Event Name</Text>
              </TouchableOpacity>
            )}
          />
          <Text style={styles.headerText}>Past Events</Text>
          <FlatList
            horizontal
            ListEmptyComponent={<Text style={styles.dateText}>No upcoming events.</Text>}
            contentContainerStyle={{ gap: 16, marginTop: 12 }}
            data={[1, 2, 3]}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { }}>
                <Image
                  style={{ width: Wp('42%'), height: 245, borderRadius: 8 }}
                  source={IMAGES.eventCoverPlaceholders}
                />
                <Text style={styles.eventNameText}>Event Name</Text>
                <Text style={styles.dateText}>Event Name</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      <BottomSheetComponent
        snapPoints={[getSnapPoints()]}
        ref={bottomSheetRef}
        onClose={() => setActiveView(null)}
      >
        {renderBottomSheetContent()}
      </BottomSheetComponent>
    </SafeAreaView>
  );
};

interface BlockHostViewProps {
  onClose: () => void;
  onPress: (view: string) => void;
}

const BlockHostView: React.FC<BlockHostViewProps> = ({ onClose, onPress }) => (
  <View style={{ paddingHorizontal: 12, gap: 8 }}>
    <Title
      align="center"
      title="Block Host"
      subTitle="Are you sure you want to block this host?\nIf they invite you to an event in the future, your invite will automatically be declined."
    />
    <TouchableOpacity onPress={() => { }} style={styles.redButton}>
      <Text style={[styles.optionText, { color: COLORS.white }]}>Block</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onPress('reportAndBlock')} style={styles.blackStripe}>
      <Text style={styles.optionText}>Report & Block</Text>
    </TouchableOpacity>
  </View>
);

interface UnBlockHostViewProps {
  onClose: () => void;
  onPress: (view: string) => void;
}

const UnBlockHostView: React.FC<UnBlockHostViewProps> = ({ onClose, onPress }) => (
  <View style={{ paddingHorizontal: 12, gap: 8 }}>
    <Title
      align="center"
      title="Unblock Host"
      subTitle="Are you sure you want to unblock this host?\nUnblocking this host will allow them to send you new event invites and chat messages."
    />

    <Button
      disabled={false}
      style={styles.btnStyle}
      title={'Unblock'}
      colorTheme="dark"
      onPress={() => { }}
    />
    <TouchableOpacity onPress={onClose} style={styles.blackStripe}>
      <Text style={styles.optionText}>Cancel</Text>
    </TouchableOpacity>
  </View>
);

const RenderOptions = ({ onClose, onPress }: { onClose: () => void }) => (
  <View style={{ paddingHorizontal: 12, gap: 8 }}>
    <TouchableOpacity onPress={() => onPress('report')} style={styles.greyStripeButton}>
      <Text style={styles.optionText}>Report Host</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onPress('block')} style={styles.greyStripeButton}>
      <Text style={styles.optionText}>Block Host</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  smallBtnStyle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    marginTop: 8,
    marginBottom: 8,
  },
  btnStyle: {
    borderRadius: 100,
    height: 48,
    width: '100%',
    marginTop: 12
  },
  headerText: {
    fontSize: 24,
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    marginTop: 20,
  },
  eventNameText: {
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
    marginTop: 12,
  },
  dateText: {
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.light_gray,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  greyStripeButton: {
    paddingVertical: 12,
    alignItems: 'center', borderRadius: 1000, borderWidth: 1, borderColor: COLORS.borderGray
  },
  redButton: {
    backgroundColor: COLORS.errorText,
    paddingVertical: 12, alignItems: 'center', borderRadius: 1000, height: 48, marginTop: 12
  },
  blackStripe: {
    paddingVertical: 12,
    alignItems: 'center', borderRadius: 1000,
    borderWidth: 2, borderColor: COLORS.black, height: 48
  }
});

export default HostProfileScreen;
