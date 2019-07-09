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
import DateTimePicker from "react-native-modal-datetime-picker";
import CountDown from 'react-native-countdown-component'
import Colors from '../constants/Colors'
import Text from '../components/GlobalComponents'

export default class SettingsScreen extends React.Component {

  state = {
  }
  constructor(props) {
    super(props)
    this.state = {
      dailyCalories: null,
      status: '8 hours',
      caloriesInput: '500',
      totalCalories: 0,
      eatFastMode: 'eat',
      seconds: 0,
      isDateTimePickerVisible: false,
      dateTimePickerIndex: null,
    }
    this.deleteMeal = this.deleteMeal.bind(this)
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

  showDateTimePicker = (index) => {
    this.setState({ isDateTimePickerVisible: true, dateTimePickerIndex: index });
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }

  handleDatePicked = (date) => {
    const newCalories = [...this.state.dailyCalories]
    newCalories[this.state.dateTimePickerIndex][0] = date
    this.setState({dailyCalories: newCalories})
    AsyncStorage.setItem('dailyCalories', JSON.stringify(newCalories))
    this.hideDateTimePicker()
    console.log('date has been picked', date, this.state.dateTimePickerIndex)
    // may have to re-sort index if edited meal goes out of bounds
    // todo: also may need to update eatingEndTime
  }

  deleteMeal(index) {
    var newCalories = this.state.dailyCalories.filter(function(meal, i) {
      return i !== index
    })
    this.setState({dailyCalories: newCalories})
    AsyncStorage.setItem('dailyCalories', JSON.stringify(newCalories))
    console.log('successfully deleted index', index)
  }

  updateCalorie(index, val) {
    const newCalories = [...this.state.dailyCalories]
    newCalories[index][1] = val
    this.setState({dailyCalories: newCalories})
    console.log('hey hey now', newCalories)
    AsyncStorage.setItem('dailyCalories', JSON.stringify(newCalories))
    console.log('successfully updated index', index)
  }

  render() {
    //console.log('rendering with', this.state)
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={this.resetEat}>
          <Text style={{fontSize: 20}}> Reset Eating History </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: color}]} onPress={this.resetEverything}>
          <Text style={{fontSize: 20}}> Reset Everything </Text>
        </TouchableOpacity>
        <ScrollView style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 26}}>#</Text>
            <Text style={{fontSize: 26}}>         Date        </Text>
            <Text style={{fontSize: 26}}> Time </Text>
            <Text style={{fontSize: 26}}>Cal's</Text>
            <Text style={{fontSize: 26}}> </Text>
          </View>
          <FlatList
            data={this.state.dailyCalories}
            extraData={this.state}
            renderItem={({item, index}) =>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 24}}>{index}</Text>
                <TouchableOpacity onPress={() => this.showDateTimePicker(index)}>
                  <Text style={{fontSize: 24}}>{moment(item[0]).format('ddd, YYYY-MM-DD')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.showDateTimePicker(index)}>
                  <Text style={{fontSize: 24}}>{moment(item[0]).format('HH:mm')}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  onEndEditing={val => this.updateCalorie(index, val)}
                  placeholder={item[1]}
                />
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => this.deleteMeal(index)}>
                    <CustomIcon size={30} color={Colors.red} name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}/>
                  </TouchableOpacity>
                  <Text>  </Text>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
          />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode={'datetime'}
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
