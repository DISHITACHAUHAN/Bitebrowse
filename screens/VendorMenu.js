import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext"; // Import theme hook

export default function VendorMenu() {
  const [menu, setMenu] = useState([
    { id: "1", name: "Classic Burger", price: "150", available: true, category: "Burgers", description: "Juicy beef patty with fresh veggies" },
    { id: "2", name: "Margherita Pizza", price: "300", available: true, category: "Pizzas", description: "Fresh tomato and mozzarella" },
    { id: "3", name: "French Fries", price: "99", available: true, category: "Sides", description: "Crispy golden fries" },
    { id: "4", name: "Chocolate Shake", price: "180", available: false, category: "Beverages", description: "Rich chocolate milkshake" },
  ]);

  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", description: "" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All", "Burgers", "Pizzas", "Sides", "Beverages", "Desserts"]);
  const { colors } = useTheme(); // Get theme colors

  const addItem = () => {
    if (!newItem.name.trim() || !newItem.price.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }
    
    if (isNaN(newItem.price) || parseFloat(newItem.price) <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price");
      return;
    }

    // Determine category - use input or default to "Uncategorized"
    const itemCategory = newItem.category.trim() || "Uncategorized";
    
    // Add new category to categories list if it doesn't exist and it's not "Uncategorized"
    if (itemCategory !== "Uncategorized" && !categories.includes(itemCategory)) {
      setCategories(prevCategories => [...prevCategories, itemCategory]);
    }

    setMenu([
      ...menu,
      { 
        id: Date.now().toString(), 
        name: newItem.name.trim(), 
        price: newItem.price, 
        category: itemCategory,
        description: newItem.description.trim() || "No description available",
        available: true 
      },
    ]);
    setNewItem({ name: "", price: "", category: "", description: "" });
    Keyboard.dismiss();
  };

  const toggleAvailability = (id) => {
    setMenu(
      menu.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const deleteItem = (id) => {
    const itemToDelete = menu.find(item => item.id === id);
    
    Alert.alert(
      "Delete Menu Item",
      `Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`,
      [
        { text: "Keep Item", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setMenu(menu.filter((item) => item.id !== id));
            // Check if we should remove the category if no items left in it
            setTimeout(() => updateCategories(), 100);
          }
        },
      ]
    );
  };

  // Update categories based on current menu items
  const updateCategories = () => {
    const menuCategories = ["All", ...new Set(menu.map(item => item.category).filter(Boolean))];
    setCategories(menuCategories);
  };

  const filteredMenu = activeCategory === "All" 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  const getCategoryStats = () => {
    const stats = {};
    menu.forEach(item => {
      stats[item.category] = (stats[item.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  const renderMenuItem = ({ item }) => (
    <View style={[styles.menuCard, { 
      backgroundColor: colors.card,
      borderLeftColor: colors.primary 
    }]}>
      <View style={styles.itemHeader}>
        <View style={styles.itemMainInfo}>
          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: colors.background }]}>
            <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>{item.category}</Text>
          </View>
        </View>
        <View style={[styles.priceContainer, { 
          backgroundColor: colors.isDark ? 'rgba(220, 38, 38, 0.2)' : '#fef2f2' 
        }]}>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.price}</Text>
        </View>
      </View>
      
      <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
      
      <View style={styles.itemFooter}>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            item.available ? styles.availableIndicator : styles.unavailableIndicator,
            { backgroundColor: item.available ? '#16a34a' : colors.error }
          ]} />
          <Text style={[
            styles.statusText,
            { color: item.available ? '#16a34a' : colors.error }
          ]}>
            {item.available ? "Available" : "Out of Stock"}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              item.available ? styles.makeUnavailableBtn : styles.makeAvailableBtn,
              { 
                backgroundColor: item.available 
                  ? (colors.isDark ? 'rgba(220, 38, 38, 0.2)' : '#fef2f2')
                  : (colors.isDark ? 'rgba(22, 163, 74, 0.2)' : '#f0fdf4'),
                borderColor: item.available ? colors.error : '#16a34a'
              }
            ]}
            onPress={() => toggleAvailability(item.id)}
          >
            <Text style={[
              styles.actionBtnText,
              { color: item.available ? colors.error : '#16a34a' }
            ]}>
              {item.available ? "Mark Unavailable" : "Mark Available"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.deleteActionBtn, { 
              backgroundColor: colors.isDark ? 'rgba(220, 38, 38, 0.2)' : '#fef2f2',
              borderColor: colors.error 
            }]}
            onPress={() => deleteItem(item.id)}
          >
            <Text style={[styles.deleteActionText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#8B3358" 
      />
      
      {/* Header with LinearGradient */}
      <LinearGradient
        colors={["#8B3358", "#670D2F", "#3A081C"]}
        start={{ x: 0, y: 1 }}   // bottom-left
        end={{ x: 1, y: 0 }}     // top-right
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>🍔 Menu Management</Text>
          <Text style={styles.subtitle}>
            Manage your restaurant menu items
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{menu.length}</Text>
            <Text style={styles.statLabel}>
              Total Items
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{menu.filter(item => item.available).length}</Text>
            <Text style={styles.statLabel}>
              Available
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{categories.length - 1}</Text>
            <Text style={styles.statLabel}>
              Categories
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add New Item Section */}
        <View style={styles.addItemSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Add New Menu Item</Text>
          <View style={[styles.formCard, { backgroundColor: colors.card }]}>
            <View style={styles.formRow}>
              <TextInput
                placeholder="Item Name *"
                placeholderTextColor={colors.textSecondary}
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
              />
              <TextInput
                placeholder="Price (₹) *"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={newItem.price}
                onChangeText={(text) => setNewItem({ ...newItem, price: text })}
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
              />
            </View>
            
            <View style={styles.categoryInputContainer}>
              <TextInput
                placeholder="Category (type to create new)"
                placeholderTextColor={colors.textSecondary}
                value={newItem.category}
                onChangeText={(text) => setNewItem({ ...newItem, category: text })}
                style={[styles.fullWidthInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
              />
              {newItem.category.trim() && !categories.includes(newItem.category.trim()) && (
                <Text style={[styles.newCategoryHint, { color: colors.primary }]}>
                  ↗ New category will be created
                </Text>
              )}
            </View>
            
            <TextInput
              placeholder="Description"
              placeholderTextColor={colors.textSecondary}
              value={newItem.description}
              onChangeText={(text) => setNewItem({ ...newItem, description: text })}
              style={[styles.descriptionInput, { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text 
              }]}
              multiline
              numberOfLines={2}
            />
            
            <TouchableOpacity 
              style={[
                styles.addButton,
                { backgroundColor: colors.primary },
                (!newItem.name.trim() || !newItem.price.trim()) && styles.addButtonDisabled
              ]} 
              onPress={addItem}
              disabled={!newItem.name.trim() || !newItem.price.trim()}
            >
              <Text style={styles.addButtonText}>
                {newItem.category.trim() && !categories.includes(newItem.category.trim()) 
                  ? "+ Add Item & Create Category" 
                  : "+ Add to Menu"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
            <Text style={[styles.categoriesCount, { color: colors.textSecondary }]}>
              ({categories.length - 1} categories)
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border 
                  },
                  activeCategory === category && [
                    styles.activeCategoryChip,
                    { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: colors.textSecondary },
                  activeCategory === category && styles.activeCategoryText
                ]}>
                  {category}
                </Text>
                {category !== "All" && (
                  <Text style={[
                    styles.categoryCount,
                    { 
                      backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                      color: colors.textSecondary 
                    },
                    activeCategory === category && [
                      styles.activeCategoryCount,
                      { color: colors.white, backgroundColor: 'rgba(255,255,255,0.2)' }
                    ]
                  ]}>
                    {categoryStats[category] || 0}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu List */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {activeCategory === "All" ? "All Menu Items" : activeCategory}
              <Text style={[styles.itemCount, { color: colors.primary }]}> ({filteredMenu.length})</Text>
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              {activeCategory === "All" 
                ? "All categories" 
                : `${filteredMenu.length} item${filteredMenu.length !== 1 ? 's' : ''} in this category`
              }
            </Text>
          </View>

          {filteredMenu.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={styles.emptyStateEmoji}>🍽️</Text>
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                {activeCategory === "All" ? "No items in menu" : `No items in ${activeCategory}`}
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {activeCategory === "All" 
                  ? "Add your first menu item to get started!" 
                  : `Add items to the ${activeCategory} category`}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredMenu}
              keyExtractor={(item) => item.id}
              renderItem={renderMenuItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={styles.menuList}
            />
          )}
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
    marginBottom: 15,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold",
    marginBottom: 4,
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    color: 'rgba(255,255,255,0.9)',
  },
  addItemSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  formCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  formInput: {
    flex: 1,
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },
  categoryInputContainer: {
    marginBottom: 12,
  },
  fullWidthInput: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
  },
  newCategoryHint: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  descriptionInput: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: "#cbd5e1",
    shadowOpacity: 0,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoriesCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  activeCategoryChip: {
    // Styles handled inline
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#ffffff",
  },
  categoryCount: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeCategoryCount: {
    // Styles handled inline
  },
  menuSection: {
    padding: 20,
    paddingTop: 0,
  },
  itemCount: {
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  menuList: {
    flexGrow: 0,
  },
  menuCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemMainInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  itemCategory: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  priceContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availableIndicator: {
    // Background handled inline
  },
  unavailableIndicator: {
    // Background handled inline
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  availableText: {
    // Color handled inline
  },
  unavailableText: {
    // Color handled inline
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  makeAvailableBtn: {
    // Styles handled inline
  },
  makeUnavailableBtn: {
    // Styles handled inline
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "500",
  },
  makeAvailableText: {
    // Color handled inline
  },
  makeUnavailableText: {
    // Color handled inline
  },
  deleteActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteActionText: {
    fontSize: 12,
    fontWeight: "500",
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
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});