import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AsyncStorage } from 'react-native'

export default class HistoryScreen extends React.Component {

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('dailyCalories');
      if (value !== null) {
      }
      console.log(value);
    } catch (error) {
      console.log('error: ' + error)
    }
  }

  render() {
    this._retrieveData()
    return (
      <ScrollView style={styles.container}>

      </ScrollView>
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
  },
});
