import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext'; // Import theme hook

const RestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation();
  const { colors } = useTheme(); // Get theme colors

  const handlePress = () => {
    navigation.navigate('RestaurantDetails', { restaurant });
  };

  // Render rating badge
  const renderRatingBadge = () => (
    <View style={[styles.ratingBadge, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
      <Ionicons name="star" size={12} color="#FFF" />
      <Text style={styles.ratingText}>{restaurant.rating}</Text>
    </View>
  );

  // Render image with overlay
  const renderImage = () => {
    if (restaurant.image && typeof restaurant.image === 'string' && !restaurant.image.startsWith('http')) {
      return (
        <View style={styles.imageContainer}>
          <View style={[styles.emojiContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <Text style={styles.emojiText}>{restaurant.image}</Text>
          </View>
          {renderRatingBadge()}
        </View>
      );
    }
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        {renderRatingBadge()}
        {restaurant.isPureVeg && (
          <View style={[styles.vegBadge, { 
            backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: '#4CAF50' 
          }]}>
            <Text style={styles.vegText}>🟢 Pure Veg</Text>
          </View>
        )}
      </View>
    );
  };

  // Render delivery info chip
  const renderDeliveryChip = () => (
    <View style={[styles.deliveryChip, { backgroundColor: colors.background }]}>
      <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
      <Text style={[styles.deliveryChipText, { color: colors.textSecondary }]}>{restaurant.time}</Text>
    </View>
  );

  // Render discount badge
  const renderDiscountBadge = () => {
    if (!restaurant.discount) return null;
    
    return (
      <View style={[styles.discountBadge, { 
        backgroundColor: colors.isDark ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 107, 53, 0.1)' 
      }]}>
        <Ionicons name="pricetag-outline" size={10} color={colors.primary} />
        <Text style={[styles.discountText, { color: colors.primary }]}>{restaurant.discount}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={handlePress}>
      {renderImage()}
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
            {restaurant.name}
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: colors.text }]}>{restaurant.rating}</Text>
            <Text style={[styles.reviewsCount, { color: colors.textSecondary }]}>
              ({restaurant.reviewsCount})
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          {/* {renderDeliveryChip()} */}
          {/* {renderDiscountBadge()} */}
        </View>
        
        {restaurant.noPackagingCharges && (
          <View style={[styles.offerContainer, { 
            backgroundColor: colors.isDark ? 'rgba(0, 168, 80, 0.1)' : '#FFF8F6',
            borderLeftColor: colors.primary 
          }]}>
            <Ionicons name="leaf-outline" size={12} color={colors.primary} />
            <Text style={[styles.offerText, { color: colors.primary }]}>
              No packaging charges
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 160,
  },
  emojiContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  emojiText: {
    fontSize: 80,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  vegBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  vegText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  infoContainer: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  freeDeliveryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freeDeliveryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  cuisine: {
    fontSize: 14,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statSeparator: {
    width: 4,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsCount: {
    fontSize: 12,
  },
  distance: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  deliveryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  deliveryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
    borderLeftWidth: 3,
  },
  offerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RestaurantCard;