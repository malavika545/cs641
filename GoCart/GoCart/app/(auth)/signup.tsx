
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
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function Signup() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState('');
  const [step, setStep] = React.useState("email");
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({ emailAddress });
      setStep("password"); // Move to the password step
    } catch (err) {
      console.error(err);
    }
  };

  const onPasswordSubmit = async () => {
    if (!isLoaded) return;

    try {
      await signUp.update({ password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verification"); // Move to the verification step
    } catch (err) {
      console.error(err);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(home)');
      } else {
        console.error(completeSignUp);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const onGoogleSignUpPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'cookmate' }),
      })

      if (createdSessionId) {
        await setActive!({ session: createdSessionId })
        router.replace('/(home)')
      } else {
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.wrapperContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Go Cart</Text>

          {step === "email" && (
            <>
              <Text style={styles.subtitle}>Create an account</Text>
              <Text style={styles.description}>
                Enter your email to sign up for this app
              </Text>
              <TextInput
                placeholder="email@domain.com"
                style={styles.input}
                placeholderTextColor="#aaa"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
              <Pressable style={styles.continueButton} onPress={onSignUpPress}>
                <Text style={styles.buttonText}>Continue</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/(auth)')}
              >
                <Text style={styles.loginLink}>
                  Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
                </Text>
              </Pressable>
            </>
          )}

          {step === "password" && (
            <>
              <Text style={styles.subtitle}>Set Your Password</Text>
              <TextInput
                placeholder="Enter password"
                style={styles.input}
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                style={styles.continueButton}
                onPress={onPasswordSubmit}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </Pressable>
            </>
          )}

          {step === "verification" && (
            <>
              <Text style={styles.subtitle}>Verify Your Email</Text>
              <TextInput
                placeholder="Enter verification code"
                style={styles.input}
                placeholderTextColor="#aaa"
                value={code}
                onChangeText={setCode}
              />
              <Pressable style={styles.continueButton} onPress={onPressVerify}>
                <Text style={styles.buttonText}>Verify Email</Text>
              </Pressable>
            </>
          )}

          {step === "email" && (
            <>
              <Text style={styles.orText}>or</Text>

              <Pressable style={styles.oauthButton} onPress={onGoogleSignUpPress}>
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
              <Text style={styles.footerText}>
                By clicking continue, you agree to our{" "}
                <Text style={styles.link}>Terms of Service</Text> and{" "}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </>
          )}

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
  footerText: {
    fontSize: 12,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
    color: "black",
  },
  loginLinkBold: {
    color: "black",
    fontWeight: "600",
  },
  loginLink: {
    fontSize: 14,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },

});
