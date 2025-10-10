import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import SearchBar from "./SearchBar";
import { LinearGradient } from "expo-linear-gradient";

export default function TopNavbar({
  searchQuery,
  onSearchChange,
  onClearSearch,
}) {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const getResponsivePadding = () => {
    if (width < 375) return 20;
    if (width < 414) return 24;
    if (width < 768) return 28;
    return 32;
  };

  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <LinearGradient
        colors={["#8B3358", "#670D2F", "#3A081C"]}
        start={{ x: 0, y: 1 }}   // bottom-left
        end={{ x: 1, y: 0 }}     // top-right
      >

        <View
          style={[
            styles.container,
            { paddingHorizontal: responsivePadding },
          ]}
        >
          {/* Left Section - Location & Greeting */}
          <View style={styles.leftSection}>
            
            <Text style={[styles.greetingText, { color: "#FFFFFF" }]}>
              Hello, John 👋
            </Text>
          </View>

          {/* Right Section - Notifications & Profile */}
          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.profileButton}
            >
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=3" }}
                style={[styles.profileImage, { borderColor: "#FFFFFF" }]}
              />
            </TouchableOpacity>

            
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar Section */}
      <LinearGradient
        colors={["#8B3358", "#670D2F", "#3A081C"]}
        start={{ x: 0, y: 1 }}   // bottom-left
        end={{ x: 1, y: 0 }}     // top-right
      >

      <View
        style={[styles.searchContainer, { paddingHorizontal: responsivePadding }]}
      >
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
          compact={false}
        />

      </View>
</LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#670D2F", // fallback base
  },
  container: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  leftSection: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
  },
  searchContainer: {
    paddingBottom: 16,
    paddingTop: 8,
  },
});
