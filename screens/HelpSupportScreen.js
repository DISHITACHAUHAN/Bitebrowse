// screens/HelpSupportScreen.js
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Linking,
  StatusBar 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

export default function HelpSupportScreen() {
  const { colors } = useTheme(); // Get theme colors

  const supportItems = [
    {
      icon: "chatbubble-ellipses-outline",
      title: "Live Chat Support",
      description: "Chat with our support team in real-time",
      onPress: () => console.log("Live Chat pressed"),
      color: "#007AFF"
    },
    {
      icon: "call-outline",
      title: "Phone Support",
      description: "Call us directly for immediate assistance",
      onPress: () => Linking.openURL('tel:+15551234567'),
      color: "#34C759"
    },
    {
      icon: "mail-outline",
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      onPress: () => Linking.openURL('mailto:support@vittle.com'),
      color: "#FF9500"
    },
    {
      icon: "help-circle-outline",
      title: "FAQs",
      description: "Find answers to frequently asked questions",
      onPress: () => console.log("FAQs pressed"),
      color: "#8E8E93"
    },
    {
      icon: "document-text-outline",
      title: "User Guide",
      description: "Complete user manual and guide",
      onPress: () => console.log("User Guide pressed"),
      color: "#5856D6"
    },
    {
      icon: "warning-outline",
      title: "Report a Problem",
      description: "Report any issues or bugs you've encountered",
      onPress: () => console.log("Report Problem pressed"),
      color: "#FF3B30"
    },
  ];

  const quickSolutions = [
    {
      title: "Order Issues",
      description: "Problems with your orders or deliveries"
    },
    {
      title: "Payment Problems",
      description: "Issues with payments or refunds"
    },
    {
      title: "Account Settings",
      description: "Manage your account and preferences"
    },
    {
      title: "App Features",
      description: "Learn how to use app features"
    }
  ];

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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <Text style={styles.headerSubtitle}>We're here to help you 24/7</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="headset-outline" size={24} color="#FFF" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Quick Help Section */}
        <View style={[styles.quickHelpCard, { backgroundColor: colors.card }]}>
          <View style={styles.quickHelpHeader}>
            <Ionicons name="flash-outline" size={20} color={colors.primary} />
            <Text style={[styles.quickHelpTitle, { color: colors.text }]}>Quick Help</Text>
          </View>
          <Text style={[styles.quickHelpText, { color: colors.textSecondary }]}>
            Find quick solutions to common problems
          </Text>
          
          <View style={styles.quickSolutionsGrid}>
            {quickSolutions.map((solution, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.solutionItem, 
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border
                  }
                ]}
              >
                <Text style={[styles.solutionTitle, { color: colors.text }]}>
                  {solution.title}
                </Text>
                <Text style={[styles.solutionDescription, { color: colors.textSecondary }]}>
                  {solution.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Options */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Support Options</Text>
        
        {supportItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.supportItem, { backgroundColor: colors.card }]} 
            onPress={item.onPress}
          >
            <View style={styles.supportLeft}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.supportInfo}>
                <Text style={[styles.supportTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.supportDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        {/* Contact Information */}
        <View style={[styles.contactInfo, { backgroundColor: colors.card }]}>
          <View style={styles.contactHeader}>
            <Ionicons name="business-outline" size={20} color={colors.primary} />
            <Text style={[styles.contactTitle, { color: colors.text }]}>Contact Information</Text>
          </View>
          
          <View style={styles.contactDetails}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                support@vittle.com
              </Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="call" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                +1 (555) 123-4567
              </Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                Mon-Fri: 9AM-6PM EST
              </Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="globe-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                www.vittle.com/support
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Section */}
        <View style={[styles.emergencyCard, { 
          backgroundColor: colors.isDark ? 'rgba(255, 59, 48, 0.1)' : '#fef2f2',
          borderColor: colors.isDark ? 'rgba(255, 59, 48, 0.3)' : '#fecaca'
        }]}>
          <Ionicons name="warning" size={24} color="#FF3B30" />
          <View style={styles.emergencyContent}>
            <Text style={[styles.emergencyTitle, { color: colors.text }]}>
              Urgent Assistance
            </Text>
            <Text style={[styles.emergencyText, { color: colors.textSecondary }]}>
              For urgent order issues or safety concerns, call our emergency line immediately
            </Text>
            <TouchableOpacity 
              style={[styles.emergencyButton, { backgroundColor: '#FF3B30' }]}
              onPress={() => Linking.openURL('tel:+15551234567')}
            >
              <Ionicons name="call" size={16} color="#FFF" />
              <Text style={styles.emergencyButtonText}>Call Emergency Line</Text>
            </TouchableOpacity>
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  quickHelpCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickHelpHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quickHelpTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  quickHelpText: {
    fontSize: 14,
    marginBottom: 16,
  },
  quickSolutionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  solutionItem: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  solutionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  solutionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  supportItem: {
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
  supportLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
  },
  contactInfo: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  contactDetails: {
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  emergencyCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyContent: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  emergencyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});