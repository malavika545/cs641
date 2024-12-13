import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image, ActivityIndicator, Pressable } from 'react-native';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseconfig'; // Adjust the import path as necessary
import { useUser, useAuth } from '@clerk/clerk-expo'; // Import useUser to get user details
import { useFocusEffect } from "expo-router";
import { useRouter } from "expo-router";
export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const { user } = useUser(); // Get user details
  const { signOut } = useAuth()
  const router = useRouter()

  const logout = async () => {
        await signOut()
        router.replace('/(auth)')
  }
    
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  
  const fetchOrders = async () => {
      if (!userEmail) return;

      setLoading(true); // Start loading

      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("email", "==", userEmail)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch product details for each order
        const ordersWithProducts = await Promise.all(ordersData.map(async (order : any) => {
          const productsWithDetails = await Promise.all(order.products.map(async (product: any) => {
            const productDoc = await getDoc(doc(db, "products", product.productId));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              return { 
                ...productData, 
                quantity: product.quantity // Include quantity from the order
              };
            }
            return null; // If the product doesn't exist, return null
          }));
          return { ...order, products: productsWithDetails.filter(Boolean) }; // Filter out nulls
        }));

        setOrders(ordersWithProducts);
      } catch (error) {
        console.error("Error fetching orders: ", error);
        Alert.alert("Error", "There was an issue fetching your orders.");
      } finally {
        setLoading(false); // End loading
      }
    };



   useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [userEmail])
  );
  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.orderContainer}>
        <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
        <Text style={styles.orderDate}>Date: {item.date}</Text>
        <Text style={styles.orderProducts}>Products:</Text>
        {item.products.map((product: any, index: number) => (
          <View key={index} style={styles.productContainer}>
            <Image source={{ uri: product.image_url }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>Title: {product.title}</Text>
              <Text style={styles.productDesc}>Description: {product.description}</Text>
              <Text>Count: {product.quantity}</Text>
              <Text style={styles.productPrice}>Price: ${product.price.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? ( // Show loading indicator if loading
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyMessage}>You have no orders.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
      {/* Logout */}
      <Pressable
        onPress={() => {
        logout()
      }}
      style={styles.logoutButtonContainer}>
        <Text style={styles.logoutButton}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff",
    paddingTop: 50
   },
  loadingIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // Center the loading indicator
  emptyMessage: { textAlign: "center", fontSize: 18, marginTop: 20 },
  orderContainer: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd' },
  orderId: { fontWeight: "bold", fontSize: 16 },
  orderDate: { fontSize: 14 },
  orderProducts: { fontWeight: "bold", fontSize: 16, marginTop: 5 },
  productContainer: { flexDirection: 'row', marginVertical: 10, alignItems: 'center' },
  productImage: { width: 50, height: 50, marginRight: 10 },
  productDetails: { flex: 1 },
  productTitle: { fontWeight: 'bold' },
  productDesc: { color: '#666' },
  productPrice: { fontWeight: 'bold', color: '#000' },
  logoutButtonContainer:{
    justifyContent:'center',
    alignItems:'center'
  },
  logoutButton: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
    marginTop: 20
  }
});
