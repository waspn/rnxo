import React, { Component, Fragment } from 'react'
import { NavigationEvents } from 'react-navigation';
import {
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
  View,
  Text,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const { height } = Dimensions.get('window')

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { screen: 'main' }
  }

  renderMenuButton = () => {
    const { navigation } = this.props
    switch (this.state.screen) {
      case 'main':
        return (
          <Fragment>
            <TouchableOpacity onPress={() => this.setState({ screen: 'difficult'})} style={styles.btn} >
              <Text style={styles.sectionTitle}>Single Player</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Board', { singlePlayer: false })} style={styles.btn}>
              <Text style={styles.sectionTitle}>2 Players</Text>
            </TouchableOpacity>
          </Fragment>
        )
      case 'difficult':
        return (
          <Fragment>
            <Text style={{ fontSize: 30 }}>Select difficulty</Text>
            <View style={{ marginVertical: 15 }} />
            <TouchableOpacity onPress={() => navigation.navigate('Board', { singlePlayer: true, difficult: 'easy' })} style={styles.btn} >
              <Text style={styles.sectionTitle}>Easy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Board', { singlePlayer: true, difficult: 'hard' })} style={styles.btn}>
              <Text style={styles.sectionTitle}>Hard</Text>
            </TouchableOpacity>
            <View style={{ marginVertical: 15 }} />
            <TouchableOpacity onPress={() => this.setState({ screen: 'main' })} style={styles.btn}>
              <Text style={styles.sectionTitle}>Back</Text>
            </TouchableOpacity>
          </Fragment>
        )
    }
  }

  render() {
    return (
      <SafeAreaView>
        <NavigationEvents onWillFocus={() => this.setState({ screen: 'main' })} />
        <View style={styles.body}>
          <Image style={{ width: 250, height: 250 }} source={require('../../assets/ttt.png')} />
          <View style={{ marginVertical: 25, alignItems: 'center' }}>
            {this.renderMenuButton()}
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    height,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
  },
  btn: {
    marginVertical: 15
  }
});

export default MainScreen