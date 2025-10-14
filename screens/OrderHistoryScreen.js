// screens/OrderHistoryScreen.js
import React, { useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  BackHandler,
  StatusBar 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

export default function OrderHistoryScreen({ navigation }) {
  const { colors } = useTheme(); // Get theme colors

  const orders = [
    { 
      id: 1, 
      date: "2024-01-15",  
      status: "Delivered", 
      items: 3, 
      total: "₹1,250",
      restaurant: "Burger King"
    },
    { 
      id: 2, 
      date: "2024-01-10", 
      status: "Delivered", 
      items: 2, 
      total: "₹850",
      restaurant: "Pizza Hut"
    },
    { 
      id: 3, 
      date: "2024-01-05",  
      status: "Cancelled", 
      items: 4, 
      total: "₹1,800",
      restaurant: "Domino's"
    },
    { 
      id: 4, 
      date: "2023-12-28",  
      status: "Delivered", 
      items: 1, 
      total: "₹450",
      restaurant: "McDonald's"
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#34C759";
      case "Cancelled":
        return "#FF3B30";
      case "Processing":
        return "#FF9500";
      default:
        return "#FF9500";
    }
  };

  const getStatusBackground = (status) => {
    switch (status) {
      case "Delivered":
        return colors.isDark ? 'rgba(52, 199, 89, 0.2)' : '#f0fdf4';
      case "Cancelled":
        return colors.isDark ? 'rgba(255, 59, 48, 0.2)' : '#fef2f2';
      case "Processing":
        return colors.isDark ? 'rgba(255, 149, 0, 0.2)' : '#fff7ed';
      default:
        return colors.isDark ? 'rgba(255, 149, 0, 0.2)' : '#fff7ed';
    }
  };

  // 🔙 Handle manual Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("Profile"); // Always go to ProfileScreen
      return true; // prevent default behavior
    });

    return () => backHandler.remove();
  }, [navigation]);

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
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>Your past orders and deliveries</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Stats Summary */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{orders.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#34C759' }]}>
              {orders.filter(order => order.status === 'Delivered').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#FF3B30' }]}>
              {orders.filter(order => order.status === 'Cancelled').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cancelled</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>

        {orders.map((order) => (
          <View key={order.id} style={[styles.orderCard, { backgroundColor: colors.card }]}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={[styles.orderDate, { color: colors.text }]}>{order.date}</Text>
                <Text style={[styles.restaurantName, { color: colors.textSecondary }]}>
                  {order.restaurant}
                </Text>
              </View>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusBackground(order.status) }
              ]}>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                  {order.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.orderItems}>
                <Ionicons name="fast-food-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.orderItemsText, { color: colors.textSecondary }]}>
                  {order.items} item{order.items !== 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={[styles.orderTotal, { color: colors.text }]}>{order.total}</Text>
            </View>
            
            <View style={[styles.orderFooter, { borderTopColor: colors.isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }]}>
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
              >
                <Text style={[styles.detailsButtonText, { color: colors.primary }]}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
              
              {order.status === 'Delivered' && (
                <TouchableOpacity style={styles.reorderButton}>
                  <Ionicons name="refresh" size={16} color="#34C759" />
                  <Text style={styles.reorderButtonText}>Reorder</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Empty state would go here */}
        {orders.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name="receipt-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Your order history will appear here once you start ordering
            </Text>
            <TouchableOpacity 
              style={[styles.exploreButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreButtonText}>Explore Restaurants</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  orderItemsText: {
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    gap: 4,
  },
  reorderButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: '#34C759',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});