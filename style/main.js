import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#ecf0f1',
    },
    paragraph: {
      margin: 24,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#34495e',
    },
    colContainer: {
      flex: 1, 
      flexDirection:'row', 
      alignItems: 'stretch', 
    },
    bigButton: {
      flex: 1.5,
      margin: 1,
      alignItems: 'center',
      backgroundColor: 'lightgrey',
      justifyContent: 'center',
    },
    button: {
      flex: 1,
      margin: 1,
      alignItems: 'center',
      backgroundColor: 'lightgrey',
      justifyContent: 'center',
    },
    buttonText: {
      backgroundColor: 'transparent',
      color: 'grey',
      fontSize:30
    },
    buttonTextHighlight: {
      color: "white"
    },
    topContainer: {
      flex: 1.4,  
      flexDirection:'row', 
      backgroundColor: 'orange',
      alignItems: 'flex-end'
    },
    resultText: {
      width:'100%',
      padding:10,
      backgroundColor: 'transparent',
      color: 'grey',
      alignItems: "baseline",
      textAlign: 'right',
      fontSize:55
    }
  });

  export default styles;