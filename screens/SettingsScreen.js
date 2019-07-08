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
  FlatList,
  AsyncStorage,
} from 'react-native'
import CustomIcon from '../components/CustomIcon'
import moment from 'moment'
import CountDown from 'react-native-countdown-component'
import Colors from '../constants/Colors'
import Text from '../components/GlobalComponents'

export default class SettingsScreen extends React.Component {

  state = {
    dailyCalories: null,
    status: '8 hours',
    caloriesInput: '500',
    totalCalories: 0,
    eatFastMode: 'eat',
    seconds: 0,
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('dailyCalories');
      if (value !== null) {
        this.setState({'dailyCalories': JSON.parse(value)})
        console.log(value)
      }
    } catch (error) {
      console.log('error: ' + error)
    }
  }

  componentDidMount() {
    this._retrieveData()
    console.log('dailyCalories', this.state.dailyCalories)
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

  addEat17HoursAgo() {
    fastingEndTime = moment()
    fastingEndTime.subtract(1, 'hours')
    AsyncStorage.setItem('eatingEndTime', null)
    AsyncStorage.setItem('fastingEndTime', JSON.stringify(fastingEndTime))
    try {
      AsyncStorage.getItem('dailyCalories', (err, result) => {
        if (result !== null) {
          var newCalories = JSON.parse(result).concat([[moment().subtract(17, 'hour'), 765]])
          AsyncStorage.setItem('dailyCalories', JSON.stringify(newCalories))
          console.log('dailyCalories now', newCalories)
        } else {
          AsyncStorage.setItem('dailyCalories', JSON.stringify([[moment(), this.state.caloriesInput]]))
          console.log('not found, creating dailyCalories.')
          console.log([[moment(), this.state.caloriesInput]])
        }
      })
    } catch (error) {
      console.log('error storing eat: ', error)
    }
  }

  deleteEat(index) {
    console.log('will delete index', index)
    try {
      AsyncStorage.getItem('dailyCalories', (err, result) => {
        if (result !== null) {
          var newCalories = JSON.parse(result).concat([[moment(), this.state.caloriesInput]])
          AsyncStorage.setItem('dailyCalories', JSON.stringify(newCalories))
          this.setState({todaysDailyCalories: this.state.todaysDailyCalories.concat(this.state.caloriesInput)})
          console.log('dailyCalories now', newCalories)
        } else {
          AsyncStorage.setItem('dailyCalories', JSON.stringify([[moment(), this.state.caloriesInput]]))
          this.setState({todaysDailyCalories: this.state.todaysDailyCalories.concat(this.state.caloriesInput)})
          console.log('not found, creating dailyCalories.')
          console.log([[moment(), this.state.caloriesInput]])
        }
      })
    } catch (error) {
      console.log('error storing eat: ', error)
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
        <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={this.addEat17HoursAgo}>
          <Text style={{fontSize: 20}}> Add custom meal </Text>
        </TouchableOpacity>
        <ScrollView style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 26}}>#</Text>
            <Text style={{fontSize: 26}}>          Date         </Text>
            <Text style={{fontSize: 26}}>Cal's</Text>
            <Text style={{fontSize: 26}}> </Text>
          </View>
          <FlatList
            data={this.state.dailyCalories}
            renderItem={({item, index}) =>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 24}}>{index}</Text>
                <Text style={{fontSize: 24}}>{item[0]}</Text>
                <Text style={{fontSize: 24}}>{item[1]}</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => this.deleteEat(index)}>
                    <CustomIcon size={30} color={Colors.red} name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}/>
                  </TouchableOpacity>
                  <Text>  </Text>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
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
    paddingTop: 15,
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
    width: 200,
    marginLeft: 20,
  },
});
