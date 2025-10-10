// screens/MyReviewsScreen.js
import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

export default function MyReviewsScreen() {
  const { colors } = useTheme(); // Get theme colors

  const reviews = [
    { 
      id: 1, 
      restaurant: "Foodie Bistro", 
      dish: "Margherita Pizza",
      rating: 5, 
      comment: "Absolutely delicious! The crust was perfectly crispy and the fresh basil made all the difference. Will definitely order again!",
      date: "2024-01-10",
      helpful: 12
    },
    { 
      id: 2, 
      restaurant: "Chai Adda", 
      dish: "Traditional Masala Chai",
      rating: 4, 
      comment: "Aromatic and perfectly spiced chai. The ginger and cardamom notes were exceptional, though it could be a bit stronger. Will definitely return!",
      date: "2024-01-05",
      helpful: 5
    },
    { 
      id: 3, 
      restaurant: "Doctor Dosa", 
      dish: "Masala Dosa",
      rating: 5, 
      comment: "Crispy and flavorful dosa. The batter was perfectly fermented and golden brown, though the potato filling could use more seasoning. Great chutneys!",
      date: "2023-12-20",
      helpful: 8
    },
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color="#FF9500"
      />
    ));
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
            <Text style={styles.headerTitle}>My Reviews</Text>
            <Text style={styles.headerSubtitle}>
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} • Your culinary journey
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0}
              </Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {reviews.length > 0 ? (
          <>
            {/* Reviews Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
              <View style={styles.summaryItem}>
                <Ionicons name="restaurant" size={24} color={colors.primary} />
                <View style={styles.summaryText}>
                  <Text style={[styles.summaryNumber, { color: colors.text }]}>
                    {reviews.length}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                    Restaurants Reviewed
                  </Text>
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Ionicons name="star" size={24} color="#FF9500" />
                <View style={styles.summaryText}>
                  <Text style={[styles.summaryNumber, { color: colors.text }]}>
                    {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                    Average Rating
                  </Text>
                </View>
              </View>
            </View>

            {/* Reviews List */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              My Food Reviews ({reviews.length})
            </Text>
            
            {reviews.map((review) => (
              <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.card }]}>
                <View style={styles.reviewHeader}>
                  <View style={styles.restaurantInfo}>
                    <Text style={[styles.restaurantName, { color: colors.text }]}>
                      {review.restaurant}
                    </Text>
                    <Text style={[styles.dishName, { color: colors.primary }]}>
                      {review.dish}
                    </Text>
                  </View>
                  <View style={[styles.ratingBadge, { backgroundColor: colors.isDark ? 'rgba(255, 149, 0, 0.2)' : '#fff7ed' }]}>
                    <Ionicons name="star" size={14} color="#FF9500" />
                    <Text style={[styles.ratingNumber, { color: '#FF9500' }]}>{review.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.ratingContainer}>
                  <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                    {review.date}
                  </Text>
                </View>
                
                <Text style={[styles.reviewComment, { color: colors.text }]}>
                  {review.comment}
                </Text>
                
                <View style={styles.reviewFooter}>
                  <View style={styles.helpfulSection}>
                    <Ionicons name="thumbs-up-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
                      {review.helpful} people found this helpful
                    </Text>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.editButton, { 
                      backgroundColor: colors.isDark ? 'rgba(0, 122, 255, 0.2)' : '#f0f8ff',
                      borderColor: colors.primary 
                    }]}>
                      <Ionicons name="pencil-outline" size={14} color={colors.primary} />
                      <Text style={[styles.editButtonText, { color: colors.primary }]}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[styles.deleteButton, { 
                      backgroundColor: colors.isDark ? 'rgba(255, 59, 48, 0.2)' : '#fef2f2' 
                    }]}>
                      <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name="restaurant-outline" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              NO FOOD REVIEWS YET
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              You haven't reviewed any restaurants or dishes yet. Share your culinary experiences and help others discover great food!
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
  headerStats: {
    alignItems: "flex-end",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  summaryCard: {
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
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  summaryText: {
    marginLeft: 12,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  dishName: {
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: "700",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helpfulSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  helpfulText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
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