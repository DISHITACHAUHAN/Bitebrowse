// screens/PersonalInfoScreen.js
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Alert 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

export default function PersonalInfoScreen({ navigation }) {
  const { colors } = useTheme(); // Get theme colors
  
  const [userInfo, setUserInfo] = useState({
    fullName: "John Davidson",
    email: "john.d@example.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    zipCode: "10001"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Simulate save operation
    setIsEditing(false);
    Alert.alert("Success", "Your personal information has been updated successfully!");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const updateField = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Personal Information</Text>
            <Text style={styles.headerSubtitle}>Manage your profile details</Text>
          </View>
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editHeaderButton}
              onPress={handleEdit}
            >
              <Ionicons name="pencil-outline" size={20} color="#FFF" />
              <Text style={styles.editHeaderText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.cancelHeaderButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelHeaderText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Photo Section */}
        <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.changePhotoButton, { borderColor: colors.primary }]}
            disabled={!isEditing}
          >
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information Form */}
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                },
                isEditing && styles.inputEditing
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={userInfo.fullName}
              onChangeText={(text) => updateField('fullName', text)}
              editable={isEditing}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                },
                isEditing && styles.inputEditing
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={userInfo.email}
              onChangeText={(text) => updateField('email', text)}
              editable={isEditing}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                },
                isEditing && styles.inputEditing
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              value={userInfo.phoneNumber}
              onChangeText={(text) => updateField('phoneNumber', text)}
              editable={isEditing}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Address Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Street Address</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                },
                isEditing && styles.inputEditing
              ]}
              placeholder="Enter your street address"
              placeholderTextColor={colors.textSecondary}
              value={userInfo.address}
              onChangeText={(text) => updateField('address', text)}
              editable={isEditing}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={[styles.label, { color: colors.text }]}>City</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  },
                  isEditing && styles.inputEditing
                ]}
                placeholder="City"
                placeholderTextColor={colors.textSecondary}
                value={userInfo.city}
                onChangeText={(text) => updateField('city', text)}
                editable={isEditing}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.text }]}>ZIP Code</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  },
                  isEditing && styles.inputEditing
                ]}
                placeholder="ZIP Code"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={userInfo.zipCode}
                onChangeText={(text) => updateField('zipCode', text)}
                editable={isEditing}
              />
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Account Security Section */}
        <View style={[styles.securitySection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Security</Text>
          
          <TouchableOpacity 
            style={[styles.securityButton, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.securityButtonLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
              <Text style={[styles.securityButtonText, { color: colors.text }]}>
                Change Password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.securityButton, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('TwoFactorAuth')}
          >
            <View style={styles.securityButtonLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
              <Text style={[styles.securityButtonText, { color: colors.text }]}>
                Two-Factor Authentication
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
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
  editHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  editHeaderText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: "600",
  },
  cancelHeaderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelHeaderText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  photoSection: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoButton: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  inputEditing: {
    borderWidth: 2,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  securitySection: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  securityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  securityButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  securityButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
});