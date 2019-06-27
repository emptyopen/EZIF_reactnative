import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  TextInput,
  Picker,
} from 'react-native'
import { AsyncStorage } from 'react-native'
import moment from 'moment'
import CountDown from 'react-native-countdown-component'
import Colors from '../constants/Colors'
import Text from '../components/GlobalComponents'

export default class SettingsScreen extends React.Component {

  state = {
    status: '8 hours',
    caloriesInput: '500',
    totalCalories: 0,
    eatFastMode: 'eat',
    seconds: 0,
  }

  resetEat = async () => {
    try {
      await AsyncStorage.removeItem('dailyCalories')
    } catch (error) {
      console.log('error removing dailyCalories: ', error)
    }
  }

  resetEverything = async () => {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.log('error removing everything: ', error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={this.resetEat}>
          <Text style={{fontSize: 20}}> Reset Eating History </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={this.resetEverything}>
          <Text style={{fontSize: 20}}> Reset Everything </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

SettingsScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
  	paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    height: 30,
    width: 80,
    marginLeft: 20,
  },
});
