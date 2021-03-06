import React, { Component } from 'react';
import Button from '../components/Button';
import Service from '../service';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View
} from 'react-native';
import Camera from 'react-native-camera';
import Slider from 'react-native-slider';

class CameraPage extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      show: true,
      value: 0.4
    }
  }

  componentDidMount() {
    Service.getLastPhoto(this.props.type).then(data => {
      if (data.length) {
        this.setState({overlay: data[0].url});
      }
    });
    setTimeout(() => {
      this.setState({show: false});
      setTimeout(() => {
        this.setState({show: true});
      })
    }, 200);
  }

  goBack() {
    this.props.navigator.pop();
  }

  takePicture() {
    this.camera.capture()
      .then((data) => this.props.navigator.push({name: 'photoDraft', path: data.path, type: this.props.type, date: this.props.date}))
      .catch(err => console.error(err));
  }

  render() {
    var camera;
    if (this.state.show) {
      camera = (
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fit}
          captureTarget={Camera.constants.CaptureTarget.disk}
          >
        </Camera>
      )
    }
    return (
      <View style={styles.container}>
        {camera}
        <Image style={[styles.cover, {opacity: this.state.value}]} source={{uri: this.state.overlay}}></Image>
        <View style={styles.camControls}>
          <Slider
          onValueChange={(value) => this.setState({value: value})}
          style={styles.slider}
          value={0.4}
          maximumValue={0.8}
          maximumTrackTintColor="#333"
          thumbTintColor="#fff"
          minimumTrackTintColor="#fff"
          trackStyle={{height: 2}}
          />
          <TouchableHighlight onPress={this.takePicture.bind(this)}>
            <View style={styles.captureButton}></View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  preview: {
    height: width * 1.33,
    width: width,
    top: 0,
    left: 0
  },
  cover: {
    height: width * 1.33,
    width: width,
    position: 'absolute',
    top: 0
  },
  slider: {
    width: 240,
    marginBottom: 20
  },
  camControls: {
    height: height - (width * 1.33),
    alignItems: 'center',
    justifyContent: 'center'
  },
  captureButton: {
    backgroundColor: '#ccc',
    borderWidth: 6,
    borderColor: '#fff',
    borderRadius: 50,
    height: 50,
    width: 50
  }
});

export default CameraPage;
