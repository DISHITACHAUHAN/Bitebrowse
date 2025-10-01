import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOCK_ALERTS = [
  { id: "1", title: "50% off at Spice Garden!", time: "2h ago", type: "promotion" },
  { id: "2", title: "New Italian restaurants added near you", time: "5h ago", type: "update" },
  { id: "3", title: "Your favorite Sushi place has a new dish 🍣", time: "1d ago", type: "favorite" },
  { id: "4", title: "Reminder: Order before 8 PM for free delivery", time: "2d ago", type: "reminder" },
  { id: "5", title: "Order delivered successfully! Rate your experience", time: "3d ago", type: "feedback" },
  { id: "6", title: "Weekend Special: Buy 1 Get 1 Free", time: "4h ago", type: "promotion" },
  { id: "7", title: "New burger joint opening downtown", time: "6h ago", type: "update" },
];

const ALERT_TYPES = [
  { type: "all", title: "All", icon: "notifications-outline", color: "#6b7280" },
  { type: "promotion", title: "Deals", icon: "pricetag-outline", color: "#10b981" },
  { type: "update", title: "Updates", icon: "restaurant-outline", color: "#3b82f6" },
  { type: "favorite", title: "Favorites", icon: "heart-outline", color: "#ef4444" },
  { type: "reminder", title: "Reminders", icon: "time-outline", color: "#f59e0b" },
  { type: "feedback", title: "Feedback", icon: "star-outline", color: "#8b5cf6" },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [activeTab, setActiveTab] = useState("all");

  const filteredAlerts = activeTab === "all" 
    ? alerts 
    : alerts.filter(alert => alert.type === activeTab);

  const getAlertType = (type) => {
    return ALERT_TYPES.find(t => t.type === type) || ALERT_TYPES[0];
  };

  const renderAlertItem = ({ item }) => {
    const alertType = getAlertType(item.type);
    
    return (
      <TouchableOpacity style={styles.alertCard}>
        <View style={[styles.iconContainer, { backgroundColor: `${alertType.color}15` }]}>
          <Ionicons name={alertType.icon} size={20} color={alertType.color} />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <View style={styles.alertFooter}>
            <Text style={styles.alertTime}>{item.time}</Text>
            <View style={[styles.typeBadge, { backgroundColor: `${alertType.color}15` }]}>
              <Text style={[styles.typeText, { color: alertType.color }]}>
                {alertType.title}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => removeAlert(item.id)}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const restoreAlerts = () => {
    setAlerts(MOCK_ALERTS);
  };

  const TabButton = ({ type, title, icon, color }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === type && styles.activeTab]}
      onPress={() => setActiveTab(type)}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={activeTab === type ? "#ffffff" : color} 
      />
      <Text style={[styles.tabText, activeTab === type && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {alerts.length > 0 ? (
            <TouchableOpacity onPress={clearAllAlerts} style={styles.actionButton}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={restoreAlerts} style={styles.actionButton}>
              <Text style={styles.restoreText}>Restore</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {filteredAlerts.length} {filteredAlerts.length === 1 ? 'notification' : 'notifications'}
        </Text>
        {activeTab !== "all" && (
          <TouchableOpacity onPress={() => setActiveTab("all")}>
            <Text style={styles.showAllText}>Show All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs - Scrollable */}
      <View style={styles.tabScrollContainer}>
        <FlatList
          horizontal
          data={ALERT_TYPES}
          renderItem={({ item }) => (
            <TabButton 
              type={item.type} 
              title={item.title} 
              icon={item.icon} 
              color={item.color} 
            />
          )}
          keyExtractor={item => item.type}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        />
      </View>

      {/* Alerts List */}
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
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons 
                name={activeTab === "all" ? "notifications-off-outline" : "filter-outline"} 
                size={80} 
                color="#d1d5db" 
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === "all" ? "No Notifications" : `No ${getAlertType(activeTab).title}`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "all" 
                ? "You're all caught up with your notifications!" 
                : `You don't have any ${getAlertType(activeTab).title.toLowerCase()} notifications`
              }
            </Text>
            {activeTab !== "all" && (
              <TouchableOpacity 
                style={styles.showAllButton}
                onPress={() => setActiveTab("all")}
              >
                <Text style={styles.showAllButtonText}>View All Notifications</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  restoreText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
  },
  statsText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  showAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
  tabScrollContainer: {
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeTab: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginLeft: 6,
  },
  activeTabText: {
    color: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  listContainer: {
    padding: 16,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    lineHeight: 22,
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertTime: {
    fontSize: 13,
    color: "#6b7280",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    marginLeft: 8,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  showAllButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  showAllButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});