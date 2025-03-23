import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from "expo-document-picker";

import { getStorage, ref, uploadBytes } from "firebase/storage";
import { sendAudioMetadata } from 'axioscalls';

interface UploadAudioModalProps {
    visible: boolean;
    onClose: () => void;
  }  

export const UploadAudioModal = ({ visible, onClose }: UploadAudioModalProps) => {

    const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

    const handlePickAudio = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: "audio/*", // Only allow audio files
            copyToCacheDirectory: true, // Copies the file to cache for easy access
          });
    
          if (result.canceled) {
            Alert.alert("Selection Cancelled", "No file was selected.");
            return;
          }
            setSelectedFile(result);

          Alert.alert("File Selected", `You selected: ${result.assets[0].name}`);
        } catch (error) {
          console.error("Error picking audio file:", error);
          Alert.alert("Error", "Something went wrong while picking the file.");
        }
    };

    const uriToBlob = async (uri: string): Promise<Blob> => {
        const response = await fetch(uri);
        return response.blob();
    };
    

    const storage = getStorage();
      
    const sendPickedAudio = async () => {
        if (!selectedFile) {
            Alert.alert("No File Selected", "Please select an audio file first.");
            return;
        }
        try {
            // Depending on how DocumentPicker returns the file details,
            // use either selectedFile directly or selectedFile.assets[0]
            const asset = selectedFile.assets ? selectedFile.assets[0] : selectedFile;
            const responseBlob = await sendAudioMetadata(asset);
            console.log("Response blob received:", responseBlob);
            Alert.alert("Upload Successful", "Your file was uploaded and returned successfully.");
        } catch (error) {
            console.error("Error uploading file:", error);
            Alert.alert("Upload Failed", "There was an error uploading your file.");
        }
    };

    
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-6 w-80">
          <Text className="text-lg font-bold mb-4">Upload Audio</Text>

            <TouchableOpacity
                onPress={handlePickAudio}
                className="bg-blue-500 px-4 py-2 rounded"
            >
                <Text className="text-white text-center">Upload Audio</Text>
            </TouchableOpacity>

            {selectedFile && (
                <Text className="mt-2 text-sm text-gray-700">
                    Selected: {selectedFile.assets[0].name}
                </Text>)
            }

            {selectedFile && <TouchableOpacity
                onPress={sendPickedAudio}
                className="bg-blue-500 px-4 py-2 rounded"
            >
                <Text className="text-white text-center">Sent Audio</Text>
            </TouchableOpacity>}

          {/* You can add additional UI elements here if needed */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-500 rounded p-2 mt-4"
          >
            <Text className="text-white text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};