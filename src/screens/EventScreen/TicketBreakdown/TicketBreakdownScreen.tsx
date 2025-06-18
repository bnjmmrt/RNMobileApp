import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Image
} from 'react-native';
import { Svg, Path, Circle, Text as SvgText } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFetchTicketBreakdownQuery } from 'src/redux/actions/eventApiAction';

// Assuming you have the left arrow in your images
// If not, you'll need to add it to your IMAGES import
import IMAGES from 'src/assets/images';

const TicketBreakdownScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const eventId = route.params?.id || route.params?.eventId; // Handle both possible param names
  
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'list'
  const [hoveredTicket, setHoveredTicket] = useState(null);
  
  // Set header title on component mount
  useEffect(() => {
    navigation.setOptions({
      title: 'Ticket Breakdown',
      // We'll hide the default header and implement our own
      headerShown: false
    });
  }, [navigation]);

  // Get ticket data with proper error handling
  const { 
    data: ticketTypes, 
    isLoading, 
    error 
  } = useFetchTicketBreakdownQuery(
    { eventId: eventId },
    { skip: !eventId } // Skip the query if eventId is not available
  );

  // Log for debugging
  useEffect(() => {
    console.log('EventID from route params:', eventId);
    if (error) {
      console.error('Error fetching ticket data:', error);
    }
  }, [eventId, error]);

  // Calculate total guests
  const totalConfirmed = useMemo(() => {
    if (!ticketTypes?.data || !ticketTypes.data.length) return 0;
    return ticketTypes.data.reduce((sum, ticket) => sum + (ticket.confirmedCount || 0), 0);
  }, [ticketTypes]);

  // Calculate total pending
  const totalPending = useMemo(() => {
    if (!ticketTypes?.data || !ticketTypes.data.length) return 0;
    return ticketTypes.data.reduce((sum, ticket) => sum + (ticket.pendingCount || 0), 0);
  }, [ticketTypes]);

  // Toggle between chart and list view
  const toggleView = (mode) => {
    setViewMode(mode);
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Calculate percentage and angle for the donut chart segments
  const chartSegments = useMemo(() => {
    // Existing code...
    if (!ticketTypes?.data || !ticketTypes.data.length) return [];
    
    let total = totalConfirmed;
    if (total === 0) return [];
    
    let startAngle = 0;
    
    return ticketTypes.data.map((ticket, index) => {
      const value = ticket.confirmedCount || 0;
      const percentage = (value / total) * 100;
      const degrees = (percentage / 100) * 360;
      
      const segment = {
        id: ticket.id,
        name: ticket.name,
        value,
        percentage,
        startAngle,
        endAngle: startAngle + degrees,
        color: getTicketColor(index)
      };
      
      startAngle += degrees;
      return segment;
    });
  }, [ticketTypes, totalConfirmed]);

  // Calculate the SVG path for each donut segment
  const getSegmentPath = (segment) => {
    // Existing code...
    const radius = 120; // Chart radius
    const innerRadius = 84; // Inner circle radius (70% of outer)
    const centerX = 150;
    const centerY = 150;
    
    // Convert angles to radians
    const startRad = (segment.startAngle - 90) * Math.PI / 180;
    const endRad = (segment.endAngle - 90) * Math.PI / 180;
    
    // Calculate points
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);
    
    // Determine if the segment is more than 180 degrees
    const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
    
    // Build the path
    return `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  // Render charts view
  const renderChartView = () => {
    // Existing code...
    return (
      <ScrollView 
        style={styles.chartContainer}
        contentContainerStyle={styles.chartContentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.chartWrapper}>
          <Svg width="300" height="300" viewBox="0 0 300 300">
            {/* Background circle (for pending) */}
            <Circle cx="150" cy="150" r="120" fill="#E6E6E6" />
            
            {/* Donut chart segments */}
            {chartSegments.map((segment) => (
              <Path
                key={segment.id}
                d={getSegmentPath(segment)}
                fill={segment.color}
                onPress={() => setHoveredTicket(segment.id === hoveredTicket ? null : segment.id)}
              />
            ))}
            
            {/* Inner white circle */}
            <Circle cx="150" cy="150" r="84" fill="white" />
            
            {/* Text in the center - with adjusted positioning */}
            <SvgText 
              x="150" 
              y="130" 
              textAnchor="middle" 
              fontWeight="bold"
              fontSize="36"
              fill="black"
            >
              {totalConfirmed}
            </SvgText>
            <SvgText 
              x="150" 
              y="165" 
              textAnchor="middle" 
              fontSize="14"
              fill="#666"
            >
              Confirmed Guests
            </SvgText>
            <SvgText 
              x="150" 
              y="195" 
              textAnchor="middle" 
              fontSize="12"
              fill="#999"
            >
              {totalPending} Pending
            </SvgText>
          </Svg>
        </View>
        
        {/* Ticket Cards */}
        <View style={styles.ticketCardsContainer}>
          {ticketTypes?.data && ticketTypes.data.map((ticket, index) => (
            <TouchableOpacity 
              key={ticket.id} 
              style={[
                styles.ticketCard,
                hoveredTicket === ticket.id && styles.ticketCardHighlighted
              ]}
              onPress={() => setHoveredTicket(ticket.id === hoveredTicket ? null : ticket.id)}
              activeOpacity={0.8}
            >
              <View style={styles.ticketCardHeader}>
                <View 
                  style={[
                    styles.ticketColorDot, 
                    { backgroundColor: getTicketColor(index) }
                  ]} 
                />
                <Text style={styles.ticketName}>{ticket.name}</Text>
              </View>
              
              <View style={styles.ticketStatsRow}>
                <View style={styles.ticketStatColumn}>
                  <Text style={styles.ticketStatLabel}>
                    Confirmed <Text style={styles.infoIcon}>ⓘ</Text>
                  </Text>
                  <Text style={styles.ticketStatValue}>{ticket.confirmedCount || 0}</Text>
                </View>
                
                <View style={styles.ticketStatColumn}>
                  <Text style={styles.ticketStatLabel}>
                    Pending <Text style={styles.infoIcon}>ⓘ</Text>
                  </Text>
                  <Text style={styles.ticketStatValue}>{ticket.pendingCount || 0}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // Render list view
  const renderListView = () => {
    // Existing code...
    return (
      <ScrollView 
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Type</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>
              % of Total <Text style={styles.infoIconSmall}>ⓘ</Text>
            </Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>
              Pending <Text style={styles.infoIconSmall}>ⓘ</Text>
            </Text>
          </View>
        </View>
        
        {ticketTypes?.data && ticketTypes.data.map((ticket, index) => {
          const confirmedCount = ticket.confirmedCount || 0;
          const pendingCount = ticket.pendingCount || 0;
          const percentOfTotal = totalConfirmed > 0 
            ? ((confirmedCount / totalConfirmed) * 100).toFixed(1) + '%' 
            : '0%';
          
          return (
            <TouchableOpacity
              key={ticket.id}
              style={[
                styles.tableRow,
                hoveredTicket === ticket.id && styles.tableRowHighlighted
              ]}
              onPress={() => setHoveredTicket(ticket.id === hoveredTicket ? null : ticket.id)}
              activeOpacity={0.8}
            >
              <View style={styles.typeCell}>
                <View style={styles.typeContent}>
                  <View 
                    style={[
                      styles.typeColorDot, 
                      { backgroundColor: getTicketColor(index) }
                    ]} 
                  />
                  <Text style={styles.typeName}>{ticket.name}</Text>
                </View>
              </View>
              <View style={styles.valueCell}>
                <Text style={styles.valueText}>{percentOfTotal}</Text>
              </View>
              <View style={styles.valueCell}>
                <Text style={styles.valueText}>{pendingCount}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        
        <View style={styles.totalRow}>
          <View style={styles.typeCell}>
            <Text style={styles.totalText}>Total</Text>
          </View>
          <View style={styles.valueCell}>
            <Text style={styles.totalText}>100%</Text>
          </View>
          <View style={styles.valueCell}>
            <Text style={styles.totalText}>{totalPending}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Custom Header with back button */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleBackPress}>
            <View style={styles.iconButton}>
              <Image source={IMAGES.leftArrow} style={styles.icon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>Ticket Breakdown</Text>
          <View style={styles.phBTn} />
        </View>

        {/* Toggle buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              viewMode === 'chart' && styles.toggleButtonActive
            ]}
            onPress={() => toggleView('chart')}
          >
            <Text 
              style={[
                styles.toggleText, 
                viewMode === 'chart' && styles.toggleTextActive
              ]}
            >
              Chart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              viewMode === 'list' && styles.toggleButtonActive
            ]}
            onPress={() => toggleView('list')}
          >
            <Text 
              style={[
                styles.toggleText, 
                viewMode === 'list' && styles.toggleTextActive
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Component header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ticket Type Distribution</Text>
          <TouchableOpacity 
            style={styles.expandButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text>^</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Loading ticket data...</Text>
          </View>
        ) : !eventId ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No event ID found. Please go back and try again.</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading ticket data. Please try again.</Text>
          </View>
        ) : (
          viewMode === 'chart' ? renderChartView() : renderListView()
        )}
      </View>
    </SafeAreaView>
  );
};

// Helper function to get color for each ticket type
function getTicketColor(index) {
  // Colors arranged clockwise starting from gray
  const colors = [
    '#a9a9a9', // Gray
    '#e9d2c0', // Light beige
    '#000000', // Black
    '#c13c37', // Red
    '#f05e23', // Orange-red
    '#f99d1c', // Orange
    '#2b4ba1', // Blue
    '#6bc9ed', // Light blue
    '#c9e8f3', // Very light blue
    '#7abd3d', // Green
    '#4a913c', // Dark green
    '#d4e13b', // Yellow-green
    '#9d5b25', // Brown
    '#7b3f97', // Purple
    '#ba68c8'  // Light purple
  ];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // New styles for header with back button - similar to EventGuestList
  headerTop: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#F5F5F5', // Neutral surface color
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  phBTn: {
    width: 40,
    height: 40,
  },
  // Existing styles
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  expandButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#c13c37',
    textAlign: 'center',
  },
  
  // Chart view styles
  chartContainer: {
    flex: 1,
  },
  chartContentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 80, // Extra padding at bottom for iOS
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  ticketCardsContainer: {
    padding: 16,
  },
  ticketCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketCardHighlighted: {
    borderColor: '#ccc',
    shadowOpacity: 0.1,
  },
  ticketCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ticketStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketStatColumn: {
    flex: 1,
  },
  ticketStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ticketStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoIcon: {
    fontSize: 12,
    color: '#999',
  },
  
  // List view styles
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 80, // Extra padding at bottom for iOS
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  infoIconSmall: {
    fontSize: 12,
    color: '#999',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  tableRowHighlighted: {
    backgroundColor: '#f9f9f9',
  },
  typeCell: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  typeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  typeName: {
    fontSize: 14,
  },
  valueCell: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TicketBreakdownScreen;