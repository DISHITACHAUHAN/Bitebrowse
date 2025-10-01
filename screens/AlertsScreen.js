import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView,
  RefreshControl,
  Animated,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOCK_ALERTS = [
  { 
    id: "1", 
    title: "50% off at Spice Garden!", 
    time: "2h ago", 
    type: "promotion",
    read: false,
    description: "Enjoy half price on all main courses this weekend only!"
  },
  { 
    id: "2", 
    title: "New Italian restaurants added near you", 
    time: "5h ago", 
    type: "update",
    read: false,
    description: "3 new Italian restaurants are now available for delivery"
  },
  { 
    id: "3", 
    title: "Your favorite Sushi place has a new dish 🍣", 
    time: "1d ago", 
    type: "favorite",
    read: true,
    description: "Check out the new Dragon Roll at Tokyo Sushi"
  },
  { 
    id: "4", 
    title: "Reminder: Order before 8 PM for free delivery", 
    time: "2d ago", 
    type: "reminder",
    read: true,
    description: "Place your order before 8 PM to get free delivery"
  },
  { 
    id: "5", 
    title: "Order delivered successfully! Rate your experience", 
    time: "3d ago", 
    type: "feedback",
    read: true,
    description: "How was your recent order from Burger King?"
  },
  { 
    id: "6", 
    title: "Weekend Special: Buy 1 Get 1 Free", 
    time: "4h ago", 
    type: "promotion",
    read: false,
    description: "All pizzas are buy one get one free this weekend"
  },
  { 
    id: "7", 
    title: "New burger joint opening downtown", 
    time: "6h ago", 
    type: "update",
    read: false,
    description: "Burger Factory is now open with 20% off first orders"
  },
];

const ALERT_TYPES = [
  { type: "all", title: "All", icon: "notifications-outline", color: "#6b7280" },
  { type: "promotion", title: "Deals", icon: "pricetag-outline", color: "#10b981" },
  { type: "update", title: "Updates", icon: "restaurant-outline", color: "#3b82f6" },
  { type: "favorite", title: "Favorites", icon: "heart-outline", color: "#ef4444" },
  { type: "reminder", title: "Reminders", icon: "time-outline", color: "#f59e0b" },
  { type: "feedback", title: "Feedback", icon: "star-outline", color: "#8b5cf6" },
];

export default function AlertsScreen({ navigation }) {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const filteredAlerts = activeTab === "all" 
    ? alerts 
    : alerts.filter(alert => alert.type === activeTab);

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const getAlertType = (type) => {
    return ALERT_TYPES.find(t => t.type === type) || ALERT_TYPES[0];
  };

  const removeAlertWithAnimation = (id) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      removeAlert(id);
      // Reset animation for next item
      fadeAnim.setValue(1);
    });
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const clearAllAlerts = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => setAlerts([])
        }
      ]
    );
  };

  const restoreAlerts = () => {
    setAlerts(MOCK_ALERTS);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts(MOCK_ALERTS);
      setRefreshing(false);
    }, 1500);
  };

  const renderAlertItem = ({ item }) => {
    const alertType = getAlertType(item.type);
    
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity 
          style={[
            styles.alertCard,
            !item.read && styles.unreadAlert
          ]}
          onPress={() => markAsRead(item.id)}
          activeOpacity={0.7}
        >
          {!item.read && <View style={styles.unreadDot} />}
          
          <View style={[styles.iconContainer, { backgroundColor: `${alertType.color}15` }]}>
            <Ionicons name={alertType.icon} size={20} color={alertType.color} />
          </View>
          
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertDescription} numberOfLines={2}>
              {item.description}
            </Text>
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
            onPress={() => removeAlertWithAnimation(item.id)}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const TabButton = ({ type, title, icon, color }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === type && styles.activeTab]}
      onPress={() => setActiveTab(type)}
      activeOpacity={0.7}
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

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons 
          name={activeTab === "all" ? "notifications-off-outline" : "filter-outline"} 
          size={80} 
          color="#d1d5db" 
        />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === "all" ? "No Notifications Yet" : `No ${getAlertType(activeTab).title}`}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "all" 
          ? "We'll notify you when something exciting happens!" 
          : `You don't have any ${getAlertType(activeTab).title.toLowerCase()} right now`
        }
      </Text>
      {activeTab !== "all" ? (
        <TouchableOpacity 
          style={styles.showAllButton}
          onPress={() => setActiveTab("all")}
        >
          <Text style={styles.showAllButtonText}>View All Notifications</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.exploreButtonText}>Explore Restaurants</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Main Container with Top Padding */}
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.unreadCount}>
                {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
              </Text>
            )}
          </View>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity 
                onPress={markAllAsRead} 
                style={styles.actionButton}
              >
                <Text style={styles.markReadText}>Mark all read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => navigation.navigate('NotificationSettings')} 
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={22} color="#6b7280" />
            </TouchableOpacity>
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
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#3b82f6"]}
                  tintColor="#3b82f6"
                />
              }
            />
          ) : (
            <EmptyState />
          )}
        </View>

        {/* Clear All FAB */}
        {filteredAlerts.length > 0 && (
          <TouchableOpacity 
            style={styles.clearAllFAB}
            onPress={clearAllAlerts}
          >
            <Ionicons name="trash-outline" size={20} color="#ffffff" />
            <Text style={styles.clearAllFABText}>Clear All</Text>
          </TouchableOpacity>
        )}

        {/* Restore Button for Empty State */}
        {alerts.length === 0 && (
          <TouchableOpacity 
            style={styles.restoreFAB}
            onPress={restoreAlerts}
          >
            <Ionicons name="refresh-outline" size={20} color="#ffffff" />
            <Text style={styles.restoreFABText}>Restore</Text>
          </TouchableOpacity>
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
  mainContainer: {
    flex: 1,
    paddingTop: 20, // Added top padding here
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  unreadCount: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  markReadText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
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
  settingsButton: {
    padding: 4,
    borderRadius: 8,
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
    paddingTop: 8, // Added extra top padding for the list
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
    position: "relative",
  },
  unreadAlert: {
    backgroundColor: "#f0f9ff",
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    position: "absolute",
    left: 8,
    top: 8,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 22,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
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
    fontWeight: "500",
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
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 20, // Added top margin for empty state
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
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
  exploreButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  clearAllFAB: {
    position: "absolute",
    bottom: 30, // Increased bottom padding
    right: 20,
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clearAllFABText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  restoreFAB: {
    position: "absolute",
    bottom: 30, // Increased bottom padding
    right: 20,
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  restoreFABText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});