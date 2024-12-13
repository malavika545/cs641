import { Tabs } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#7d7d7d",
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />

      {/* Cart Tab */}
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-cart" size={size} color={color} />
          ),
          tabBarLabel: "Cart",
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="myorders"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="manage-history" size={size} color={color} />
          ),
          tabBarLabel: "My orders",
        }}
      />
    </Tabs>
  );
}
