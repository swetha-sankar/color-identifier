import {ImageBackground, View, TouchableOpacity, Text} from "react-native";

const CameraPreview = ({photo}: any) => {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <ImageBackground
          source={{uri: photo && photo.uri}}
          style={{
            flex: 1
          }}
        />
      </View>    
    )
  }
  export default CameraPreview;