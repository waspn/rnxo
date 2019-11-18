import 'react-native-gesture-handler'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from '../feature/main';
import Board from '../feature/xoBoard/board';

const MainNavigator = createStackNavigator(
  {
    Main: { screen: MainScreen },
    Board: { screen: Board }
  },
  {
    headerMode: 'none'
  }
);

export default createAppContainer(MainNavigator)