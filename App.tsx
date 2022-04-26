import { StatusBar } from 'expo-status-bar'
import { registerRootComponent } from 'expo';
import React from 'react'
import {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { Camera } from 'expo-camera'
import CameraPreview from "./components/CameraPreview";
import { FlashMode } from 'expo-camera/build/Camera.types';

export default function App() {
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState<any>(null)
  const [hasPermission, setHasPermission] = useState(false);
  const [flashMode, setFlashMode] = useState("off");


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true)
      } else {
        setHasPermission(false)
        Alert.alert('Please enable camera access in settings to use this tool')
      }
    })();
  }, []);

  let camera: Camera
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    
  }
  const __handleFlash = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }

  }
  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  return (
    <View style={styles.container}>
      {hasPermission && previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} retakePicture={__retakePicture} />
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
            width: 25
        }}
        >
            <Text
                style={{
                fontSize: 20
                }}
            >
            ⚡️
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
