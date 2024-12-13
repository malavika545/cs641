import * as React from 'react';
import { useRouter, Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ImageBackground,
} from "react-native";
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onLoginPress = async () => {
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({ identifier: emailAddress, password });
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace('/(home)');
      } else {
        console.error(completeSignIn);
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const onGoogleLoginPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'cookmate' }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(home)');
      } else {
        console.error('Google login failed');
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.wrapperContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Go Cart</Text>

          <Text style={styles.subtitle}>Welcome Back</Text>
          <Text style={styles.description}>
            Log in to continue using the app
          </Text>

          <TextInput
            placeholder="email@domain.com"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
          <TextInput
            placeholder="Enter password"
            style={styles.input}
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.continueButton} onPress={onLoginPress}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>

          <Text style={styles.orText}>or</Text>

          <Pressable style={styles.oauthButton} onPress={onGoogleLoginPress}>
            <ImageBackground
              source={require("../../assets/google.png")}
              style={styles.oauthImage}
            />
            <Text style={styles.oauthText}>Continue with Google</Text>
          </Pressable>
          <Pressable style={styles.oauthButton}>
            <ImageBackground
              source={require("../../assets/apple.png")}
              style={styles.oauthAppleImage}
            />
            <Text style={styles.oauthText}>Continue with Apple</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupLink}>
              Don’t have an account? <Text style={styles.signupLinkBold}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "black",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    color: "black",
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: "black",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  orText: {
    fontSize: 16,
    color: "#888",
    marginVertical: 10,
  },
  oauthButton: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  oauthImage: {
    width: 20,
    height: 20,
  },
  oauthAppleImage: {
    width: 25,
    height: 25,
  },
  oauthText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  signupLink: {
    fontSize: 14,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
  signupLinkBold: {
    color: "black",
    fontWeight: "600",
  },
});
