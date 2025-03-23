import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth } from "../../firebaseConfig.js";
import { signInWithEmailAndPassword } from "firebase/auth";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error: unknown) { // Type the error explicitly
        if (error instanceof Error) {
          Alert.alert("Login Error", error.message); // Now we can safely access message
        } else {
          Alert.alert("Login Error", "An unknown error occurred");
        }
      }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
