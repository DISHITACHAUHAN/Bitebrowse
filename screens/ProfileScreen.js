// screens/ProfileScreen.js
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  StatusBar 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme(); // Get theme colors

  const menuItems = [
    { 
      icon: "card-outline", 
      title: "Payment Methods", 
      onPress: () => navigation.navigate("PaymentMethods") 
    },
    { 
      icon: "receipt-outline", 
      title: "Order History", 
      onPress: () => navigation.navigate("OrderHistory") 
    },  
    { 
      icon: "star-outline", 
      title: "My Reviews", 
      onPress: () => navigation.navigate("MyReviews") 
    },
    { 
      icon: "settings-outline", 
      title: "Settings", 
      onPress: () => navigation.navigate("Settings") 
    },
    { 
      icon: "help-circle-outline", 
      title: "Help & Support", 
      onPress: () => navigation.navigate("HelpSupport") 
    },
    { 
      icon: "document-text-outline", 
      title: "Privacy Policy", 
      onPress: () => navigation.navigate("PrivacyPolicy") 
    },
  ];

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => console.log("User signed out") }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#8B3358" />
      
      {/* Header with LinearGradient */}
      <LinearGradient
        colors={["#8B3358", "#670D2F", "#3A081C"]}
        start={{ x: 0, y: 1 }}   // bottom-left
        end={{ x: 1, y: 0 }}     // top-right
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Account</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Personal Info Section */}
        <View style={[styles.personalInfoCard, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person-circle-outline" size={80} color={colors.primary} />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>John Davidson</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>john.d@example.com</Text>
            <Text style={[styles.memberSince, { color: colors.textSecondary }]}>Member since January 2024</Text>
          </View>
          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("PersonalInfo")}
          >
            <Ionicons name="pencil-outline" size={16} color="#fff" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
                { 
                  borderBottomColor: colors.isDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5' 
                }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: colors.card }]} 
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: '#FFF',
    textAlign: 'center',
  },
  personalInfoCard: {
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  memberSince: {
    fontSize: 14,
    textAlign: "center",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  menuContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
  },
});