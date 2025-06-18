import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { COLORS } from 'src/utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';

interface SurveyResponseProps {
  survey: {
    id: string;
    title: string;
    eventStartDate: string;
    eventEndDate: string;
    imageUrl: string;
    message?: string;
    status?: string;
    response?: 'yes' | 'no' | null;
  };
  responseId?: string;
  onResponseUpdated?: () => void;
}

const SurveyResponseCard: React.FC<SurveyResponseProps> = ({ 
  survey, 
  onResponseUpdated 
}) => {
  const { apiRequest, loading } = useApi();
  const [imageError, setImageError] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | null>(survey.response || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  // Handle image source with fallback for expired URLs
  const getImageSource = () => {
    if (imageError || !survey.imageUrl) {
      // Return placeholder if image failed to load or no image provided
      return require('src/assets/images/dots.png');
    }
    return { uri: survey.imageUrl };
  };

  // Submit response to API
  const handleResponse = async (value: 'yes' | 'no') => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest(
        'put',
        `${EndPoint.travel_plans}/${responseId}/updateResponse`,
        { 
          response: value,
          user_id: userId,    
          survey_id: survey.id 
        }
      );

      console.log("response", response);
      if (response?.data) {
        setResponse(value);
        onResponseUpdated();
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Error submitting survey response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle details modal
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <View style={styles.container}>
      {/* Main Card */}
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.imageContainer} 
          onPress={toggleDetails}
          activeOpacity={0.9}
        >
          <Image 
            source={getImageSource()} 
            style={styles.image} 
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{survey.title}</Text>
          <Text style={styles.dates}>
            {formatDate(survey.eventStartDate)} — {formatDate(survey.eventEndDate)}
          </Text>

          {/* Response buttons */}
          {response === null ? (
            <View style={styles.responseButtons}>
              <TouchableOpacity 
                style={[styles.responseButton, styles.noButton]}
                onPress={() => !isSubmitting && handleResponse('no')}
                disabled={isSubmitting}
              >
                <Text style={styles.responseButtonText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.responseButton, styles.yesButton]}
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
          ) : (
            <View style={styles.responseResult}>
              <Text style={styles.responseText}>
                You responded: <Text style={styles.responseValue}>{response === 'yes' ? 'Yes' : 'No'}</Text>
              </Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => setResponse(null)}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.infoText}>
            Your response is shown to hosts and boosts your chances of receiving relevant event invites.
          </Text>
        </View>
      </View>

      {/* Details Modal */}
      <Modal
        visible={showDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={toggleDetails}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <Image 
              source={getImageSource()} 
              style={styles.modalImage} 
              resizeMode="cover"
            />

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{survey.title}</Text>
              <Text style={styles.modalDates}>
                {formatDate(survey.eventStartDate)} — {formatDate(survey.eventEndDate)}
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
                  onPress={() => {
                    handleResponse('no');
                    toggleDetails();
                  }}
                  disabled={isSubmitting}
                >
                  <Text style={styles.responseButtonText}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.yesButton]}
                  onPress={() => {
                    handleResponse('yes');
                    toggleDetails();
                  }}
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
                Your response is shown to hosts and boosts your chances of receiving relevant event invites.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E1E1E1',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'serif',
  },
  dates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  responseButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
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
  responseResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  responseText: {
    fontSize: 16,
    color: '#666',
  },
  responseValue: {
    fontWeight: '600',
    color: '#000',
  },
  changeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    padding: 16,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E1E1E1',
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'serif',
  },
  modalDates: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
});

export default SurveyResponseCard;