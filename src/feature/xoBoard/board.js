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


const initialBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
class Board extends Component {

  constructor(props) {
    super(props)
    this.state = {
      firstPlayer: true,
      tictacBoard: initialBoard
      // use 0 for initial value in each cell
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.checkFormation()
  }

  renderBoard = (data) => {
    const { firstPlayer } = this.state
    // console.log('DATAAA', data)
    return data.map((columnValue, columnIndex) => {
      // console.log('KEY', columnIndex)
      return (
        <View key={columnIndex} style={{ flexDirection: 'row' }}>
          {
            columnValue.map((rowValue, rowIndex) => {
              // console.log('rowIndex', rowIndex)
              return (
                <TouchableOpacity key={rowIndex} disabled={rowValue !== 0} onPress={() => this.selectPosition([columnIndex, rowIndex])}>
                  <View style={{ borderWidth: 2, borderColor: 'black', width: 100, height: 100, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 40 }}>{rowValue !== 0 && rowValue}</Text>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </View>
      )
    })
  }

  selectPosition = async (position) => {
    const [column, row] = position
    const { firstPlayer, tictacBoard } = this.state
    const updateValue = tictacBoard
    updateValue[column][row] = firstPlayer ? 'X' : 'O'
    this.setState({
      tictacBoard: updateValue,
      firstPlayer: !this.state.firstPlayer
    })
  }

  checkFormation = () => {
    console.log('checkFormation')
    const { tictacBoard } = this.state
    for (let i = 0; i < tictacBoard.length; i++) {
      if (
        tictacBoard[i][0] === tictacBoard[i][1] &&
        tictacBoard[i][1] === tictacBoard[i][2] &&
        tictacBoard[i][0].toString() !== '0'
      ) {
        console.log('HORIZONTAL WIN')
      } else if (
        tictacBoard[0][i] === tictacBoard[1][i] &&
        tictacBoard[1][i] === tictacBoard[2][i] &&
        tictacBoard[0][i].toString() !== '0'
      ) {
        console.log('VERTICAL WIN')
      }
    }

    if (
      tictacBoard[0][0] === tictacBoard[1][1] && tictacBoard[1][1] === tictacBoard[2][2] ||
      tictacBoard[0][2] === tictacBoard[1][1] && tictacBoard[1][1] === tictacBoard[2][0]
      && tictacBoard[1][1].toString() !== '0'
    ) {
      console.log('DIAGONAL WIN')
    }
  }

  resetBoard = () => {
    this.setState({
      tictacBoard: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      firstPlayer: true
    })
  }

  render() {
    const { navigation } = this.props
    const { tictacBoard } = this.state
    // console.log('tictacBoard', tictacBoard)
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 15, backgroundColor: 'blue' }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          {this.renderBoard(tictacBoard)}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity style={styles.flatBtn} onPress={() => this.resetBoard()}>
            <Text>RESET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.flatBtn} onPress={() => navigation.goBack()}>
            <Text>EXIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flatBtn: {
    height: 35,
    width: 120,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }
})

export default Board

