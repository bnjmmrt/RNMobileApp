/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  UIManager,
} from 'react-native';
import { CustomText } from '../../../component/CustomText';
import Input, { InputRefMethods } from '../../../component/Input/Input';
import Counter from '../../../component/Counter';
import Button from '../../../component/Button';
import IMAGES from '@images/index';
import moment from 'moment';
import {
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  fontScale,
} from 'src/utils/dimensions';
import { COLORS } from 'src/utils/constants';
import CollapseWrap from './CollapseWrap';

export interface TicketType {
  id: string;
  name: string;
}

interface InviteDetailsProps {
  isCollapsible?: boolean;
  selectedTicketType?: TicketType;
  onTicketTypePress?: () => void;
  additionalGuests: number;
  onAdditionalGuestsChange: (value: number) => void;
  inviteMessage: string;
  onInviteMessageChange: (message: string) => void;
  guestNote: string;
  onGuestNoteChange: (note: string) => void;
  eventName?: string;
  eventStartDate?: string;
  directlySendToConfirm: boolean;
  onDirectlySendToConfirmChange: (value: boolean) => void;
  ticketTypeRef: React.RefObject<InputRefMethods>;
  maxAdditionalGuests?: number;
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const InviteDetails: React.FC<InviteDetailsProps> = ({
  isCollapsible = false,
  selectedTicketType,
  onTicketTypePress,
  additionalGuests,
  onAdditionalGuestsChange,
  inviteMessage,
  onInviteMessageChange,
  guestNote,
  onGuestNoteChange,
  eventName,
  eventStartDate,
  directlySendToConfirm,
  onDirectlySendToConfirmChange,
  ticketTypeRef,
  maxAdditionalGuests,
}) => {
  const inviteMessageRef = useRef<InputRefMethods>(null);
  const guestNoteRef = useRef<InputRefMethods>(null);

  console.log('selectedTicketType', selectedTicketType);

  const renderContent = () => (
    <View style={{ gap: verticalMarginScale(24) }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: horizontalMarginScale(8),
        }}>
        <Input
          ref={ticketTypeRef}
          isRequired
          label="Ticket Type"
          defaultValue={selectedTicketType?.name || 'Select Ticket Type'}
          errorMessage=""
          rightImage={IMAGES.arrowRight}
          inputFieldContainerStyle={{
            height: verticalScale(40),
            borderRadius: radiusScale(12),
          }}
          otherStyle={{ marginTop: 0, flex: 1 }}
          customRightImageStyle={{
            height: verticalScale(16),
            width: horizontalScale(16),
            transform: [{ rotate: '90deg' }],
          }}
          editable={false}
          extraInputProps={{
            onPress: onTicketTypePress,
          }}
        />

        <View>
          <CustomText style={styles.label}>{'Additional Guest'}</CustomText>
          <Counter
            counterValue={additionalGuests}
            onPressMinus={() =>
              onAdditionalGuestsChange(Math.max(0, additionalGuests - 1))
            }
            onPressPlus={() =>
              onAdditionalGuestsChange(
                Math.min(maxAdditionalGuests || 0, additionalGuests + 1),
              )
            }
          />
        </View>
      </View>

      <View>
        <CustomText style={styles.label}>{'Invite Message'}</CustomText>
        <View style={styles.inviteMessageInputContainer}>
          <CustomText style={styles.inviteMessagePrototype}>
            {`Hi, you're invited to ${eventName || '[Event Name]'} on ${
              eventStartDate
                ? moment(eventStartDate).utc().format('MMM DD, YYYY')
                : '[MON DD, YYYY]'
            } at ${
              eventStartDate
                ? moment(eventStartDate).utc().format('hh:mm A')
                : '[T:TT PM]'
            }.`}
          </CustomText>
          <View style={styles.seperator} />
          <Input
            ref={inviteMessageRef}
            defaultValue={inviteMessage}
            errorMessage=""
            placeholder="Add your optional message..."
            multiline
            inputFieldContainerStyle={{ borderWidth: 0 }}
            otherStyle={{ marginTop: 0 }}
            onChangeText={onInviteMessageChange}
          />
        </View>
      </View>

      <Input
        ref={guestNoteRef}
        label="Guest Note"
        defaultValue={guestNote}
        errorMessage=""
        placeholder="Add a private note. Not visible to the guest."
        multiline
        inputFieldContainerStyle={{ borderRadius: radiusScale(16) }}
        otherStyle={{ marginTop: 0 }}
        onChangeText={onGuestNoteChange}
      />

      {directlySendToConfirm ? (
        <View
          style={[
            styles.bypassTextContainer,
            {
              paddingVertical: verticalMarginScale(8),
              paddingHorizontal: horizontalMarginScale(8),
              borderRadius: radiusScale(8),
            },
          ]}>
          <Image
            source={IMAGES.info}
            style={styles.bypassInfo}
            resizeMode="contain"
          />
          <CustomText style={{ flex: 1 }}>
            {'This guest will be added directly to the confirmed tab'}
          </CustomText>
          <Button
            onPress={() =>
              onDirectlySendToConfirmChange(!directlySendToConfirm)
            }
            title="Undo"
            imageSource={IMAGES.corner_up_left}
            leftImageStyle={{
              height: verticalScale(16),
              width: horizontalScale(16),
            }}
            buttonType="stripe"
            style={styles.undoCta}
          />
        </View>
      ) : (
        <View>
          <CustomText style={styles.bypassLabel}>
            Want users to bypass registration?
          </CustomText>
          <TouchableOpacity
            style={styles.bypassTextContainer}
            onPress={() =>
              onDirectlySendToConfirmChange(!directlySendToConfirm)
            }>
            <CustomText style={styles.bypassText}>
              Add guests directly to the confirmed tab
            </CustomText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <CollapseWrap title="Invite Details" isCollapsible={isCollapsible}>
      {renderContent()}
    </CollapseWrap>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingBottom: horizontalMarginScale(2),
  },
  inviteMessageInputContainer: {
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
  },
  inviteMessagePrototype: {
    marginHorizontal: horizontalMarginScale(16),
    marginVertical: verticalMarginScale(16),
  },
  seperator: {
    borderBottomWidth: verticalScale(1),
    borderBottomColor: COLORS.tabBorderColor,
  },
  bypassLabel: {
    fontSize: fontScale(14),
  },
  bypassTextContainer: {
    marginTop: verticalMarginScale(6),
    backgroundColor: COLORS.bgBlue,
    alignSelf: 'flex-start',
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(4),
    borderRadius: radiusScale(99),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(8),
  },
  bypassText: {
    fontSize: fontScale(11),
    color: COLORS.blueDark,
  },
  bypassInfo: {
    height: verticalScale(16),
    width: verticalScale(16),
    tintColor: COLORS.blueDark,
  },
  undoCta: {
    backgroundColor: undefined,
    width: undefined,
    height: undefined,
    paddingVertical: verticalMarginScale(6),
    paddingHorizontal: horizontalMarginScale(12),
  },
});

export default InviteDetails;
