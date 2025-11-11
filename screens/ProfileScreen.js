import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Switch,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Mock Colors object
const Colors = {
  background: '#F8F9FA',
  text: '#212529',
  primary: '#3A5998', // Constitutional blue
  secondary: '#E63946', // American red
  placeholder: '#9E9E9E',
  border: '#E0E0E0',
  error: '#B00020',
  success: '#4CAF50',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkGray: '#757575',
  cardBg: '#FFFFFF'
};

export default function ProfileScreen({ navigation }) {
  // Hardcoded user data for Warisha
  const user = {
    name: 'Warisha',
    username: '@warisha_rights',
    email: 'warisha@example.com',
    phone: '+92 312 5996481',
    location: 'Attock, Pakistan',
    memberSince: 'January 2023',
    avatar: null,
    savedRights: 12,
    checksCompleted: 47,
    resourcesAccessed: 23,
    plan: 'Premium',
    jurisdiction: 'Pakistan - Federal',
    stateJurisdictions: ['Attock', 'Lahore'],
    recentChecks: [
      { 
        id: 1, 
        title: 'Search & Seizure Rights', 
        date: '2023-05-15', 
        icon: 'search',
        amendment: '4th Amendment'
      },
      { 
        id: 2, 
        title: 'Freedom of Speech', 
        date: '2023-05-10', 
        icon: 'microphone',
        amendment: '1st Amendment'
      },
      { 
        id: 3, 
        title: 'Right to Counsel', 
        date: '2023-05-05', 
        icon: 'gavel',
        amendment: '6th Amendment'
      }
    ],
    savedArticles: [
      {
        id: 1,
        title: 'Understanding Miranda Rights',
        date: '2023-04-20',
        category: 'Criminal Procedure'
      },
      {
        id: 2,
        title: 'Your Rights During Traffic Stops',
        date: '2023-04-15',
        category: 'Law Enforcement'
      }
    ]
  };

  // State for toggles and modals
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});

  // Mock function for logging out
  const handleLogout = () => {
    console.log('User logged out');
    // In a real app, you would clear auth tokens and navigate to login screen
  };

  // Mock function for saving profile changes
  const saveProfileChanges = () => {
    console.log('Saving profile changes:', editedUser);
    setShowEditModal(false);
    // In a real app, you would update the user data in your backend
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer?.()}>
          <Ionicons name="menu" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setShowSettingsModal(true)} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header Section */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
            
            <View style={styles.planBadge}>
              <FontAwesome5 name="shield-alt" size={14} color={Colors.white} />
              <Text style={styles.planText}>{user.plan}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setShowEditModal(true)}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.savedRights}</Text>
              <Text style={styles.statLabel}>Saved Rights</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.checksCompleted}</Text>
              <Text style={styles.statLabel}>Checks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.resourcesAccessed}</Text>
              <Text style={styles.statLabel}>Resources</Text>
            </View>
          </View>
          
          {/* Jurisdiction Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Jurisdiction</Text>
            <View style={styles.jurisdictionContainer}>
              <View style={styles.jurisdictionMain}>
                <FontAwesome5 name="flag" size={24} color={Colors.primary} style={styles.jurisdictionIcon} />
                <Text style={styles.jurisdictionText}>{user.jurisdiction}</Text>
              </View>
              <View style={styles.stateJurisdictions}>
                {user.stateJurisdictions.map((state, index) => (
                  <View key={index} style={styles.stateChip}>
                    <Text style={styles.stateChipText}>{state}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.addStateButton}>
                  <Ionicons name="add" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Recent Rights Checks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Rights Checks</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {user.recentChecks.map((check, index) => (
              <TouchableOpacity key={index} style={styles.rightCheckItem}>
                <View style={styles.rightCheckIconContainer}>
                  <FontAwesome5 name={check.icon} size={18} color={Colors.white} />
                </View>
                <View style={styles.rightCheckInfo}>
                  <Text style={styles.rightCheckTitle}>{check.title}</Text>
                  <Text style={styles.rightCheckAmendment}>{check.amendment}</Text>
                </View>
                <Text style={styles.rightCheckDate}>{formatDate(check.date)}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.newCheckButton}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Colors.white} />
              <Text style={styles.newCheckButtonText}>New Rights Check</Text>
            </TouchableOpacity>
          </View>
          
          {/* Saved Articles */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Articles</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {user.savedArticles.map((article, index) => (
              <TouchableOpacity key={index} style={styles.articleItem}>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleCategory}>{article.category}</Text>
                    <Text style={styles.articleDate}>{formatDate(article.date)}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.placeholder} />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>Member since {user.memberSince}</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="key-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="shield-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Privacy Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedUser.name}
                  onChangeText={(text) => setEditedUser({...editedUser, name: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedUser.username}
                  onChangeText={(text) => setEditedUser({...editedUser, username: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedUser.email}
                  onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedUser.phone}
                  onChangeText={(text) => setEditedUser({...editedUser, phone: text})}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedUser.location}
                  onChangeText={(text) => setEditedUser({...editedUser, location: text})}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={saveProfileChanges}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettingsModal}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Notifications</Text>
                
                <View style={styles.settingsItem}>
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name="notifications-outline" size={22} color={Colors.text} style={styles.settingsIcon} />
                    <Text style={styles.settingsItemText}>Push Notifications</Text>
                  </View>
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor={Colors.white}
                  />
                </View>
                
                <View style={styles.settingsItem}>
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name="newspaper-outline" size={22} color={Colors.text} style={styles.settingsIcon} />
                    <Text style={styles.settingsItemText}>Rights Updates</Text>
                  </View>
                  <Switch
                    value={true}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor={Colors.white}
                  />
                </View>
              </View>
              
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Privacy</Text>
                
                <View style={styles.settingsItem}>
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name="location-outline" size={22} color={Colors.text} style={styles.settingsIcon} />
                    <Text style={styles.settingsItemText}>Location Services</Text>
                  </View>
                  <Switch
                    value={locationTracking}
                    onValueChange={setLocationTracking}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor={Colors.white}
                  />
                </View>
                
                <View style={styles.settingsItem}>
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name="analytics-outline" size={22} color={Colors.text} style={styles.settingsIcon} />
                    <Text style={styles.settingsItemText}>Usage Analytics</Text>
                  </View>
                  <Switch
                    value={true}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor={Colors.white}
                  />
                </View>
              </View>
              
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>App Settings</Text>
                
                <TouchableOpacity style={styles.settingsButton}>
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name="language-outline" size={22} color={Colors.text} style={styles.settingsIcon} />
                    <Text style={styles.settingsItemText}>Language</Text>
                  </View>
                  <View style={styles.settingsItemRight}>
                    <Text style={styles.settingsItemValue}>English</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.placeholder} />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingsButton}>
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name="globe-outline" size={22} color={Colors.text} style={styles.settingsIcon} />
                    <Text style={styles.settingsItemText}>Default Jurisdiction</Text>
                  </View>
                  <View style={styles.settingsItemRight}>
                    <Text style={styles.settingsItemValue}>Islamic Republic of Pakistan</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.placeholder} />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingsButton}>
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name="information-circle-outline" size={22} color={Colors.text} style={styles.settingsIcon} />
                    <Text style={styles.settingsItemText}>About</Text>
                  </View>
                  <View style={styles.settingsItemRight}>
                    <Ionicons name="chevron-forward" size={18} color={Colors.placeholder} />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 50, 
    paddingHorizontal: 16, 
    paddingBottom: 16, 
    backgroundColor: Colors.white, 
    elevation: 4,
    justifyContent: 'space-between'
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: Colors.text,
    flex: 1,
    textAlign: 'center'
  },
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    paddingBottom: 30
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarContainer: { 
    marginBottom: 16,
    position: 'relative'
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.white
  },
  placeholderAvatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: Colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white
  },
  name: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: Colors.text
  },
  username: {
    fontSize: 16,
    color: Colors.placeholder,
    marginTop: 2
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8
  },
  planText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4
  },
  editProfileButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  editProfileButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14
  },
  statsContainer: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text
  },
  statLabel: {
    fontSize: 12,
    color: Colors.placeholder,
    marginTop: 4
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
    alignSelf: 'center'
  },
  section: {
    width: '90%',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500'
  },
  jurisdictionContainer: {
    marginTop: 5
  },
  jurisdictionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  jurisdictionIcon: {
    marginRight: 12
  },
  jurisdictionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text
  },
  stateJurisdictions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  stateChip: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8
  },
  stateChipText: {
    fontSize: 12,
    color: Colors.text
  },
  addStateButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  rightCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  rightCheckIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  rightCheckInfo: {
    flex: 1
  },
  rightCheckTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text
  },
  rightCheckAmendment: {
    fontSize: 12,
    color: Colors.placeholder,
    marginTop: 2
  },
  rightCheckDate: {
    fontSize: 12,
    color: Colors.placeholder
  },
  newCheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15
  },
  newCheckButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 8
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  articleContent: {
    flex: 1,
    paddingRight: 10
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text
  },
  articleMeta: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center'
  },
  articleCategory: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  articleDate: {
    fontSize: 12,
    color: Colors.placeholder,
    marginLeft: 8
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  infoIcon: {
    marginRight: 12
  },
  infoText: {
    fontSize: 14,
    color: Colors.text
  },
  actionButtonsContainer: {
    width: '90%',
    marginTop: 20
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: 12
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: 'rgba(176, 0, 32, 0.05)'
  },
  logoutText: {
    color: Colors.error
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text
  },
  modalScrollView: {
    padding: 16
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
    marginRight: 8
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginLeft: 8
  },
  cancelButtonText: {
    color: Colors.text,
    fontWeight: '600'
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '600'
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text
  },
  settingsGroup: {
    marginBottom: 24
  },
  settingsGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingsIcon: {
    marginRight: 12
  },
  settingsItemText: {
    fontSize: 16,
    color: Colors.text
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingsItemValue: {
    fontSize: 14,
    color: Colors.placeholder,
    marginRight: 4
  }
});

// Log to show the component is loaded
console.log("Constitutional Rights App - ProfileScreen component loaded with user data for Warisha");