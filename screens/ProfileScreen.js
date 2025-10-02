import React from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { userData, stats, menuItems, loading } = useData();
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert("Error", "Failed to sign out");
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleMenuItemPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  // Default menu items if none provided
  const defaultMenuItems = [
    { id: "1", label: "My Orders", icon: "receipt-outline", screen: "Orders" },
    { id: "2", label: "Favorites", icon: "heart-outline", screen: "Favorites" },
    { id: "3", label: "Addresses", icon: "location-outline", screen: "Addresses" },
    { id: "4", label: "Payment Methods", icon: "card-outline", screen: "Payments" },
    { id: "5", label: "Notifications", icon: "notifications-outline", screen: "Notifications" },
    { id: "6", label: "Help & Support", icon: "help-circle-outline", screen: "Support" },
    { id: "7", label: "About", icon: "information-circle-outline", screen: "About" },
  ];

  const menuItemsToDisplay = menuItems || defaultMenuItems;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ 
                uri: userData?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" 
              }} 
              style={styles.avatar} 
              defaultSource={require("../assets/default-avatar.png")}
            />
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditProfile}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.name || "User Name"}</Text>
            <Text style={styles.userEmail}>{userData?.email || "user@example.com"}</Text>
            <Text style={styles.memberSince}>
              Member since {userData?.joinedDate || "2024"}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={18} color="#ff6b35" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.orders || 12}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.reviews || 8}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.favorites || 15}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Account</Text>
          {menuItemsToDisplay.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                index === menuItemsToDisplay.length - 1 && styles.lastMenuItem
              ]}
              onPress={() => handleMenuItemPress(item)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={20} color="#666" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          )}
          <Text style={styles.logoutText}>
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 8,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ff6b35",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#ff6b35",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  memberSince: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff5f2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff6b35",
    gap: 8,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6b35",
  },
  statsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ff6b35",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ffe5e5",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
});