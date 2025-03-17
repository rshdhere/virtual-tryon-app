import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

// Replace the static BACKEND_URL with dynamic discovery
const DISCOVERY_IPS = [
  "http://192.168.0.105:3001",
  "http://192.168.51.105:3001",
  "http://192.168.28.32:3001",
  "http://192.168.190.32:3001",
  "http://10.0.2.2:3001",
];

console.log("Using backend URL:", DISCOVERY_IPS[0]);

// Add this console log at the start of uploadImageToServer
console.log("Attempting to connect to:", DISCOVERY_IPS[0]);

export default function TryOn() {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [backendUrl, setBackendUrl] = useState<string | null>(null);

  // Add server discovery
  useEffect(() => {
    const discoverServer = async () => {
      for (const baseUrl of DISCOVERY_IPS) {
        try {
          console.log("Trying connection to:", baseUrl);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1000);

          const response = await fetch(`${baseUrl}/test`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            console.log("Found server at:", baseUrl);
            setBackendUrl(baseUrl);
            setIsServerConnected(true);
            return;
          }
        } catch (error) {
          console.log("Failed to connect to:", baseUrl);
        }
      }
      Alert.alert(
        "Connection Error",
        "Could not find the server. Make sure your phone and computer are on the same network."
      );
    };

    discoverServer();
  }, []);

  // Update the pickImage function to use the new MediaType
  const pickImage = async (type: "person" | "garment") => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        if (type === "person") {
          setPersonImage(result.assets[0].uri);
        } else {
          setGarmentImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadImageToServer = async (uri: string): Promise<string> => {
    if (!backendUrl) {
      throw new Error("Server not discovered yet");
    }

    try {
      if (!isServerConnected) {
        throw new Error("Server is not connected");
      }

      const formData = new FormData();
      const filename = uri.split("/").pop() || "image.jpg";

      formData.append("image", {
        uri,
        name: filename,
        type: "image/jpeg",
      } as any);

      console.log("Uploading file:", {
        filename,
        uri: uri.substring(0, 50) + "...",
      });

      const response = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      return data.url;
    } catch (error) {
      console.error("Upload error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  const processImages = async () => {
    if (!personImage || !garmentImage) {
      Alert.alert(
        "Error",
        "Please upload both person and garment images first"
      );
      return;
    }

    try {
      setIsLoading(true);
      console.log("Starting image processing...");

      const [personImageUrl, garmentImageUrl] = await Promise.all([
        uploadImageToServer(personImage),
        uploadImageToServer(garmentImage),
      ]);

      console.log("Uploaded URLs:", { personImageUrl, garmentImageUrl });

      const response = await fetch(`${backendUrl}/api/tryon/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personImage: personImageUrl,
          garmentImage: garmentImageUrl,
        }),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to process images");
      }

      if (result.images && result.images.length > 0) {
        setResultImage(result.images[0].url);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      Alert.alert("Error", "Failed to process images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.uploadArea}>
        {/* Person photo section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Person Photo</Text>
          {personImage ? (
            <Image source={{ uri: personImage }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                No person photo selected
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => pickImage("person")}>
            <Text style={styles.buttonText}>Upload Person Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Garment photo section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garment Photo</Text>
          {garmentImage ? (
            <Image source={{ uri: garmentImage }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                No garment photo selected
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, styles.garmentButton]}
            onPress={() => pickImage("garment")}>
            <Text style={styles.buttonText}>Upload Garment</Text>
          </TouchableOpacity>
        </View>

        {/* Process button with loading state */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.processButton,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={processImages}
          disabled={isLoading}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" />
              <Text style={[styles.buttonText, styles.loadingText]}>
                Processing...
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Process Try-On</Text>
          )}
        </TouchableOpacity>

        {/* Result section with loading state */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Try-On Result</Text>
          {isLoading ? (
            <View style={[styles.placeholder, styles.resultPlaceholder]}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Generating try-on image...</Text>
            </View>
          ) : resultImage ? (
            <Image source={{ uri: resultImage }} style={styles.resultImage} />
          ) : (
            <View style={[styles.placeholder, styles.resultPlaceholder]}>
              <Text style={styles.placeholderText}>
                Result will appear here after processing
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  uploadArea: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  placeholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  resultPlaceholder: {
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    height: 300,
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain",
  },
  resultImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  garmentButton: {
    backgroundColor: "#34C759",
  },
  processButton: {
    backgroundColor: "#FF9500",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
    marginLeft: 10,
    textAlign: "center",
  },
});
