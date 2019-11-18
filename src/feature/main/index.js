import React, { Component } from 'react'
import {
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const { height } = Dimensions.get('window')

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { gameMode: '' }
  }

  renderMenuButton = () => {
    const { gameMode } = this.state
    switch (gameMode) {
      case 'single':
        return {}
      case 'multi':
        return {}
    }
  }

  render() {
    const { navigation } = this.props
    return (
      <SafeAreaView>
        <View style={styles.body}>
          <Text style={{ fontSize: 30 }}>X O X O X O X O</Text>
          <View style={{ marginVertical: 25, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Board')} style={styles.btn}>
              <Text style={styles.sectionTitle}>Single Player</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ gameMode: 'multi' })} style={styles.btn}>
              <Text style={styles.sectionTitle}>2 Players</Text>
            </TouchableOpacity>
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