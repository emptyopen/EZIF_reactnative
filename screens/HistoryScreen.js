import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AsyncStorage } from 'react-native'

export default class HistoryScreen extends React.Component {

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('dailyCalories');
      if (value !== null) {
      }
      console.log('hi')
      console.log(value);
    } catch (error) {
      console.log('error: ' + error)
    }
  }

  render() {
    this._retrieveData()
    console.log('hihihi')
    return (
      <ScrollView style={styles.container}>

      </ScrollView>
    )
  }
}

HistoryScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
