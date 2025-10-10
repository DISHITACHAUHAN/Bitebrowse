// screens/PrivacyPolicyScreen.js
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  StatusBar 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme(); // Get theme colors

  const policySections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes personal details, payment information, and your preferences.",
      icon: "document-text-outline"
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you. This helps us personalize your experience and ensure service quality.",
      icon: "shield-checkmark-outline"
    },
    {
      title: "3. Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share data with trusted partners who assist our operations.",
      icon: "share-social-outline"
    },
    {
      title: "4. Data Security",
      content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted and stored securely.",
      icon: "lock-closed-outline"
    },
    {
      title: "5. Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. Contact us to exercise these rights at any time.",
      icon: "person-outline"
    },
    {
      title: "6. Cookies & Tracking",
      content: "We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.",
      icon: "analytics-outline"
    },
    {
      title: "7. Data Retention",
      content: "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.",
      icon: "time-outline"
    },
    {
      title: "8. International Transfers",
      content: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.",
      icon: "globe-outline"
    },
    {
      title: "9. Children's Privacy",
      content: "Our services are not directed to individuals under 16. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete it.",
      icon: "heart-outline"
    },
    {
      title: "10. Contact Us",
      content: "If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@vittle.com. We're committed to addressing your concerns promptly.",
      icon: "mail-outline"
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
          <View style={styles.headerIconContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#FFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <Text style={styles.headerSubtitle}>Your data security is our priority</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryHeader}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Policy Overview</Text>
          </View>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            This Privacy Policy explains how Vittle collects, uses, and protects your personal information. 
            We are committed to maintaining the trust and confidence of our users.
          </Text>
          <View style={[styles.lastUpdated, { backgroundColor: colors.background }]}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.lastUpdatedText, { color: colors.textSecondary }]}>
              Last updated: January 2024 • Version 2.1
            </Text>
          </View>
        </View>

        {/* Policy Sections */}
        <View style={styles.sectionsContainer}>
          {policySections.map((section, index) => (
            <View key={index} style={[styles.sectionCard, { backgroundColor: colors.card }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={section.icon} size={18} color={colors.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {section.title}
                </Text>
              </View>
              <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Compliance Badges */}
        <View style={[styles.complianceCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.complianceTitle, { color: colors.text }]}>
            Compliance & Standards
          </Text>
          <View style={styles.complianceBadges}>
            <View style={[styles.badge, { backgroundColor: colors.background }]}>
              <Ionicons name="checkmark-done" size={16} color="#34C759" />
              <Text style={[styles.badgeText, { color: colors.text }]}>GDPR Compliant</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.background }]}>
              <Ionicons name="checkmark-done" size={16} color="#34C759" />
              <Text style={[styles.badgeText, { color: colors.text }]}>CCPA Ready</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.background }]}>
              <Ionicons name="checkmark-done" size={16} color="#34C759" />
              <Text style={[styles.badgeText, { color: colors.text }]}>Data Encrypted</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={[styles.contactCard, { backgroundColor: colors.card }]}>
          <View style={styles.contactHeader}>
            <Ionicons name="mail" size={24} color={colors.primary} />
            <Text style={[styles.contactTitle, { color: colors.text }]}>
              Questions or Concerns?
            </Text>
          </View>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            Our privacy team is here to help you understand our practices and address any concerns you may have about your personal data.
          </Text>
          <View style={styles.contactDetails}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactDetail, { color: colors.primary }]}>
                privacy@vittle.com
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.contactDetail, { color: colors.textSecondary }]}>
                Response within 48 hours
              </Text>
            </View>
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
    alignItems: "center",
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
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
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  lastUpdated: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  lastUpdatedText: {
    fontSize: 12,
    fontWeight: "500",
  },
  sectionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  complianceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  complianceBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  contactCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    color: "#666",
  },
  contactDetails: {
    gap: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactDetail: {
    fontSize: 14,
    fontWeight: "500",
  },
});