import React, { Component } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Modal,
  View,
  Text,
} from 'react-native';


const initialBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
class Board extends Component {

  constructor(props) {
    super(props)
    this.state = {
      result: '',
      turnCount: 0,
      showModal: false,
      firstPlayer: true,
      tictacBoard: initialBoard
      // use 0 for initial value in each cell
    }
  }

  componentDidMount() {
    this.resetBoard()
  }

  renderBoard = (data) => {
    return data.map((columnValue, columnIndex) => {
      return (
        <View key={columnIndex} style={{ flexDirection: 'row' }}>
          {
            columnValue.map((rowValue, rowIndex) => (
              <TouchableOpacity key={rowIndex} disabled={rowValue !== 0} onPress={() => this.selectPosition([columnIndex, rowIndex])}>
                <View style={{ borderWidth: 2, borderColor: 'black', width: 100, height: 100, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }} >
                  <Text style={{ fontSize: 40 }}>{rowValue !== 0 && rowValue}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </View>
      )
    })
  }

  selectPosition = (position) => {
    const [column, row] = position
    const { firstPlayer, tictacBoard } = this.state
    const updateValue = tictacBoard
    updateValue[column][row] = firstPlayer ? 'X' : 'O'
    this.setState({
      turnCount: this.state.turnCount + 1,
      tictacBoard: updateValue
    }, () => this.checkFormation())
  }

  checkAvailablePos = () => {
    const { tictacBoard } = this.state
    const availablePosition = []
    tictacBoard.forEach((column, colIndex) => column.forEach((row, rowIndex) => {
      if (tictacBoard[colIndex][rowIndex] === 0) {
        availablePosition.push([colIndex, rowIndex])
      }
    }))
    return availablePosition
  }

  handleBotPlay = () => {
    const availablePos = this.checkAvailablePos()
    const selectedPosition = Math.floor(Math.random() * availablePos.length)
    setTimeout(() => { this.selectPosition(availablePos[selectedPosition]) }, 1000)
  }

  checkFormation = () => {
    const { turnCount } = this.state
    const { singlePlayer } = this.props.navigation.state.params
    const hasWinner = (turnCount >= 5) && this.checkForWinner()

    if (hasWinner) {
      this.gameResultSummary('win')
    } else {
      turnCount === 9 && this.gameResultSummary('draw')
      this.setState({ firstPlayer: !this.state.firstPlayer }, () => {
        // get latest state value
        if (singlePlayer && !this.state.firstPlayer) {
          this.handleBotPlay()
        }
      })
    }
  }

  checkForWinner = () => {
    const { tictacBoard } = this.state
    for (let i = 0; i < tictacBoard.length; i++) {
      if (
        tictacBoard[i][0] === tictacBoard[i][1] &&
        tictacBoard[i][1] === tictacBoard[i][2] &&
        tictacBoard[i][0].toString() !== '0'
      ) {
        console.log('HORIZONTAL WIN')
        return true
      } else if (
        tictacBoard[0][i] === tictacBoard[1][i] &&
        tictacBoard[1][i] === tictacBoard[2][i] &&
        tictacBoard[0][i].toString() !== '0'
      ) {
        console.log('VERTICAL WIN')
        return true
      }
    }

    if (
      (tictacBoard[0][0] === tictacBoard[1][1] && tictacBoard[1][1] === tictacBoard[2][2] ||
        tictacBoard[0][2] === tictacBoard[1][1] && tictacBoard[1][1] === tictacBoard[2][0])
      && tictacBoard[1][1].toString() !== '0'
    ) {
      console.log('DIAGONAL WIN')
      return true
    }
  }

  gameResultSummary = (result) => {
    const { firstPlayer } = this.state
    const { singlePlayer } = this.props.navigation.state.params
    console.log('singlePlayer', singlePlayer)
    switch (result) {
      case 'win': {
        if (singlePlayer) {
          result = `YOU ${firstPlayer ? 'WIN' : 'LOSE'}`
        } else {
          result = `Player ${firstPlayer ? '1' : '2'} WIN`
        }
      } break
      case 'draw': {
        result = 'DRAW'
      } break
    }
    this.setState({ result, showModal: true })
  }

  resetBoard = () => {
    this.setState({
      result: '',
      turnCount: 0,
      showModal: false,
      firstPlayer: true,
      tictacBoard: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    })
  }

  render() {
    const { navigation } = this.props
    const { tictacBoard, showModal, result } = this.state
    console.log('result', result)
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
        <Modal
          visible={showModal}
          transparent={true}
          animation={'fade'}
        >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View style={{ backgroundColor: 'white', justifyContent: 'space-around', alignItems: 'center', padding: 20, marginHorizontal: 20, flex: 0.2 }}>
              <Text style={{ fontSize: 25 }}>{result}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={styles.flatBtn} onPress={() => this.resetBoard()}>
                  <Text>PLAY AGAIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.flatBtn} onPress={() => navigation.goBack()}>
                  <Text>EXIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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

