// app/(home)/_layout.tsx
import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View, Text } from 'react-native';

export default function HomeLayout() {
  const { isSignedIn } = useAuth();


  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  // if (!isFirebaseAuthenticated) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <Text>Failed to authenticate with Firebase</Text>
  //     </View>
  //   );
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'Todos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="checkbox-marked-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}