import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const CART_KEY = "cartItems"; // Key for secure storage

export default function ProductDetails() {
  const { id }: { id: string } = useLocalSearchParams(); // Get product ID from route params
  const [product, setProduct] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          setProduct({ id, ...productSnapshot.data() });
        } else {
          console.error("No such product found!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

 const handleAddToCart = async (hideAlert: boolean) => {
    try {
      // Retrieve existing cart items
      const existingCart = await SecureStore.getItemAsync(CART_KEY);
      const cartItems = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if product already exists in cart
      if (!cartItems.includes(id)) {
        cartItems.push(id); // Add product ID to cart
        await SecureStore.setItemAsync(CART_KEY, JSON.stringify(cartItems));
        if (hideAlert) return;
        Alert.alert("Added to Cart", `${product.name} has been added to your cart!`);
      } else {
        Alert.alert("Already in Cart", `${product.name} is already in your cart.`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const handleBuyNow = async (item: any) => {
    await handleAddToCart(true);
    router.push({
      pathname: '/(home)/cart',
    });
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
      </View>

      <ScrollView>
        {/* Product Image */}
        <Image source={{ uri: product.image_url }} style={styles.image} />

        {/* Product Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.sectionText}>{product.description}</Text>
        </View>

        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETAILS</Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Category:</Text> {product.category}
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Price:</Text> {product.currency}{" "}
            {product.price}
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Rating:</Text> {product.rating} ⭐
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Reviews:</Text> {product.reviews}
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Stock:</Text> {product.stock} items
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Favorite:</Text>{" "}
            {product.is_favorite ? "Yes" : "No"}
          </Text>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TAGS</Text>
          <View style={styles.tagsContainer}>
            {product.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

     <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={()=>handleAddToCart(false)}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyNow(product)}>
          <Text style={styles.buyText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, paddingTop: 50 },
   header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: { marginRight: 10 },
  backButtonText: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  headerTitle: { fontSize: 20, fontWeight: "bold", flex: 1, textAlign: "center" },
  image: { width: "100%", height: 300, resizeMode: "contain" },
  section: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  sectionText: { fontSize: 16, color: "#555", marginBottom: 5 },
  boldText: { fontWeight: "bold" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
  tag: {
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: { fontSize: 14, color: "#00796b" },
   buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 15,
  },
  addToCartButton: {
    flex: 1,
    marginRight: 5,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#000",
    alignItems: "center",
  },
  buyButton: {
    flex: 1,
    marginLeft: 5,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#000",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  buyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
