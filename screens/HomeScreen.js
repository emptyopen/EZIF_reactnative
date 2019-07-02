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
  KeyboardAvoidingView,
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
    weightInput: '',
    totalDailyCalories: 0,
    mode: 'fast',
    seconds: 0,
    todaysDailyCalories: [],
    firstTimeEatenToday: null,
    lastTimeEaten: null,
  }

  storeEat = async () => {
    try {
      AsyncStorage.getItem('dailyCalories', (err, result) => {
        if (result !== null) {
          var newCalories = JSON.parse(result).concat([[moment(), this.state.caloriesInput]])
          console.log('dailyCalories now', newCalories)
          AsyncStorage.setItem('dailyCalories', JSON.stringify(newCalories))
          this.setState({todaysDailyCalories: this.state.todaysDailyCalories.concat(this.state.caloriesInput)})
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

  storeWeight = async () => {
    try {
      AsyncStorage.getItem('weights', (err, result) => {
        if (result !== null) {
          var weights = JSON.parse(result).concat([[moment(), this.state.weightInput]])
          AsyncStorage.setItem('weights', JSON.stringify(weights))
          console.log('weights now', weights)
        } else {
          console.log('not found, creating weights.')
          AsyncStorage.setItem('weights', JSON.stringify([[moment(), this.state.weightInput]]))
          console.log('weights now', [[moment(), this.state.caloriesInput]])
        }
      })
    } catch (error) {
      console.log('error storing weight: ', error)
    }
  }

  componentDidMount() {
    var ms = moment().day(7).startOf('day').diff(moment())
    var d = moment.duration(ms)
    this.setState({seconds: d / 1000})

    // total daily calories
    AsyncStorage.getItem('totalDailyCalories', (err, result) => {
      if (result !== null) {
        console.log('totalDailyCalories found: ', result);
        this.setState({totalDailyCalories: result})
      } else {
        console.log('totalDailyCalories Not Found, setting to 2000');
        AsyncStorage.setItem('totalDailyCalories', '2000')
        this.setState({totalDailyCalories: '2000'})
      }
    })

    // calories that are from today
    AsyncStorage.getItem('dailyCalories', (err, result) => {
      if (result !== null) {
        console.log('dailyCalories found: ', result);
        var i = 0
        dailyCalories = JSON.parse(result)
        firstTimeEatenToday = ''
        while ( i < dailyCalories.length && moment(dailyCalories[dailyCalories.length - 1 - i][0]).diff(moment().startOf('day')) / 1000 < 86400 ) {
          this.setState({todaysDailyCalories: this.state.todaysDailyCalories.concat(dailyCalories[dailyCalories.length - 1 - i][1])})
          if (firstTimeEatenToday == null) {
            firstTimeEatenToday = dailyCalories[dailyCalories.length - 1 - i][0]
            this.setState({firstTimeEatenToday: firstTimeEatenToday})
          }
          i += 1
        }
        console.log('todays calories: ', this.state.todaysDailyCalories)
        console.log('first time eaten: ', firstTimeEatenToday)
        console.log('last time eaten: ', lastTimeEaten                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          )
      }
      else {
        console.log('dailyCalories not found.')
      }
    })
  }

  render() {
    caloriesList = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500']
    if (this.state.mode != 'fast') {
      color = Colors.blue
    } else {
      color = Colors.red
    }
    caloriesEatenToday = 0
    for (i in this.state.todaysDailyCalories) {
      caloriesEatenToday += parseInt(this.state.todaysDailyCalories[i])
    }
    return (
      <View style={styles.container}>

        { this.state.totalDailyCalories - caloriesEatenToday >= 0 ?
          <View style={styles.caloriesContainer}>
            <Text style={{fontFamily: 'raj-bold', fontSize: 30}}>{this.state.totalDailyCalories - caloriesEatenToday} calories</Text>
            <Text style={{fontSize: 25}}> left to eat! </Text>
          </View> :
          <View style={[styles.caloriesContainer, {backgroundColor: Colors.red}]}>
            <Text style={{fontFamily: 'raj-bold', fontSize: 30}}>{(this.state.totalDailyCalories - caloriesEatenToday) * -1} calories</Text>
            <Text style={{fontSize: 25}}> overbudget! </Text>
          </View>
        }

        { this.state.mode != 'ready' ?
          <View style={styles.statusContainer}>
            <CountDown
              until={this.state.seconds}
              size={27}
              digitTxtStyle={{fontFamily: 'raj-reg', color: 'black'}}
              digitStyle={{backgroundColor: color}}
              timeLabelStyle={{color: 'black'}}
              timeToShow={['H', 'M', 'S']}
              style={{marginBottom: 30}}
            />
            { this.state.mode == 'eat' ?
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
          </View> :
          <View style={styles.statusContainer}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 30}}>Ready to</Text>
              <Text style={{fontFamily: 'raj-bold', fontSize: 30, color: Colors.green}}> eat! </Text>
            </View>
          </View>
        }


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

        <View style={styles.weightContainer}>
          <TextInput
            style={styles.input}
            onChangeText={val => this.setState({weightInput: val})}
            keyboardType={'numeric'}
          />
          <TouchableOpacity style={[styles.weightButton, {backgroundColor: color}]} onPress={this.storeWeight}>
            <Text style={{fontSize: 20}}> Weight </Text>
          </TouchableOpacity>
        </View>
	      <KeyboardAvoidingView behavior={'padding'}/>
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
  weightContainer: {
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
    width: 80,
    marginLeft: 20,
  },
  input: {
    width: 100,
    fontFamily: 'raj-reg',
    fontSize: 20,
    color: 'black',
    height: 30,
    backgroundColor: 'white',
    margin: 4,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});
