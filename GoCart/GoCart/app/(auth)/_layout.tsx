import { useAuth } from '@clerk/clerk-expo'

import { Redirect,Stack } from "expo-router";
import {ActivityIndicator} from "react-native";


export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <ActivityIndicator size="large" color={"#25AE87"} />
  }
  console.log({ isSignedIn})
  if (isSignedIn) {
    return <Redirect href="/(home)" />
  }
  return (
    <Stack>
        <Stack.Screen
            name="index"
            options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
            name="signup"
            options={{ title: "Signup",  headerShown: false }}
        />
    </Stack>
  );
}
