import { StatusBar } from 'expo-status-bar'
import { registerRootComponent } from 'expo';
import React from 'react'
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import CameraPreview from "./components/CameraPreview";
//import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

export default function App() {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<any>(null)
  const [hasPermission, setHasPermission] = useState(false);
  const [flashMode, setFlashMode] = useState("off");
  const [usePicture, setUsePicture] = useState(false);
  let camera: Camera
  const speak = (thing: string) => {
    Speech.speak(thing);
  };

  const __getPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setHasPermission(true)
    } else {
      setHasPermission(false)
      Alert.alert('Please enable camera access in settings to use this tool')
      speak("Please enable camera access in settings to use this tool");
    }
  }
  useEffect(() => {
    __getPermissions();
  }, []);



  const __handleUse = () => {
    if (capturedImage == null) {
      speak("Button to select photo for use. Please capture an image first.")
      return
    }
    else {
      speak("Picture selected for color detection. Please wait");
      setUsePicture(true)
      setPreviewVisible(true)
      setCapturedImage(capturedImage)
      CameraPreview(capturedImage);
      console.log(capturedImage);
      //make calls to color api here
    }
  }

  const __handleFlash = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
      speak("Turning flash off")
    } else if (flashMode === 'off') {
      setFlashMode('on')
      speak("Turning flash on")
    } else {
      setFlashMode('auto')
    }

  }
  const __takePicture = async () => {
    if (camera) {
      setUsePicture(false);
      const photo = await camera.takePictureAsync()
      speak("Photo captured")
      setCapturedImage(photo)
    }
    else return;
  }

  return (
    <View style={styles.container}>
      {hasPermission && previewVisible && capturedImage && usePicture ? (
        <CameraPreview photo={capturedImage} />
      ) : (
        <Camera
          style={{ flex: 1, width: "100%" }}
          flashMode={flashMode}
          ref={(r) => {
            camera = r
          }}
        >
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              padding: 20,
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                onPress={__takePicture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: '#fff'
                }}
              />
            </View>
            <TouchableOpacity
              onPress={__handleFlash}
              style={{
                position: 'absolute',
                left: '5%',
                top: '10%',
                backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                borderRadius: '50%',
                height: 25,
                width: 80
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: flashMode === 'off' ? '#fff' : '#000'
                }}
              >
                ⚡️ Flash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={__handleUse}
              style={{
                position: 'absolute',
                right: '15%',
                top: '10%',
                borderRadius: 60,
                borderColor: "white",
                backgroundColor: "black",
                height: 25,
                width: 70
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "white"

                }}
              >
                ✅Use
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
registerRootComponent(App);
