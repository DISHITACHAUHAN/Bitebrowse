import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BottomNavbar({ active, setActive }) {
  const navigation = useNavigation();

  const tabs = [
    { name: "Home", icon: { active: "home", inactive: "home-outline" }, label: "Home" },
    { name: "Explore", icon: { active: "search", inactive: "search-outline" }, label: "Explore" },
    { name: "Alerts", icon: { active: "notifications", inactive: "notifications-outline" }, label: "Alerts" },
    { name: "Profile", icon: { active: "person", inactive: "person-outline" }, label: "Profile" }
  ];

  const handlePress = (tabName) => {
    setActive(tabName);
    navigation.navigate(tabName); // Navigate to the corresponding screen
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = active === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabButton, isActive && styles.activeTab]}
            onPress={() => handlePress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={isActive ? tab.icon.active : tab.icon.inactive}
                size={22}
                color={isActive ? "#2563eb" : "#64748b"}
              />
              {tab.name === "Alerts" && !isActive && (
                <View style={styles.notificationDot} />
              )}
            </View>
            <Text style={[
              styles.tabText,
              isActive ? styles.activeTabText : styles.inactiveTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#f8fafc",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 4,
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  activeTabText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  inactiveTabText: {
    color: "#64748b",
  },
});
