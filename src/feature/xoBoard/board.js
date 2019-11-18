import React, { Component } from 'react'
import {
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  FlatList,
  View,
  Text,
} from 'react-native';

const { width, height } = Dimensions.get('window')

class Board extends Component {

  constructor(props) {
    super(props)
    this.state = {
      firstPlayer: true,
      tictacBoard: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }

  renderBoard = (data, key) => {
    const { item, index } = data
    return (
      <TouchableOpacity key={index} onPress={() => console.log('value-', item, 'INDEX-', index + 1)}>
        <View style={{ borderWidth: 2, borderColor: 'black', width: 100, height: 100, backgroundColor: 'white' }} >
          {/* <Text>{item !== 0 && tictacValue}</Text> */}
        </View>
      </TouchableOpacity >
    )
  }

  selectPosition = (player, position) => {
    const { firstPlayer, tictacBoard } = this.state
    const tictacValue = firstPlayer ? 'X' : 'O'
  }

  checkFormation = (position) => {

  }

  render() {
    const { tictacBoard } = this.state
    return (
      <View style={{ flexDirection: 'row', height, width, padding: 15, backgroundColor: 'blue' }}>
        <FlatList
          data={tictacBoard}
          horizontal={false}
          numColumns={3}
          renderItem={this.renderBoard}
        />
      </View>
    )
  }

}

export default Board

