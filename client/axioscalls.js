import axios from "axios";

// Adjust the API_URL based on your Flask endpoint.
// If your Flask API listens on port 22 at the root endpoint:
const API_URL = "https://k3lxgmh2k70nki-3000.proxy.runpod.net/upload-audio";

// If instead you have an endpoint like '/upload-audio' on a different port (e.g., 3000),
// update the URL accordingly:
// const API_URL = "http://YOUR_SERVER_IP:3000/upload-audio";


const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    return response.blob();
};


export const sendAudioMetadata = async (selectedAsset) => {
    try {
        // Optionally, if the file is not in wav format, you would convert it here.
        // For example, using a library such as react-native-ffmpeg. For now, we assume the file is WAV.
        
        // Convert the file URI to a blob
        const fileBlob = await uriToBlob(selectedAsset.uri);

        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append('file', fileBlob, selectedAsset.name);

        // Send the file using a POST request
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            // Expect the response as a blob (binary file)
            responseType: 'blob',
        });
        console.log("Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending data:", error);
        throw error;
    }
};
