import React from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopNavbar() {
  const { width } = useWindowDimensions();
  
  // Calculate responsive padding based on screen width
  const getResponsivePadding = () => {
    if (width < 375) return 16;
    if (width < 414) return 20;
    if (width < 768) return 24;
    return 32;
  };

  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={[styles.container, { paddingHorizontal: responsivePadding }]}>
        <View style={styles.brandContainer}>
          <Ionicons name="compass-outline" size={24} color="#2563eb" />
          <Text style={styles.brandName}>BiteBrowse</Text>
        </View>
        
        <View style={styles.userContainer}>
          <Text style={styles.userGreeting}>Hello, John</Text>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.profileImage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  container: {
    height: 60, // Reduced height since SafeAreaView adds padding
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: 0.5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },
  userGreeting: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
});