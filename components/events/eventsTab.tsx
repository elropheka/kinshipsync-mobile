import React from 'react';
import { View, Text, SafeAreaView, StatusBar, StyleSheet } from 'react-native'; // StyleSheet added back for potential other uses, or can be removed if not needed
import { styles } from '../../styles/components/events/eventsTab.styles';
import { Colors } from '../../constants/Colors';

const EventsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundPrimary} />
    
      
      
      {/* Page Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Events</Text>
        <Text style={styles.description}>
          A wedding planning event guide on the details, month{'\n'}
          by month
        </Text>
      </View>
      
      {/* Event Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        {/* Explore venues */}
        <View style={[styles.actionButton, styles.venueButton]}>
          <Text style={styles.actionButtonIcon}>🏛️</Text>
          <Text style={styles.actionButtonText}>Explore and tour venues</Text>
        </View>
        
        {/* Guest list */}
        <View style={[styles.actionButton, styles.guestButton]}>
          <Text style={styles.actionButtonIcon}>👥</Text>
          <Text style={styles.actionButtonText}>Start your guest list</Text>
        </View>
        
        {/* Book band or DJ */}
        <View style={[styles.actionButton, styles.bandButton]}>
          <Text style={styles.actionButtonIcon}>🎵</Text>
          <Text style={styles.actionButtonText}>Book your band or DJ</Text>
        </View>
        
        {/* Local vendors */}
        <View style={[styles.actionButton, styles.vendorButton]}>
          <Text style={styles.actionButtonIcon}>📦</Text>
          <Text style={styles.actionButtonText}>Local vendors</Text>
        </View>
        
        {/* RSVP Setup */}
        <View style={[styles.actionButton, styles.rsvpButton]}>
          <Text style={styles.actionButtonIcon}>✉️</Text>
          <Text style={styles.actionButtonText}>Set up RSVPs on your website</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EventsScreen;
