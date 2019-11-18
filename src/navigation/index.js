import 'react-native-gesture-handler'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from '../feature/main';

const MainNavigator = createStackNavigator(
  {
    Main: { screen: MainScreen },
  },
  {
    headerMode: 'none'
  }
);

export default createAppContainer(MainNavigator)