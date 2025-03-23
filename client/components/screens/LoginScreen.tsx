"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Image, StyleSheet } from "react-native"
import { auth } from "../../firebaseConfig.js"
import { signInWithEmailAndPassword } from "firebase/auth"

interface LoginScreenProps {
  onLogin: () => void
  onNavigateToSignup: () => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Login Error", error.message)
      } else {
        Alert.alert("Login Error", "An unknown error occurred")
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Not a member yet? Sign up</Text>
          <TouchableOpacity onPress={onNavigateToSignup}>
            <Text style={styles.signupLink}>Here!</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.alternateButton} onPress={onNavigateToSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#8BC34A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  alternateButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#BA68C8",
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
  signupContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  signupText: {
    color: "white",
    marginRight: 5,
  },
  signupLink: {
    color: "white",
    fontWeight: "bold",
  },
})

export default LoginScreen

