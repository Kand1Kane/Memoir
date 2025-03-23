"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image, StyleSheet } from "react-native"
import { auth } from "../../firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"

interface SignupScreenProps {
  onSignup: () => void
  onNavigateToLogin: () => void
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup, onNavigateToLogin }) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      onSignup()
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Signup Error", error.message)
      } else {
        Alert.alert("Signup Error", "An unknown error occurred")
      }
    }
  }

  return (
    <ImageBackground source={require("../../assets/candle-book.jpg")} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/Memoir.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8BC34A"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8BC34A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Not a member yet? Sign up</Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.loginLink}>Here!</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.alternateButton} onPress={onNavigateToLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: "#8BC34A",
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#BA68C8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  alternateButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#8BC34A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    marginRight: 5,
  },
  loginLink: {
    color: "white",
    fontWeight: "bold",
  },
})

export default SignupScreen

