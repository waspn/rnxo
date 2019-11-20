import React, { Component } from 'react'
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Modal,
  Image,
  View,
  Text,
} from 'react-native';

const xIcon = require('../../assets/x.png')
const oIcon = require('../../assets/o.png')
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
              <TouchableOpacity key={rowIndex} activeOpacity={0.8} disabled={rowValue !== 0} onPress={() => this.selectPosition([columnIndex, rowIndex])}>
                <View style={styles.boardCell} >
                  {rowValue !== 0 && <Image style={{ width: 50, height: 50 }} source={(rowValue === 'X' ? xIcon : oIcon)} />}
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
      if (turnCount === 9) {
        this.gameResultSummary('draw')
      } else {
        this.setState({ firstPlayer: !this.state.firstPlayer }, () => {
          // get latest state value
          if (singlePlayer && !this.state.firstPlayer) {
            this.handleBotPlay()
          }
        })
      }
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
    const { tictacBoard, showModal, result, firstPlayer } = this.state
    const boardColor = firstPlayer ? 'lightgreen' : 'crimson'
    return (
      <SafeAreaView style={styles.container}>
        <Image style={{ width: 120, height: 120 }} source={require('../../assets/ttt.png')} />
        <View style={{ ...styles.boardContainer, borderColor: boardColor, backgroundColor: boardColor }}>
          {this.renderBoard(tictacBoard)}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightblue', flex: 0.2 }}>
          <TouchableOpacity style={styles.flatBtn} onPress={() => this.resetBoard()}>
            <Text style={styles.btnText}>RESET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.flatBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>EXIT</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showModal}
          transparent={true}
          animation={'fade'}
        >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <View style={styles.modal}>
              <Text style={{ fontSize: 35, color: 'white' }}>- {result} -</Text>
              <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginTop: 35 }}>
                <TouchableOpacity style={styles.flatBtn} onPress={() => this.resetBoard()}>
                  <Text style={styles.btnText}>PLAY AGAIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.flatBtn} onPress={() => navigation.goBack()}>
                  <Text style={styles.btnText}>EXIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15
  },
  boardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    bottom: 20,
    borderWidth: 2,
  },
  boardCell: {
    margin: 2,
    width: 100,
    height: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 20,
    color: 'white'
  },
  flatBtn: {
    height: 35,
    flex: 0.8,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    flex: 0.2
  }
})

export default Board
