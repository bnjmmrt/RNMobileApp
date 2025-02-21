import React, { useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { CustomText } from '../CustomText';
import Input, { InputRefMethods } from '../Input/Input';
import Counter from '../Counter';
import Button from '../Button';
import IMAGES from '@images/index';
import moment from 'moment';
import {
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { COLORS } from 'src/utils/constants';
import createStyles from './styles';

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
  maxAdditionalGuests?: number;
  inviteMessage: string;
  onInviteMessageChange: (message: string) => void;
  guestNote: string;
  onGuestNoteChange: (note: string) => void;
  eventName?: string;
  eventStartDate?: string;
  directlySendToConfirm: boolean;
  onDirectlySendToConfirmChange: (value: boolean) => void;
}

const InviteDetails: React.FC<InviteDetailsProps> = ({
  isCollapsible = false,
  selectedTicketType,
  onTicketTypePress,
  additionalGuests,
  onAdditionalGuestsChange,
  maxAdditionalGuests = 0,
  inviteMessage,
  onInviteMessageChange,
  guestNote,
  onGuestNoteChange,
  eventName,
  eventStartDate,
  directlySendToConfirm,
  onDirectlySendToConfirmChange,
}) => {
  const styles = createStyles();
  const [isInviteDetailsOpen, setIsInviteDetailsOpen] = useState<boolean>(true);

  const ticketTypeRef = useRef<InputRefMethods>(null);
  const inviteMessageRef = useRef<InputRefMethods>(null);
  const guestNoteRef = useRef<InputRefMethods>(null);

  const renderHeader = () => {
    if (!isCollapsible) {
      return <CustomText style={styles.title}>{'Invite Details'}</CustomText>;
    }

    return (
      <View
        style={[
          styles.inviteDetailHeader,
          !isInviteDetailsOpen && {
            borderBottomWidth: 0,
            paddingBottom: 0,
          },
        ]}>
        <CustomText style={styles.title}>{'Invite Details'}</CustomText>
        <TouchableOpacity
          style={styles.accordianArrowContainer}
          onPress={() => setIsInviteDetailsOpen(!isInviteDetailsOpen)}>
          <Image
            source={IMAGES.arrowRight}
            style={{
              transform: [{ rotate: isInviteDetailsOpen ? '270deg' : '90deg' }],
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (isCollapsible && !isInviteDetailsOpen) {
      return null;
    }

    return (
      <View
        style={{
          marginTop: verticalScale(24),
          gap: verticalMarginScale(24),
        }}>
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
              height: undefined,
              paddingVertical: verticalMarginScale(12),
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
                onAdditionalGuestsChange(
                  additionalGuests > 0
                    ? additionalGuests - 1
                    : additionalGuests,
                )
              }
              onPressPlus={() =>
                onAdditionalGuestsChange(
                  additionalGuests < maxAdditionalGuests
                    ? additionalGuests + 1
                    : additionalGuests,
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
              {`Want users to bypass registration?`}
            </CustomText>
            <TouchableOpacity
              style={styles.bypassTextContainer}
              onPress={() =>
                onDirectlySendToConfirmChange(!directlySendToConfirm)
              }>
              <CustomText style={styles.bypassText}>
                {`Add guests directly to the confirmed tab`}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

export default InviteDetails;
