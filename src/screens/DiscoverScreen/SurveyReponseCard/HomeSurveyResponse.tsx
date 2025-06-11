import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, 
  TouchableOpacity, ActivityIndicator, Modal, Platform,
  PanResponder, Animated
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { COLORS } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from 'src/redux/slices';
import { useSelector } from 'react-redux';
// Define survey data structure
export interface Survey {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  cityImage?: any; // For local images
  imageUrl?: string; // For remote images
  message?: string;
  response?: 'yes' | 'no' | null;
}

interface HomeSurveyModalProps {
  survey: Survey;  // Now expecting survey data to be passed in
  onClose: () => void;
  onResponseUpdated?: () => void;
}



const HomeSurveyModal: React.FC<HomeSurveyModalProps> = ({ 
  survey, 
  onClose, 
  onResponseUpdated 
}) => {
  const { apiRequest } = useApi();
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = useSelector((state: RootState) => state.auth.userId);
  
  // Animation values for slide up
  const slideAnim = useRef(new Animated.Value(500)).current; // Start offscreen below
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start fully transparent
  
  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  // Threshold for swipe to dismiss (in points)
  const DISMISS_THRESHOLD = 150;
  
  // Set up pan responder for swipe down to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only allow downward movement
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
          // Calculate opacity based on movement (fade out as user swipes down)
          const newOpacity = 1 - (gestureState.dy / 300);
          opacityAnim.setValue(newOpacity > 0 ? newOpacity : 0);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > DISMISS_THRESHOLD) {
          // User swiped down far enough to dismiss
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 500, // Move far down off screen
              duration: 300,
              useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true
            })
          ]).start(() => {
            // Mark as "No response" and close
            handleNoResponse();
          });
        } else {
          // Not swiped far enough, snap back
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 0,
              friction: 5,
              useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true
            })
          ]).start();
        }
      }
    })
  ).current;
  
  // Handle image source with fallback for expired URLs
  const getImageSource = () => {
    if (imageError || (!survey.cityImage && !survey.imageUrl)) {
      // Return placeholder if image failed to load or no image provided
      return require('src/assets/images/rumorplaceholder.png');
    }
    
    if (survey.cityImage) {
      return survey.cityImage;
    } else if (survey.imageUrl) {
      return { uri: survey.imageUrl };
    }
  };
  
  // Format dates from ISO string to more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Format to match the design: "Jan 22, 2025"
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };
  
  // Submit response to API
  const handleResponse = async (value: 'yes' | 'no') => {
    setIsSubmitting(true);
    try {
      console.log("choi")

      console.log("userId", userId);
      console.log("surveyId", survey.id);
      const response = await apiRequest(
        'post',
        `${EndPoint.travel_plans}/${survey.id}/respond`,
        { response: value, userId: userId, surveyId: survey.id }
      );
      console.log("response", response);
      if (response?.data) {
        // Animate out the modal
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 500,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          })
        ]).start(() => {
          if (onResponseUpdated) onResponseUpdated();
          onClose();
        });
      }
    } catch (error) {
      console.error('Error submitting survey response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle "No response" when user swipes down
  const handleNoResponse = async () => {
    try {
      await apiRequest(
        'post',
        `${EndPoint.travel_plans}/${survey.id}/respond`,
        { response: 'no_response' }
      );
    } catch (error) {
      console.error('Error recording no response:', error);
    } finally {
      if (onResponseUpdated) onResponseUpdated();
      onClose();
    }
  };
  
  // Modal overlay with blur effect
  const ModalBackground = () => {
    // Different implementation based on platform for optimal performance
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={10}
        />
      );
    } else {
      // On Android, fallback to semi-transparent background
      return <View style={styles.modalOverlay} />;
    }
  };
  
  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="none" // We'll handle animation ourselves
      onRequestClose={() => {
        handleNoResponse();
      }}
    >
      <ModalBackground />
      <View style={styles.modalContentWrapper}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim
            }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Swipe indicator */}
          <View style={styles.swipeIndicator}>
            <View style={styles.swipeIndicatorBar} />
          </View>
          
          <Image 
            source={getImageSource()} 
            style={styles.modalImage} 
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>{survey.title}</Text>
            <Text style={styles.modalDates}>
              {formatDate(survey.startDate)} — {formatDate(survey.endDate)}
            </Text>
            
            {survey.message && (
              <View style={styles.messageContainer}>
                <Text style={styles.messageLabel}>Message</Text>
                <Text style={styles.messageText}>{survey.message}</Text>
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.noButton]}
                onPress={() => !isSubmitting && handleResponse('no')}
                disabled={isSubmitting}
              >
                <Text style={styles.responseButtonText}>No</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => !isSubmitting && handleResponse('yes')}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.yesButtonText}>Yes</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <Text style={styles.infoText}>
              Swipe down to dismiss. Your response is shown to hosts and boosts your chances of receiving relevant event invites.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for Android
  },
  modalContentWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end', // Position at bottom
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  swipeIndicator: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeIndicatorBar: {
    width: 40,
    height: 5,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E1E1E1',
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  modalDates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#666',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    maxWidth: 150,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  noButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  yesButton: {
    backgroundColor: '#000000',
  },
  responseButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  yesButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeSurveyModal;