import React, { Component, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {Camera, CameraCapturedPicture} from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { Styles } from './Styles';

export default function App (){ //cannot use class App extends Component, get parsing error on line 7
  const [cam, setCam] = useState({
    permission: null,
    type: Camera.Constants.Type.back,
  });

  //returns an async error, sometimes it works sometimes not
  useEffect (async () =>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    setCam (prevState => ({...prevState, permission: status === 'granted'}));
  }, []);

    if (cam.permission === null){ return <View />;}
    
    else if (cam.permission === false){
      return <View style={{flex: 1}}> <Text>Access Denied.</Text> </View>;
    }

    else{
     return (
      <View style ={{flex: 1}}>
        <Camera style={{flex: 1}} type={cam.type}>
          <View style={Styles.container}>
            
            <TouchableOpacity style={Styles.camset} 
              onPress={() => {
               setCam({
                  type:
                    cam.type === Camera.Constants.Type.back?Camera.Constants.Type.front:Camera.Constants.Type.back,
                });
              }}>
              
              <Text style={Styles.flip}> {' '}Flip{' '}</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}