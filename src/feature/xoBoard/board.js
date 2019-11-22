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

  checkAvailablePos = (board) => {
    const availablePosition = []
    board.forEach((column, colIndex) => column.forEach((row, rowIndex) => {
      if (board[colIndex][rowIndex] === 0) {
        availablePosition.push([colIndex, rowIndex])
      }
    }))
    return availablePosition
  }

  handleBotPlay = () => {
    const { difficult } = this.props.navigation.state.params
    const { tictacBoard } = this.state
    const availablePos = this.checkAvailablePos(tictacBoard)
    if (difficult === 'easy') {
      const selectedPosition = Math.floor(Math.random() * availablePos.length)
      setTimeout(() => { this.selectPosition(availablePos[selectedPosition]) }, 500)
    } else {
      const bestPosition = this.miniMax(tictacBoard)
      setTimeout(() => { this.selectPosition(bestPosition.position) }, 500)
    }
  }

  miniMax = (board, isPlayer = false) => {
    // hard bot using 'minimax' algorithm see => https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/
    // implement base on this code => https://github.com/ahmadabdolsaheb/minimaxarticle/blob/master/index.js

    const availablePos = this.checkAvailablePos(board)
    // collect score for each win to find best position
    if (this.checkForWinner(board, true)) {
      return { score: -10 }
    } else if (this.checkForWinner(board, false)) {
      return { score: 10 }
    } else if (availablePos.length === 0) {
      return { score: 0 }
    }

    const allPossiblePos = []
    const pos = {}

    availablePos.forEach((position) => {
      const [column, row] = position
      pos.position = [column, row]
      board[column][row] = isPlayer ? 'X' : 'O'

      const result = this.miniMax(board, !isPlayer)
      pos.score = result.score

      // update new available position for check minimax again
      board[column][row] = 0
      allPossiblePos.push(pos)
    })

    // check score to find best position
    let bestScore = 0
    let bestPosition = 0
    if (isPlayer) {
      allPossiblePos.forEach((pos, posIndex) => {
        if (pos.score < bestScore) {
          bestScore = pos.score
          bestPosition = posIndex
        }
      })
    } else {
      allPossiblePos.forEach((pos, posIndex) => {
        if (pos.score > bestScore) {
          bestScore = pos.score
          bestPosition = posIndex
        }
      })
    }
    return allPossiblePos[bestPosition]
  }

  checkFormation = () => {
    const { tictacBoard, turnCount, firstPlayer } = this.state
    const { singlePlayer } = this.props.navigation.state.params
    const hasWinner = (turnCount >= 5) && this.checkForWinner(tictacBoard, firstPlayer)

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

  checkForWinner = (tictacBoard, isPlayer) => {
    const playerValue = isPlayer ? 'X' : 'O'
    if (
      (tictacBoard[0][0] === tictacBoard[1][1] && tictacBoard[1][1] === tictacBoard[2][2] ||
        tictacBoard[0][2] === tictacBoard[1][1] && tictacBoard[1][1] === tictacBoard[2][0])
      && tictacBoard[1][1].toString() === playerValue
    ) {
      return true
    } else {
      for (let i = 0; i < tictacBoard.length; i++) {
        if (
          tictacBoard[i][0] === tictacBoard[i][1] &&
          tictacBoard[i][1] === tictacBoard[i][2] &&
          tictacBoard[i][0].toString() === playerValue
        ) {
          return true
        } else if (
          tictacBoard[0][i] === tictacBoard[1][i] &&
          tictacBoard[1][i] === tictacBoard[2][i] &&
          tictacBoard[0][i].toString() === playerValue
        ) {
          return true
        }
      }
    }
    return false
  }

  gameResultSummary = (result) => {
    const { firstPlayer } = this.state
    const { singlePlayer } = this.props.navigation.state.params
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
    const { difficult } = this.props.navigation.state.params
    const isHardMode = (difficult === 'hard')
    this.setState({
      result: '',
      turnCount: 0,
      showModal: false,
      firstPlayer: !isHardMode,
      tictacBoard: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    }, () => {
      isHardMode && this.handleBotPlay()
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
