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
    caloriesInput: '200',
    weightInput: '',
    totalDailyCalories: 0,
    mode: 'ready',
    todaysDailyCalories: [],
    firstTimeEatenToday: null,
    fastingEndTime: null,
    eatingEndTime: null,
  }

  storeEat = async () => {
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
        if (this.state.mode == 'ready') {
          console.log('updating mode to eating')
          eatingEndTime = moment().add(10, 'second')
          AsyncStorage.setItem('eatingEndTime', JSON.stringify(eatingEndTime))
          this.setState({mode: 'eating', eatingEndTime: eatingEndTime})
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

  updateMode = async () => {

    console.log('start of updateMode', this.state.fastingEndTime, this.state.eatingEndTime)

    // check if we should transition from fasting to ready
    if (this.state.fastingEndTime && moment().diff(moment(this.state.fastingEndTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) > 0) {
      fastingEndTime = moment().add(16, 'hours')
      console.log('setting fastingEndTime and eatingEndTime to null')
      this.setState({fastingEndTime: fastingEndTime, mode: 'ready'})
      AsyncStorage.setItem('fastingEndTime', null)
      AsyncStorage.setItem('eatingEndTime', null)
      this.updateStateMode()
    }

    // check if we should transition from eating to fasting
    if (this.state.eatingEndTime && moment().diff(moment(this.state.eatingEndTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ')) > 0) {
      fastingEndTime = moment().add(16, 'hours')
      console.log('setting fastingEndTime to ', fastingEndTime, ' and eatingEndTime to null')
      this.setState({eatingEndTime: null, fastingEndTime: fastingEndTime, mode: 'fasting'})
      AsyncStorage.setItem('fastingEndTime', JSON.stringify(fastingEndTime))
      AsyncStorage.setItem('eatingEndTime', null)
      this.updateStateMode()
    }

    this.updateStateMode()
  }

  updateStateMode() {
    if (this.state.fastingEndTime == null && this.state.eatingEndTime == null) {
      this.setState({mode: 'ready'})
    } else if (this.state.eatingEndTime == null) {
      this.setState({mode: 'fasting'})
    } else {
      this.setState({mode: 'eating'})
    }
    console.log(' - mode is: ', this.state.mode)
  }

  componentDidMount() {

    //AsyncStorage.setItem('eatingEndTime', JSON.stringify(moment().subtract(7, 'hour').subtract(59, 'minute')))

    AsyncStorage.getItem('totalDailyCalories', (err, result) => {
      if (result !== null) {
        console.log('totalDailyCalories found: ', result)
        this.setState({totalDailyCalories: result})
      } else {
        console.log('totalDailyCalories Not Found, setting to 2000')
        AsyncStorage.setItem('totalDailyCalories', '2000')
        this.setState({totalDailyCalories: '2000'})
      }
    })

    AsyncStorage.getItem('eatingEndTime', (err, eatingEndTime) => {
      if (eatingEndTime !== null) {
        console.log('eatingEndTime found: ', eatingEndTime)
        this.setState({eatingEndTime: eatingEndTime})
      } else {
        console.log('eatingEndTime not found or null, setting to null')
        AsyncStorage.setItem('eatingEndTime', null)
        this.setState({eatingEndTime: null})
      }
    })

    AsyncStorage.getItem('fastingEndTime', (err, fastingEndTime) => {
      if (fastingEndTime !== null) {
        console.log('fastingEndTime found: ', fastingEndTime)
        this.setState({fastingEndTime: fastingEndTime})
      } else {
        console.log('fastingEndTime not found or null, setting to null')
        AsyncStorage.setItem('fastingEndTime', null)
        this.setState({fastingEndTime: null})
      }
    })

    // calories that are from today
    AsyncStorage.getItem('dailyCalories', (err, result) => {
      if (result !== null) {
        console.log('dailyCalories found: ', result)
        var i = 0
        dailyCalories = JSON.parse(result)
        firstTimeEatenToday = ''
        while ( i < dailyCalories.length && moment(dailyCalories[dailyCalories.length - 1 - i][0]).diff(moment().startOf('day')) / 1000 < 86400 && moment(dailyCalories[dailyCalories.length - 1 - i][0]).diff(moment().startOf('day')) / 1000 > 0 ) {
          this.setState({todaysDailyCalories: this.state.todaysDailyCalories.concat(dailyCalories[dailyCalories.length - 1 - i][1])})
          if (firstTimeEatenToday == null) {
            firstTimeEatenToday = dailyCalories[dailyCalories.length - 1 - i][0]
            this.setState({firstTimeEatenToday: firstTimeEatenToday})
          }
          i += 1
        }
        console.log('first time eaten: ', firstTimeEatenToday)
      }
      else {
        console.log('dailyCalories not found.')
      }
    })

    this.updateMode()
  }

  render() {

    caloriesList = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500']

    if (this.state.mode == 'ready') {
      color = Colors.green
    } else if (this.state.mode == 'fasting'){
      color = Colors.red
    } else {
      color = Colors.blue
    }

    caloriesEatenToday = 0
    for (i in this.state.todaysDailyCalories) {
      caloriesEatenToday += parseInt(this.state.todaysDailyCalories[i])
    }

    if (this.state.mode == 'eating') {
      seconds = moment.duration(moment(this.state.eatingEndTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').diff(moment())) / 1000
    } else if (this.state.mode == 'fasting') {
      seconds = moment.duration(moment(this.state.fastingEndTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').diff(moment())) / 1000
    } else {
      seconds = moment.duration(moment(this.state.eatingEndTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').diff(moment())) / 1000
      // todo: make this difference between last eaten and now
    }

    console.log(' & rendering with', this.state.mode, this.state.eatingEndTime, this.state.fastingEndTime, moment(), seconds)

    return (
      <View style={styles.container}>

        { this.state.mode != 'ready' ?
          this.state.mode == 'eating' ?
            <View style={styles.statusContainer}>
              <CountDown
                until={seconds}
                size={27}
                digitTxtStyle={{fontFamily: 'raj-reg', color: 'black'}}
                digitStyle={{backgroundColor: color}}
                timeLabelStyle={{color: 'black'}}
                timeToShow={['H', 'M', 'S']}
                style={{marginBottom: 30}}
                onFinish={this.updateMode}
                id={'1'}
              />
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 30}}>to </Text>
                <Text style={{fontFamily: 'raj-bold', fontSize: 30, color: color}}>eat </Text>
                <Text style={{fontSize: 30}}>left!</Text>
              </View>
            </View>  :
            <View style={styles.statusContainer}>
              <CountDown
                until={seconds}
                size={27}
                digitTxtStyle={{fontFamily: 'raj-reg', color: 'black'}}
                digitStyle={{backgroundColor: color}}
                timeLabelStyle={{color: 'black'}}
                timeToShow={['H', 'M', 'S']}
                style={{marginBottom: 30}}
                onFinish={this.updateMode}
                id={'2'}
              />
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 30}}>of </Text>
                <Text style={{fontFamily: 'raj-bold', fontSize: 30, color: color}}>fasting </Text>
                <Text style={{fontSize: 30}}>left!</Text>
              </View>
            </View> :
          <View style={styles.statusContainer}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 30}}>Ready to</Text>
              <Text style={{fontFamily: 'raj-bold', fontSize: 30, color: Colors.green}}> eat! </Text>
            </View>
          </View>
        }

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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  statusContainer: {
    height: 300,
    width: 300,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  eatContainer: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  weightContainer: {
    height: 70,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  eatButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    height: 30,
    width: 80,
    marginLeft: 20,
  },
  weightButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
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
