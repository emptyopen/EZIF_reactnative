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

export default class HomeScreen extends React.Component {

  state = {
    status: '8 hours',
    caloriesInput: '500',
    totalDailyCalories: 0,
    eatFastMode: 'eat',
    seconds: 0,
  }

  storeEat = async () => {
    try {
      //AsyncStorage.removeItem('dailyCalories')
      AsyncStorage.getItem('dailyCalories', (err, result) => {
        if (result !== null) {
          var newCalories = JSON.parse(result)
          newCalories[moment().toString()] = this.state.caloriesInput;
          console.log('dailyCalories now', newCalories);
          AsyncStorage.setItem('dailyCalories', JSON.stringify(newCalories));
        } else {
          var m = new Map()
          m[moment().toString()] = this.state.caloriesInput
          AsyncStorage.setItem('dailyCalories', JSON.stringify(m));
          console.log('not found, creating dailyCalories.');
        }
      })
    } catch (error) {
      console.log('error storing eat: ', error)
    }
  }

  componentDidMount() {
    var ms = moment().day(7).startOf('day').diff(moment())
    var d = moment.duration(ms)
    this.setState({seconds: d / 1000})

    AsyncStorage.getItem('totalDailyCalories', (err, result) => {
      if (result !== null) {
        console.log('totalDailyCalories found: ', result);
        this.setState({totalDailyCalories: result})
      } else {
        console.log('totalDailyCalories Not Found, setting to 2000');
        AsyncStorage.setItem('totalDailyCalories', '2000')
      }
    });
  }

  render() {
    caloriesList = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500']
    if (this.state.eatFastMode == 'eat') {
      color = Colors.blue
    } else {
      color = Colors.red
    }
    return (
      <View style={styles.container}>

        <View style={styles.caloriesContainer}>
          <Text style={{fontFamily: 'raj-bold', fontSize: 30}}>{2000 - this.state.totalDailyCalories} calories</Text>
          <Text style={{fontSize: 25}}> left to eat! </Text>
        </View>

        <View style={styles.statusContainer}>
          <CountDown
            until={this.state.seconds}
            size={20}
            digitTxtStyle={{fontFamily: 'raj-reg', color: 'black'}}
            digitStyle={{backgroundColor: color}}
            timeLabelStyle={{color: 'black'}}
            timeToShow={['H', 'M', 'S']}
            style={{marginBottom: 30}}
          />
          { this.state.eatFastMode == 'eat' ?
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 30}}>to </Text>
              <Text style={{fontFamily: 'raj-bold', fontSize: 30, color: color}}>eat </Text>
              <Text style={{fontSize: 30}}>left!</Text>
            </View> :
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 30}}>of </Text>
              <Text style={{fontFamily: 'raj-bold', fontSize: 30, color: color}}>fasting </Text>
              <Text style={{fontSize: 30}}>left!</Text>
            </View>
          }
        </View>

        <View style={styles.eatContainer}>
          <View style={{borderWidth: 1, borderRadius:5}}>
            <Picker
              selectedValue={this.state.caloriesInput}
              style={{width: 120, height:30}}
              itemStyle={{color: 'blue', borderRadius:5}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({caloriesInput: itemValue})
              }>
              { caloriesList.map((prompt) => {
                return <Picker.Item label={prompt} value={prompt} key={prompt}/>
              })}
            </Picker>
          </View>
          <TouchableOpacity style={[styles.eatButton, {backgroundColor: color}]} onPress={this.storeEat}>
            <Text style={{fontSize: 20}}> Eat </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.weightButton, {backgroundColor: color}]} onPress={this.createProfile}>
          <Text style={{fontSize: 15}}> Add Weight Measurement </Text>
        </TouchableOpacity>

      </View>
    );
  }
}

HomeScreen.navigationOptions = {
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
  caloriesContainer: {
    height: 70,
    width: 250,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  statusContainer: {
    height: 300,
    width: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  eatContainer: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  eatButton: {
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
  weightButton: {
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
