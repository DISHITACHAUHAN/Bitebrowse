// screens/PaymentMethodsScreen.js
import React, { useState } from "react";
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

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "credit_card", last4: "4242", brand: "Visa", isDefault: true },
    { id: 2, type: "paypal", email: "user@example.com", isDefault: false },
  ]);

  const { colors } = useTheme(); // Get theme colors

  const addPaymentMethod = () => {
    Alert.alert("Add Payment Method", "This feature will be implemented soon!");
  };

  const removePaymentMethod = (id) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: () => setPaymentMethods(paymentMethods.filter(method => method.id !== id))
        }
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
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <Text style={styles.headerSubtitle}>Manage your payment options</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Payment Methods</Text>
        
        {paymentMethods.map((method) => (
          <View key={method.id} style={[styles.paymentCard, { backgroundColor: colors.card }]}>
            <View style={styles.paymentInfo}>
              <Ionicons 
                name={method.type === "credit_card" ? "card" : "logo-paypal"} 
                size={24} 
                color={method.type === "credit_card" ? colors.primary : "#003087"} 
              />
              <View style={styles.paymentDetails}>
                <Text style={[styles.paymentText, { color: colors.text }]}>
                  {method.type === "credit_card" 
                    ? `${method.brand} •••• ${method.last4}` 
                    : `PayPal • ${method.email}`
                  }
                </Text>
                {method.isDefault && (
                  <Text style={[styles.defaultText, { color: colors.primary }]}>Default</Text>
                )}
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => removePaymentMethod(method.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.card }]} 
          onPress={addPaymentMethod}
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Payment Method</Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Secure & Encrypted</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your payment information is securely stored and encrypted. We never share your details with third parties.
            </Text>
          </View>
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "500",
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 6,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});