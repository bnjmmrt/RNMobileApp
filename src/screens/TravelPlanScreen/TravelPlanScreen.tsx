import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, Modal, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { COLORS } from 'src/utils/constants';
import TitleSubtitle from 'src/component/TitleSubTitleComponent/TitleSubtitle';
import { fontFamily } from 'src/utils/functions';
import { BlurView } from '@react-native-community/blur';
import IMAGES from '@images/index';
import { RootState } from 'src/redux/slices';

// Define survey data structure
interface Survey {
  id: string;
  title: string;
  eventStartDate: string;
  eventEndDate: string;
  imageUrl?: string;
  message?: string;
  hasResponded: boolean;
  status: string;
  userResponse?: any;
}

// SurveyResponseCard component for responding to surveys
const SurveyResponseCard: React.FC<{
  survey: Survey;
  visible: boolean;
  onClose: () => void;
  onResponseUpdated: () => void;
  responseId: string;
}> = ({ survey, visible, onClose, onResponseUpdated, responseId }) => {
  const { apiRequest, loading } = useApi();
  const [imageError, setImageError] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | null>(survey.userResponse?.response || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userId);

  // Handle image source with fallback for expired URLs
  const getImageSource = () => {
    if (imageError || !survey.imageUrl) {
      // Return placeholder if image failed to load or no image provided
      return require('src/assets/images/rumorplaceholder.png');
    } else {
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
    console.log("CHOI")
    try {

      const response = await apiRequest(
        'put',
        `${EndPoint.travel_plans}/${responseId}/updateResponse`,
        { response: value, userId: userId, surveyId: survey.id }
      );
      console.log("response", response);
      if (response?.data) {
        setResponse(value);
        onResponseUpdated();

        // Close modal after short delay to show confirmation
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
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ModalBackground />
      <View style={styles.modalContentWrapper}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
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
              Your response is shown to hosts and boosts your chances of receiving relevant event invites.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// SurveyCard component
const SurveyCard: React.FC<{
  survey: Survey;
  onEdit: () => void;
}> = ({ survey, onEdit }) => {
  // State to track if image failed to load
  const [imageError, setImageError] = useState(false);

  // Handle image URLs with fallback
  const getImageSource = () => {
    if (imageError || !survey.imageUrl) {
      // Return placeholder if image failed to load or no image provided
      return require('src/assets/images/rumorplaceholder.png');
    } else {
      return { uri: survey.imageUrl };
    }
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Format to match the screenshot: "May 10" style
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${month} ${day}`;
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  // Check if the survey is active (status is not "draft")
  const isActive = survey.status !== "draft";

  return (
    <View style={styles.card}>
      <Image
        source={getImageSource()}
        style={styles.cardImage}
        resizeMode="cover"
        onError={() => {
          console.log(`Image URL expired for survey: ${survey.id}`);
          setImageError(true);
        }}
      />
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Image source={IMAGES.pencil_button} />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{survey.title}</Text>
        </View>
        <Text style={styles.cardDate}>
          {formatDate(survey.eventStartDate)} — {formatDate(survey.eventEndDate)}
        </Text>

        {/* Remove the status text from here */}
      </View>

      {/* Add the status button in the bottom right corner */}
      <View style={styles.statusButtonContainer}>
        <View style={[
          styles.statusButton,
          survey.userResponse?.response === 'yes' ? styles.inTownButton : styles.notInTownButton
        ]}>
          <Text style={[
            styles.statusButtonText,
            survey.userResponse?.response === 'yes' ? styles.inTownText : styles.notInTownText
          ]}>
            {survey.userResponse?.response === 'yes' ? 'In Town' : 'Not In Town'}
          </Text>
        </View>
      </View>
    </View>
  );
};

type SurveysScreenProps = NativeStackScreenProps<any, any>;

const SurveysScreen: React.FC<SurveysScreenProps> = () => {
  const { apiRequest, loading } = useApi();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  // State for surveys
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for survey response modal
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  // Get user ID from Redux
  const userId = useSelector((state: any) => state.auth.userId);

  // Fetch surveys from API
  const getSurveys = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await apiRequest(
        'get',
        `${EndPoint.travel_plans_page}?userId=${userId}`
      );

      console.log('Surveys API Response:', response);

      // The response structure has data directly in response.data, not response.data.data
      if (response?.data?.length) {
        setSurveys(response.data);
      } else if (response?.data?.data?.length) {
        setSurveys(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getSurveys();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    getSurveys();
  };

  const handleEditSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
  };

  const handleCloseModal = () => {
    setSelectedSurvey(null);
  };

  const handleResponseUpdated = () => {
    // Refresh the surveys list to get the updated response status
    handleRefresh();
  };

  // If loading initially and no data
  if (surveys.length === 0 && loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Travel Plans</Text>
        </View>

        <Text style={styles.subtitle}>
        Share where you’ll be during major cultural moments to enhance your chances of receiving relevant invites.
        </Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.black} />
        </View>
      </SafeAreaView>
    );
  }

  // Empty state component for when there are no surveys
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Travel Plans</Text>
      <Text style={styles.emptySubtitle}>
      Share where you’ll be during major cultural moments to enhance your chances of receiving relevant invites.
      </Text>

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel Plans</Text>
      </View>

      <Text style={styles.subtitle}>
      Share where you’ll be during major cultural moments to enhance your chances of receiving relevant invites.
      </Text>

      <FlatList
        data={surveys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SurveyCard
            survey={item}
            onEdit={() => handleEditSurvey(item)}
          />
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={
          !loading ? <EmptyState /> : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="small" color={COLORS.black} style={styles.footerLoader} />
          ) : null
        }
      />

      {/* Survey Response Modal */}
      {selectedSurvey && (
        <SurveyResponseCard
          survey={selectedSurvey}
          responseId={selectedSurvey.userResponse?.id}
          visible={!!selectedSurvey}
          onClose={handleCloseModal}
          onResponseUpdated={handleResponseUpdated}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white || '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: COLORS.black,
    fontWeight: '700',
    marginRight: 36, // To center the title accounting for the back button width
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 25,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E1E1E1', // Placeholder color
  },
  cardContent: {
    padding: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  editIcon: {
    fontSize: 16,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  responseStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 105,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    zIndex: 5,
  },
  inTownBadge: {
    backgroundColor: '#E8F5E9',
  },
  notInTownBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inTownText: {
    color: 'white',
  },
  notInTownText: {
    color: 'white',
  },
  // Added styles for FlatList and loading states
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footerLoader: {
    paddingVertical: 20,
  },

  // Updated Modal styles with blur effect
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
    fontSize: 18,
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
    fontSize: 16,
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
  statusButtonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inTownButton: {
    backgroundColor: '#3B8F75', // Green color from the image
  },
  notInTownButton: {
    backgroundColor: '#C62828', //little darker red
  },
  statusButtonText: {
    fontWeight: '500',
  },

});


export default SurveysScreen;