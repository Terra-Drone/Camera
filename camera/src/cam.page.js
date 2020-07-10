import React, { Component, Fragment, useState, useEffect} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, CameraCapturedPicture } from 'expo-camera';
import * as Permissions from 'expo-permissions';

import styles from './styles';              //call stylesheet
import Toolbar from './toolbar.component';  //call GUI
import Gallery from './gallery.component';  //call image preview/scroll setting

export default class CameraSrc extends Component {
    camera = null;

    state = {
        captures: [],
        capturing: null,
        hasPermission: null,
        mainCamera: Camera.Constants.Type.back,     //set main camera to back camera rather than forward camera
        flashMode: Camera.Constants.FlashMode.off,
    };

    setFlashMode = (flashMode) => this.setState({ flashMode });
    setMainCamera = (mainCamera) => this.setState({ mainCamera });
    handleCaptureIn = () => this.setState({ capturing: true });

    handleCaptureOut = () => {
        if (this.state.capturing)
            this.camera.stopRecording();
    };

    handleShortCapture = async () => {
        const photoData = await this.camera.takePictureAsync();
        this.setState({ capturing: false, captures: [photoData, ...this.state.captures] })
    };

    handleLongCapture = async () => {
        const videoData = await this.camera.recordAsync();
        this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
    };

    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasPermission = (camera.status === 'granted' && audio.status === 'granted');

        this.setState({ hasPermission });
    }

    render() {
        const { hasPermission, flashMode, mainCamera, capturing, captures } = this.state;

        if (hasPermission === null) {
            return <View />;
        } else if (hasPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }

        return (
            <Fragment>
                <View>
                    <Camera
                        type = {mainCamera}
                        flashMode = {flashMode}
                        style = {styles.camView}
                        ref = {camera => this.camera = camera}
                    />
                </View>

                {captures.length > 0 && <Gallery captures = {captures}/>}
                 <Toolbar 
                    capturing={capturing}
                    flashMode={flashMode}
                    mainCamera={mainCamera}
                    setFlashMode={this.setFlashMode}
                    setMainCamera={this.setMainCamera}
                    onCaptureIn={this.handleCaptureIn}
                    onCaptureOut={this.handleCaptureOut}
                    onLongCapture={this.handleLongCapture}
                    onShortCapture={this.handleShortCapture}
                />

            </Fragment>
        );
    }
}