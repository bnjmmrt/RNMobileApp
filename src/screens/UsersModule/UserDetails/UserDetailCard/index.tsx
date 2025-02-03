import React from 'react';
import {View, ViewStyle} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import createStyle from './style';

interface UserDetailCardProps {
  children: React.ReactNode;
  title?: string;
  containerStyle?: ViewStyle;
}

const UserDetailCard: React.FC<UserDetailCardProps> = ({
  children,
  title,
  containerStyle,
}) => {
  const styles = createStyle();

  return (
    <View style={[styles.container, containerStyle]}>
      {title ? <CustomText style={styles.title}>{title}</CustomText> : null}
      {title ? <View style={styles.seprator} /> : null}
      {children}
    </View>
  );
};

export default UserDetailCard;
