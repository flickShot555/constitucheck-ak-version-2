// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode() {
    setIsDarkMode(prev => !prev);
    // TODO: persist preference
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} thumbColor={isDarkMode ? Colors.accent : Colors.placeholder} />
        </View>
        {/* Add more settings toggles here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#fff', elevation: 4 },
  headerTitle: { marginLeft: 16, fontSize: 20, fontWeight: 'bold', color: Colors.text },
  content: { flex: 1, padding: 16 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  settingText: { fontSize: 16, color: Colors.text },
});