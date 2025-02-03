import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';

interface CollapsibleViewInterface {
  title: React.ReactNode;
  children: React.ReactNode;
}

const CollapsibleView: React.FC<CollapsibleViewInterface> = ({
  title,
  children,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const animation = useState(new Animated.Value(0))[0]; // Destructure to get the animated value directly

  const toggleCollapse = () => {
    Animated.timing(animation, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCollapsed(prev => !prev); // Use functional update to avoid stale state
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // Can adjust this according to your content height
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleCollapse}>
        <Text style={styles.title}>{title}</Text>
      </TouchableWithoutFeedback>
      <Animated.View
        style={{height: heightInterpolate, opacity: opacityInterpolate}}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 16,
  },
});

export default CollapsibleView;
