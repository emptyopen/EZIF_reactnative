import React from 'react'
import { View, ScrollView, StyleSheet, FlatList, Platform, StatusBar,
TouchableOpacity, AsyncStorage} from 'react-native'
import Colors from '../constants/Colors'
import Text from '../components/GlobalComponents'
import moment from 'moment'

export default class HistoryScreen extends React.Component {

  state = {
    dailyCalories: null,
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

  render() {
    return (
      <View>
      </View>
    )
  }
}

HistoryScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  	paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
});
