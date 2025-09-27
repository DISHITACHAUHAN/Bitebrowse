import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const MOCK_ALERTS = [
  { id: "1", title: "50% off at Spice Garden!", time: "2h ago", type: "promotion" },
  { id: "2", title: "New Italian restaurants added near you", time: "5h ago", type: "update" },
  { id: "3", title: "Your favorite Sushi place has a new dish 🍣", time: "1d ago", type: "favorite" },
  { id: "4", title: "Reminder: Order before 8 PM for free delivery", time: "2d ago", type: "reminder" },
  { id: "5", title: "Order delivered successfully! Rate your experience", time: "3d ago", type: "feedback" },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [activeTab, setActiveTab] = useState("all");

  const getIconName = (type) => {
    switch (type) {
      case "promotion": return "pricetag-outline";
      // case "update": return "restaurant-outline";
      case "favorite": return "heart-outline";
      case "reminder": return "time-outline";
      case "feedback": return "star-outline";
      default: return "notifications-outline";
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "promotion": return "#10b981";
      case "update": return "#3b82f6";
      case "favorite": return "#ef4444";
      case "reminder": return "#f59e0b";
      case "feedback": return "#8b5cf6";
      default: return "#6b7280";
    }
  };

  const filteredAlerts = activeTab === "all" 
    ? alerts 
    : alerts.filter(alert => alert.type === activeTab);

  const renderAlertItem = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${getIconColor(item.type)}15` }]}>
        <Ionicons name={getIconName(item.type)} size={20} color={getIconColor(item.type)} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertTime}>{item.time}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => removeAlert(item.id)}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={18} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const TabButton = ({ title, type, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === type && styles.activeTab]}
      onPress={() => setActiveTab(type)}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={activeTab === type ? "#ffffff" : getIconColor(type)} 
      />
      <Text style={[styles.tabText, activeTab === type && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <Text style={styles.navTitle}>Notifications</Text>
        {alerts.length > 0 && (
          <TouchableOpacity onPress={clearAllAlerts} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TabButton title="All" type="all" icon="notifications-outline" />
        <TabButton title="Promotions" type="promotion" icon="pricetag-outline" />
        <TabButton title="Updates" type="update" icon="restaurant-outline" />
        <TabButton title="Favorites" type="favorite" icon="heart-outline" />
      </View>

      {/* Alerts Content */}
      <View style={styles.container}>
        {filteredAlerts.length > 0 ? (
          <FlatList
            data={filteredAlerts}
            renderItem={renderAlertItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noAlerts}>
            <View style={styles.noAlertsIcon}>
              <Ionicons name="notifications-off-outline" size={80} color="#e5e7eb" />
            </View>
            <Text style={styles.noAlertsText}>No Notifications</Text>
            <Text style={styles.noAlertsSubtext}>
              {activeTab === "all" 
                ? "You're all caught up!" 
                : `No ${activeTab} notifications`
              }
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Navigation Bar */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16, // Added top padding
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
    marginTop: 8, // Additional top margin for extra spacing
  },
  navTitle: {
    fontSize: 22,
    paddingTop: 30,
    fontWeight: "700",
    color: "#1f2937",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    color: "#ef4444",
    fontSize: 14,
    paddingTop: 30,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginLeft: 4,
  },
  activeTabText: {
    color: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  listContainer: {
    padding: 20,
    paddingTop: 8, // Reduced top padding for list
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1f2937",
    lineHeight: 20,
  },
  alertTime: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
  },
  noAlerts: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: -40, // Adjust to center properly with top padding
  },
  noAlertsIcon: {
    marginBottom: 20,
  },
  noAlertsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 20,
  },
});