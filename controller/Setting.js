import React, { Component } from 'react';

import { Button, Text, View, StyleSheet, TouchableHighlight, Alert} from 'react-native';
//styling
import settingStyle from '../style/setting.js'  

class SettingScreen extends React.Component {
    render() {
      return (

        <View style={{flex: 1}}>
          <View style={settingStyle.colContainer}>
              <Text style={settingStyle.listText}>Treat 00:00 as </Text>
          </View>
        </View> 
      );
    }  
  }

  export default SettingScreen;