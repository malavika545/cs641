import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import * as SecureStore from "expo-secure-store";
import { AntDesign } from '@expo/vector-icons'; 
import { useFocusEffect } from "expo-router";
import { useUser } from '@clerk/clerk-expo'; 
import uuid from 'react-native-uuid';

const CART_KEY = "cartItems";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { user } = useUser(); // Get user details
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const fetchCartItems = async () => {
    const existingCart = await SecureStore.getItemAsync(CART_KEY);
    if (existingCart) {
      setCartItems(JSON.parse(existingCart));
    } else {
      setCartItems([]); // Ensure it's an empty array if no items found
    }
  };

  const fetchProducts = async (cartItems: any[]) => {
    const productsData = await Promise.all(
      cartItems.map(async (itemId) => {
        const productRef = doc(db, "products", itemId);
        const productSnapshot = await getDoc(productRef);
        return productSnapshot.exists()
          ? { id: itemId, ...productSnapshot.data() }
          : null;
      })
    );
    setProducts(productsData.filter(Boolean)); // Remove null values

    const initialQuantities = productsData.reduce((acc, product) => {
      if (product) acc[product.id] = 1; 
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
    }, [])
  );

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchProducts(cartItems);
    } else {
      setProducts([]); // Clear products if cart is empty
    }
  }, [cartItems]); // Fetch products whenever cartItems change

  const handleRemoveFromCart = async (id: string) => {
    const updatedCart = cartItems.filter((item) => item !== id);
    await SecureStore.setItemAsync(CART_KEY, JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Remove the product from quantities as well
    setQuantities((prev) => {
      const { [id]: _, ...newQuantities } = prev; 
      return newQuantities;
    });

  };


  const increaseQuantity = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQuantity = (id: string) => {
    setQuantities((prev) => {
      const newQuantity = (prev[id] || 1) - 1;
      return { ...prev, [id]: Math.max(newQuantity, 1) }; 
    });
  };

  const calculateTotalPrice = () => {
    return products.reduce((total, product) => {
      const quantity = quantities[product.id] || 0;
      return total + (product.price * quantity);
    }, 0).toFixed(2);
  };

  const handleBuyNow = async () => {

  if (!userEmail) {
    Alert.alert("Error", "User is not logged in.");
    return;
  }



  try {  
    // Create a new order object
  const orderData = {
    orderId: uuid.v4(), // Generate a unique order ID
    email: userEmail,   // User's email
    date: new Date().toISOString(), // Current date in ISO format
    products: Object.keys(quantities).map((productId) => ({
      productId,
      quantity: quantities[productId],
    })),
  };
    const ordersCollection = doc(db, "orders", orderData.orderId);
    await setDoc(ordersCollection, orderData); // Use setDoc to save the order

    Alert.alert("Success", "Your order has been placed!");
    
    await SecureStore.setItemAsync(CART_KEY, JSON.stringify([])); // Clear cart
    setCartItems([]); // Update local state
  } catch (error) {
    console.error("Error placing order: ", error);
    Alert.alert("Error", "There was an issue placing your order. Please try again.");
  }
};

  return (
    <View style={styles.container}>
      <ScrollView>
        {products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>Your cart is empty.</Text>
          </View>
        ) : (
          products.map((product) => (
            <View key={product.id} style={styles.productContainer}>
              <Image source={{ uri: product.image_url }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  {product.currency} {product.price.toFixed(2)}
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decreaseQuantity(product.id)}>
                    <AntDesign name="minuscircle" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantities[product.id] || 1}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(product.id)}>
                    <AntDesign name="pluscircle" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromCart(product.id)}
              >
                <AntDesign name="closecircle" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ))
        )}
        {products.length > 0 && (
          <Text style={styles.totalPrice}>
            Total Price: {products[0]?.currency} {calculateTotalPrice()}
          </Text>
        )}
      </ScrollView>

      {products.length > 0 && (
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, paddingTop: 50 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyMessage: { textAlign: "center", fontSize: 18, marginTop: 20 },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 15,
    position: 'relative',
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: { fontSize: 18, fontWeight: "bold", color: "#000" },
  productPrice: { fontSize: 16, color: "#007BFF" },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
  },
  totalPrice: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buyNowButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  buyNowText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
