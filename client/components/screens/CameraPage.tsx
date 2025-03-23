"use client"

import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { useState, useRef } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Dimensions, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"

export const CameraPage = () => {
  const [facing, setFacing] = useState<CameraType>("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const cameraRef = useRef<any>(null)

  // Function to handle image picking from gallery
  const pickImage = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission required", "Sorry, we need camera roll permissions to make this work!")
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      const selectedAsset = result.assets[0]
      saveImageToAssets(selectedAsset.uri)
    }
  }

  // Function to take a picture
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync()
        setCapturedImage(photo.uri)
        setPreviewVisible(true)
      } catch (error) {
        console.error("Error taking picture:", error)
      }
    }
  }

  // Function to save image to assets directory
  const saveImageToAssets = async (imageUri: string) => {
    try {
      // Create assets directory if it doesn't exist
      const assetsDir = FileSystem.documentDirectory + "assets/"
      const dirInfo = await FileSystem.getInfoAsync(assetsDir)

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(assetsDir, { intermediates: true })
      }

      // Generate a unique filename
      const filename = `image_${Date.now()}.jpg`
      const destination = assetsDir + filename

      // Copy the file to the assets directory
      await FileSystem.copyAsync({
        from: imageUri,
        to: destination,
      })

      Alert.alert("Success", "Image saved to assets folder")
      console.log("Image saved to:", destination)

      // Reset the captured image and close preview
      if (previewVisible) {
        setCapturedImage(null)
        setPreviewVisible(false)
      }
    } catch (error) {
      console.error("Error saving image:", error)
      Alert.alert("Error", "Failed to save image")
    }
  }

  // Function to discard the captured image
  const retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        // Image Preview Modal
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.previewButton} onPress={retakePicture}>
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewButton, styles.uploadPreviewButton]}
              onPress={() => saveImageToAssets(capturedImage)}
            >
              <Ionicons name="cloud-upload" size={24} color="white" />
              <Text style={styles.previewButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Camera View
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          {/* Main content area - takes up most of the screen */}
          <View style={styles.cameraContent}>{/* You can add other camera UI elements here */}</View>
        </CameraView>
      )}

      {/* Bottom control bar - only show when not in preview mode */}
      {!previewVisible && (
        <SafeAreaView style={styles.controlsContainer}>
          <View style={styles.controlsBar}>
            {/* Left side - upload button */}
            <View style={styles.sideControl}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name="cloud-upload" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Center - main capture button */}
            <View style={styles.captureContainer}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
            </View>

            {/* Right side - flip camera button */}
            <View style={styles.sideControl}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  )
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  cameraContent: {
    flex: 1,
  },
  controlsContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0, // Adjust this value to position above the tab bar
  },
  controlsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  sideControl: {
    width: 48,
    alignItems: "center",
  },
  captureContainer: {
    flex: 1,
    alignItems: "center",
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  // Preview styles
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: "contain",
  },
  previewControls: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30,
  },
  previewButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  uploadPreviewButton: {
    backgroundColor: "rgba(0, 100, 0, 0.6)",
  },
  previewButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
  },
})

