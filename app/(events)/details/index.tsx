import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router'; // Stack import moved here
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../../styles/app/(events)/details/index.styles';

const WeddingDetailsPage: React.FC = () => {
  useLocalSearchParams(); // params not used in this component
  const [activeTab, setActiveTab] = useState('Details');
  const [popoverVisible, setPopoverVisible] = useState(false);
  
  const tabs = ['Details', 'Timeline', 'Guests', 'Tasks'];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Event Details" }} />
      {/* Custom header View removed */}
      <View style={styles.banner}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Wedding</Text>
        </View>
        <View style={styles.heartContainer}>
          <Ionicons name="heart-outline" size={60} color="#D0D0D0" />
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.eventTitle}>Sarah &amp; Michael&apos;s Wedding</Text>
        <View style={styles.extraButtonsContainer}>
          <TouchableOpacity style={styles.extraButton}
            onPress={() => setPopoverVisible(true)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={popoverVisible}
          onRequestClose={() => setPopoverVisible(false)}
        >
          <TouchableOpacity style={styles.popoverBackdrop} onPress={() => setPopoverVisible(false)}>
            <View style={styles.popoverContainer}>
              <TouchableOpacity
                style={styles.popoverButton}
                onPress={() => {
                  setPopoverVisible(false);
                  router.push('/(events)/seating');
                }}
              >
                <Text style={styles.popoverButtonText}>Seating</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popoverButton]}
                onPress={() => {
                  setPopoverVisible(false);
                  router.push('/(events)/createNewTeam');
                }}
              >
                <Text style={styles.popoverButtonText}>Team</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popoverButton, styles.lastPopoverButton]}
                onPress={() => {
                  setPopoverVisible(false);
                  router.push('/(events)/ideas');
                }}
              >
                <Text style={styles.popoverButtonText}>Ideas</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.detailText}>May 15, 2025</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.detailText}>3:00 PM - 10:00 PM</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.detailText}>Golden Garden Resort</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.detailText}>120 Guests</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>75% Complete</Text>
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Details' && (
          <View style={styles.tabContent}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionText}>
                Join us as we celebrate the union of Sarah and Michael. We&apos;re excited to share this special day with family and friends.
              </Text>
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Venue</Text>
              <View style={styles.venueCard}>
                <View style={styles.venueImagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#999" />
                </View>
                <View style={styles.venueInfo}>
                  <Text style={styles.venueName}>Golden Garden Resort</Text>
                  <Text style={styles.venueAddress}>123 Seaside Avenue, Beach City</Text>
                  <TouchableOpacity style={styles.directionButton}>
                    <Text style={styles.directionButtonText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>
                  • Dress code: Formal attire{'\n'}
                  • Outdoor ceremony, indoor reception{'\n'}
                  • Parking available at venue{'\n'}
                  • Please RSVP by April 15, 2025
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Timeline' && (
          <View style={styles.tabContent}>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>3:00 PM</Text>
                </View>
                <View style={styles.timelineDot} />
                <View style={styles.eventContainer}>
                  <Text style={styles.eventName}>Guest Arrival</Text>
                  <Text style={styles.eventDescription}>Guests arrive and are seated</Text>
                </View>
              </View>
              <View style={styles.timelineConnector} />
              <View style={styles.timelineItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>3:30 PM</Text>
                </View>
                <View style={styles.timelineDot} />
                <View style={styles.eventContainer}>
                  <Text style={styles.eventName}>Ceremony</Text>
                  <Text style={styles.eventDescription}>Wedding ceremony begins</Text>
                </View>
              </View>
              <View style={styles.timelineConnector} />
              <View style={styles.timelineItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>4:30 PM</Text>
                </View>
                <View style={styles.timelineDot} />
                <View style={styles.eventContainer}>
                  <Text style={styles.eventName}>Cocktail Hour</Text>
                  <Text style={styles.eventDescription}>Drinks and appetizers</Text>
                </View>
              </View>
              <View style={styles.timelineConnector} />
              <View style={styles.timelineItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>6:00 PM</Text>
                </View>
                <View style={styles.timelineDot} />
                <View style={styles.eventContainer}>
                  <Text style={styles.eventName}>Dinner Reception</Text>
                  <Text style={styles.eventDescription}>Dinner and speeches</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Guests' && (
          <View style={styles.tabContent}>
            <View style={styles.guestsStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>120</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>98</Text>
                <Text style={styles.statLabel}>Confirmed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>Declined</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addGuestButton}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addGuestButtonText}>Add Guest</Text>
            </TouchableOpacity>
            <Text style={styles.guestListTitle}>Guest List</Text>
            <View style={styles.guestItem}>
              <View style={styles.guestInitials}>
                <Text style={styles.initialsText}>JD</Text>
              </View>
              <View style={styles.guestInfo}>
                <Text style={styles.guestName}>John Doe</Text>
                <Text style={styles.guestDetails}>Family • Confirmed</Text>
              </View>
            </View>
            <View style={styles.guestItem}>
              <View style={styles.guestInitials}>
                <Text style={styles.initialsText}>JS</Text>
              </View>
              <View style={styles.guestInfo}>
                <Text style={styles.guestName}>Jane Smith</Text>
                <Text style={styles.guestDetails}>Friend • Confirmed</Text>
              </View>
            </View>
            <View style={styles.guestItem}>
              <View style={styles.guestInitials}>
                <Text style={styles.initialsText}>RJ</Text>
              </View>
              <View style={styles.guestInfo}>
                <Text style={styles.guestName}>Robert Johnson</Text>
                <Text style={styles.guestDetails}>Family • Pending</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Tasks' && (
          <View style={styles.tabContent}>
            <View style={styles.taskStats}>
              <View style={styles.taskProgressContainer}>
                <Text style={styles.taskProgressText}>75%</Text>
                <Text style={styles.taskProgressLabel}>Tasks Complete</Text>
              </View>
            </View>
            <View style={styles.taskListContainer}>
              <View style={styles.taskCategory}>
                <Text style={styles.taskCategoryTitle}>Venue</Text>
                <View style={styles.taskItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                  <Text style={styles.taskCompleted}>Book venue</Text>
                </View>
                <View style={styles.taskItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                  <Text style={styles.taskCompleted}>Pay deposit</Text>
                </View>
              </View>
              <View style={styles.taskCategory}>
                <Text style={styles.taskCategoryTitle}>Food & Drinks</Text>
                <View style={styles.taskItem}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                  <Text style={styles.taskCompleted}>Choose caterer</Text>
                </View>
                <View style={styles.taskItem}>
                  <Ionicons name="ellipse-outline" size={24} color="#999" />
                  <Text style={styles.taskIncomplete}>Finalize menu</Text>
                </View>
              </View>
              <View style={styles.taskCategory}>
                <Text style={styles.taskCategoryTitle}>Decorations</Text>
                <View style={styles.taskItem}>
                  <Ionicons name="ellipse-outline" size={24} color="#999" />
                  <Text style={styles.taskIncomplete}>Order flowers</Text>
                </View>
                <View style={styles.taskItem}>
                  <Ionicons name="ellipse-outline" size={24} color="#999" />
                  <Text style={styles.taskIncomplete}>Get centerpieces</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.addTaskButton}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addTaskButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeddingDetailsPage;
