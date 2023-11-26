import React, { useState } from 'react';
import { Button, View, Image, PermissionsAndroid, Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';

const ImageUploader = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const selectImage = async () => {
    // Requesting storage permission for Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message: "This app needs access to your storage to upload photos.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission denied');
        return;
      }
    }

    const options = {
      mediaType: 'photo' as MediaType,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        const source = response.assets[0].uri;
        setImageUri(source);
        uploadImage(source);
      }
    });
  };

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = uri;

    try {
      await storage().ref(filename).putFile(uploadUri);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <Button title="Upload Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
    </View>
  );
};

export default ImageUploader;
