import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig"; // Adjust path as needed
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const CART_KEY = "cartItems";

export default function Home() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);

        // Extract unique categories
        const fetchedCategories = [
          ...new Set(fetchedProducts.map((product: any) => product.category)),
        ];
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === null || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const handleAddToCart = async (item: any, hideAlert: boolean) => {
    const {id, name} = item;
    try {
      // Retrieve existing cart items
      const existingCart = await SecureStore.getItemAsync(CART_KEY);
      const cartItems = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if product already exists in cart
      if (!cartItems.includes(item.id)) {
        cartItems.push(id); // Add product ID to cart
        await SecureStore.setItemAsync(CART_KEY, JSON.stringify(cartItems));
        if (!hideAlert)
          Alert.alert("Added to Cart", `${name} has been added to your cart!`);
      } else {
        Alert.alert("Already in Cart", `${name} is already in your cart.`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const handleBuyNow = async (item: any) => {
    await handleAddToCart(item, true);
    router.push({
      pathname: '/(home)/cart',
    });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {/* Clear Filter */}
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          style={[
            styles.categoryButton,
            selectedCategory === null && styles.selectedCategory,
          ]}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => router.push({
            pathname: '/(components)/[id]',
            params: {
              id: item.id.toString(),
            },
          })}
          >
            <Image source={{ uri: item.image_url }} style={styles.productImage} />

            <Text style={styles.productName}>{item.name}</Text>

            <Text style={styles.productPrice}>${item.price}</Text>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.buyButton} onPress={()=> handleBuyNow(item)}>
                <Text style={styles.buyText}>Buy Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addToCart} onPress={()=> handleAddToCart(item, false)}>
                <FontAwesome6 name="cart-plus" size={12} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff", paddingTop: 50 },
  searchBar: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 10 },
  categories: { flexDirection: "row", marginBottom: 10, maxHeight: 30 },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCategory: {
    borderColor: "#007AFF",
    backgroundColor: "#dbeafe",
  },
  categoryText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  productCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: { width: "100%", height: 120, borderRadius: 8 },
  productName: { marginTop: 10, fontSize: 14, fontWeight: "bold", textAlign: "center" },
  productPrice: { color: "gray", marginBottom: 5, textAlign: "center", fontSize: 15, paddingVertical: 5 },
  productRating: { fontSize: 12, color: "#f39c12", textAlign: "center" },
  productDescription: { fontSize: 12, color: "gray", marginBottom: 10, textAlign: "center" },
  actions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  buyButton: { backgroundColor: "#000", padding: 5, borderRadius: 5, flex: 1, marginRight: 5 },
  addToCart: { backgroundColor: "#000", padding: 5, borderRadius: 5,  marginRight: 5 },
  buyText: { color: "#fff", textAlign: "center" },
  favoriteIcon: { fontSize: 18, color: "#e74c3c" },
});
