import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  Dimensions,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    setError("");

    if (email === "" || password === "") {
      setError("Please fill in both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Attempting login with:", email);
      
      // Login with proper user object structure
      const userData = { 
        id: Date.now().toString(),
        email: email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        isGuest: false,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      
      console.log("Calling login function with:", userData);
      login(userData);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    console.log("Guest login attempted");
    const guestUser = { 
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@example.com',
      avatar: 'https://i.pravatar.cc/150?img=45',
      isGuest: true,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    
    console.log("Calling login function with guest:", guestUser);
    login(guestUser);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    navigation.navigate("Signup");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Password reset feature will be available soon!",
      [{ text: "OK" }]
    );
  };

  // Demo credentials quick fill
  const fillDemoCredentials = () => {
    setEmail("demo@example.com");
    setPassword("123456");
    setError("");
  };

  return (
    <ImageBackground
      source={require('../assets/download.jpg')}
      style={styles.background}
      blurRadius={3}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Weather */}
          <View style={styles.header}>
            <View style={styles.weatherContainer}>
              <Ionicons name="partly-sunny" size={18} color="#1F2937" />
              <Text style={styles.weather}>33°C</Text>
              <Text style={styles.weatherText}>Sunny</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🍽️</Text>
              <Text style={styles.appName}>BiteNest</Text>
            </View>

            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your culinary journey
            </Text>

            
            {/* Form Section */}
            <View style={styles.form}>
              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="warning-outline" size={16} color="#DC2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  placeholderTextColor="#A1A1AA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#A1A1AA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  onSubmitEditing={handleLogin}
                  returnKeyType="go"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.loginButtonText}>Login</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Guest Login Button */}
              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
                disabled={isLoading}
              >
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
              </TouchableOpacity>

              {/* Sign Up Section */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>New to FoodExpress? </Text>
                <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                  <Text style={[styles.signupLink, isLoading && styles.disabledText]}>
                    Create an Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20, // Reduced from 24
    minHeight: height,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Reduced padding
    paddingBottom: 10, // Reduced padding
  },
  weatherContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10, // Reduced padding
    paddingVertical: 6, // Reduced padding
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4, // Reduced gap
  },
  weather: {
    fontSize: 14, // Smaller font
    fontWeight: '600',
    color: '#1F2937',
  },
  weatherText: {
    fontSize: 11, // Smaller font
    color: '#6B7280',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: height * 0.02, // Reduced margin
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20, // Reduced margin
  },
  logo: {
    fontSize: 42, // Slightly smaller
    marginBottom: 6, // Reduced margin
  },
  appName: {
    fontSize: 24, // Smaller font
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  welcomeTitle: {
    fontSize: 28, // Smaller font
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6, // Reduced margin
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14, // Smaller font
    color: '#6B7280',
    marginBottom: 24, // Reduced margin
    textAlign: 'center',
    lineHeight: 20, // Reduced line height
    paddingHorizontal: 10, // Added padding to prevent text overflow
  },
  demoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10, // Reduced padding
    paddingHorizontal: 14, // Reduced padding
    borderRadius: 10, // Smaller border radius
    marginBottom: 20, // Reduced margin
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'center',
  },
  demoButtonText: {
    color: '#FF6B6B',
    fontSize: 13, // Smaller font
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignSelf: 'center',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 12, // Reduced padding
    borderRadius: 10, // Smaller border radius
    marginBottom: 20, // Reduced margin
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Reduced gap
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13, // Smaller font
    fontWeight: '500',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 12, // Reduced margin
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14, // Smaller border radius
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Reduced shadow
    shadowOpacity: 0.04, // Reduced opacity
    shadowRadius: 4, // Reduced radius
    elevation: 1, // Reduced elevation
  },
  inputIcon: {
    marginLeft: 14, // Reduced margin
  },
  input: {
    flex: 1,
    height: 52, // Reduced height
    paddingHorizontal: 10, // Reduced padding
    fontSize: 15, // Smaller font
    color: '#1F2937',
  },
  passwordInput: {
    paddingRight: 46, // Adjusted for smaller eye button
  },
  eyeButton: {
    position: 'absolute',
    right: 12, // Reduced padding
    padding: 6, // Reduced padding
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20, // Reduced margin
  },
  forgotPasswordText: {
    color: '#FF6B6B',
    fontSize: 13, // Smaller font
    fontWeight: '600',
  },
  loginButton: {
    height: 52, // Reduced height
    backgroundColor: '#FF6B6B',
    borderRadius: 14, // Smaller border radius
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12, // Reduced margin
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 }, // Reduced shadow
    shadowOpacity: 0.25, // Reduced opacity
    shadowRadius: 12, // Reduced radius
    elevation: 6, // Reduced elevation
    flexDirection: 'row',
    gap: 6, // Reduced gap
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16, // Smaller font
    fontWeight: '700',
    letterSpacing: 0.3, // Reduced letter spacing
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Reduced margin
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 12, // Reduced padding
    color: '#6B7280',
    fontSize: 13, // Smaller font
    fontWeight: '500',
  },
  guestButton: {
    height: 52, // Reduced height
    backgroundColor: '#FFFFFF',
    borderRadius: 14, // Smaller border radius
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Reduced margin
    borderWidth: 2,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    gap: 6, // Reduced gap
  },
  guestButtonText: {
    color: '#6B7280',
    fontSize: 15, // Smaller font
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    color: '#6B7280',
    fontSize: 14, // Smaller font
  },
  signupLink: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 14, // Smaller font
  },
  disabledText: {
    opacity: 0.5,
  },
});