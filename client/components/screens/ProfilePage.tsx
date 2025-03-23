import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';

export const ProfilePage = () =>  {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with profile info */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
        <Image 
            source={require('../../assets/jessica.jpg')}
            style={styles.profileImage}
            onError={(error) => console.error('Image error:', error.nativeEvent.error)}
            onLoad={() => console.log('Image loaded successfully')}
            /> 
          <Text style={styles.email}>jessicabailey0121@gmail.com</Text>
          <Text style={styles.name}>Jessica Bailey</Text>
        </View>
      </View>
      
      {/* Main content */}
      <View style={styles.content}>
        {/* Change Setting Button */}
        <TouchableOpacity style={styles.changeSettingButton}>
          <Text style={styles.buttonText}>Change Setting</Text>
        </TouchableOpacity>
        
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            As the middle child in the house, you tend give off positive energy around the people you love.
          </Text>
        </View>
        
        {/* Stats Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profiles Logged</Text>
          <View style={styles.statRow}>
            {/* Simple circle for icon */}
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>👥</Text>
            </View>
            <Text style={styles.statValue}>11</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Memories Created</Text>
          <View style={styles.statRow}>
            {/* Simple square for icon */}
            <View style={styles.iconSquare}>
              <Text style={styles.iconText}>⊞</Text>
            </View>
            <Text style={styles.statValue}>25</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Visited</Text>
          <View style={styles.statRow}>
            {/* Simple location icon */}
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <Text style={styles.statValue}>4</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    backgroundColor: '#1E1E1E',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  email: {
    color: '#999',
    fontSize: 12,
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  changeSettingButton: {
    backgroundColor: '#C932C9',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  descriptionText: {
    color: '#4CAF50',
    lineHeight: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSquare: {
    width: 24,
    height: 24,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  }
});