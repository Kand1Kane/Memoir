import { UploadAudioModal } from "components/UploadAudio";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const MemoryPage = () =>  {
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };


    return (
        <View className="flex-1 p-4">
            <TouchableOpacity
                onPress={handleOpenModal}
                className="bg-blue-500 p-3 rounded mb-4 mt-12"
            >
                <Text className="text-white text-center">Upload Audio</Text>
            </TouchableOpacity>
            
            <UploadAudioModal visible={modalVisible} onClose={handleCloseModal} />
            
            {/* Other content for MemoryPage */}
            <Text className="text-center mt-4">Memory Page Content Here</Text>
        </View>
    );
}