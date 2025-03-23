import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface SignupScreenProps {
  onSignup: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup();
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
      <Text>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;
