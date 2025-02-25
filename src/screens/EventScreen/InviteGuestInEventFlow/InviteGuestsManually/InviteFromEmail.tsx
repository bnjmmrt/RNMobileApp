import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { EventStackParamList } from 'src/navigation/EventStack';
import InviteGuest from '../InviteGuest';

interface InviteFromContactsProps {}

type InviteGuestRouteProp = RouteProp<EventStackParamList, 'InviteGuestScreen'>;

const InviteFromEmail: React.FC<InviteFromContactsProps> = ({}) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<EventStackParamList, 'InviteGuestScreen'>
    >();

  const mockRoute: InviteGuestRouteProp = {
    key: 'unique-key-123', // Required
    name: 'InviteGuestScreen', // Required
    params: { isManual: true, type: 'email' },
  };

  return <InviteGuest navigation={navigation} route={mockRoute} />;
};

export default InviteFromEmail;
