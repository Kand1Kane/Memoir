import type React from "react"
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from "react-native"

interface OnboardingScreenProps {
  onGetStarted: () => void
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted }) => {
  return (
    <ImageBackground source={require("../../assets/candle-book.jpg")} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Image source={require("../../assets/Memoir.png")} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Where Your Story Begins!</Text>

          <Text style={styles.subtitle}>
            Welcome to your personalized memoir, where you keep storytelling your journey!
          </Text>
        </View>

        <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.paginationDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.inactiveDot]} />
          <View style={[styles.dot, styles.inactiveDot]} />
        </View>
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
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  getStartedButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#8BC34A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
})

export default OnboardingScreen

