import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import AuthService from '../Services/AuthService';
import GeminiService from '../Services/GeminiService';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    loadUserProfile();
    loadUserConversations();
  }, []);

  const loadUserProfile = async () => {
    try {
      if (user?.uid) {
        const profile = await AuthService.getUserProfile(user.uid);
        setUserProfile(profile);
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || user.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Use fallback data from auth user
      setFormData({
        firstName: user?.displayName?.split(' ')[0] || '',
        lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserConversations = async () => {
    try {
      const userConversations = await GeminiService.getUserConversations();
      setConversations(userConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserProfile(), loadUserConversations()]);
    setRefreshing(false);
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await AuthService.updateUserProfile(user.uid, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
      await loadUserProfile(); // Reload to get updated data
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('Chat', { conversationId: conversation.id });
  };

  const renderConversationItem = (conversation) => (
    <TouchableOpacity
      key={conversation.id}
      style={styles.conversationItem}
      onPress={() => handleConversationPress(conversation)}
    >
      <View style={styles.conversationContent}>
        <Text style={styles.conversationTitle} numberOfLines={1}>
          {conversation.title}
        </Text>
        <Text style={styles.conversationMeta}>
          {conversation.messageCount} messages • {new Date(conversation.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.placeholder} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Ionicons 
              name={editing ? "close" : "create-outline"} 
              size={24} 
              color={Colors.accent} 
            />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={Colors.accent} />
            </View>
          </View>

          <View style={styles.profileInfo}>
            {editing ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                  editable={!saving}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                  editable={!saving}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setEditing(false);
                      setFormData({
                        firstName: userProfile?.firstName || '',
                        lastName: userProfile?.lastName || '',
                        email: userProfile?.email || user?.email || '',
                      });
                    }}
                    disabled={saving}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.userName}>
                  {userProfile?.displayName || `${formData.firstName} ${formData.lastName}`.trim() || 'User'}
                </Text>
                <Text style={styles.userEmail}>{formData.email}</Text>
                <Text style={styles.memberSince}>
                  Member since {new Date(userProfile?.createdAt || user?.metadata?.creationTime).toLocaleDateString()}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="chatbubbles" size={24} color={Colors.accent} />
              <Text style={styles.statNumber}>{conversations.length}</Text>
              <Text style={styles.statLabel}>Conversations</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={24} color={Colors.accent} />
              <Text style={styles.statNumber}>
                {conversations.reduce((sum, conv) => sum + (conv.messageCount || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          </View>
        </View>

        {/* Recent Conversations */}
        <View style={styles.conversationsSection}>
          <Text style={styles.sectionTitle}>Recent Conversations</Text>
          {conversations.length > 0 ? (
            <>
              {conversations.slice(0, 5).map(renderConversationItem)}
              {conversations.length > 5 && (
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>View All Conversations</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.placeholder} />
              <Text style={styles.emptyStateText}>No conversations yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start a conversation from the home screen
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Landing')}>
            <Ionicons name="home-outline" size={24} color={Colors.text} />
            <Text style={styles.actionText}>Back to Home</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.placeholder} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.placeholder} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: Colors.textLight,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  editButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: Colors.placeholder,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.accent,
  },
  buttonDisabled: {
    backgroundColor: Colors.placeholder,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  conversationsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
    fontWeight: '500',
  },
  conversationMeta: {
    fontSize: 12,
    color: Colors.textLight,
  },
  viewAllButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 12,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.placeholder,
    marginTop: 4,
    textAlign: 'center',
  },
  actionsSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
});