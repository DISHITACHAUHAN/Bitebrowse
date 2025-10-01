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

export default function TopNavbar() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const getResponsivePadding = () => {
    if (width < 375) return 16;
    if (width < 414) return 20;
    if (width < 768) return 24;
    return 32;
  };

  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View
        style={[styles.container, { paddingHorizontal: responsivePadding }]}
      >
        {/* Brand Section */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>Vittles</Text>
        </View>

        {/* User Section */}
        <View style={styles.userContainer}>
          <Text style={styles.userGreeting}>Hello, John</Text>
          
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.7}
            style={styles.profileButton}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={styles.profileImage}
            />
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  container: {
    height: 64,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrapper: {
    padding: 6,
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: 0.3,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flexShrink: 1,
  },
  userGreeting: {
    fontSize: 15,
    fontWeight: "500",
    color: "#475569",
    letterSpacing: 0.2,
  },
  profileButton: {
    position: "relative",
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#f1f5f9",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
});