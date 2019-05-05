import React, { Component } from 'react';
import { Button, Text, View, StyleSheet, TouchableHighlight, Alert} from 'react-native';
import SettingScreen from './controller/Setting'
import {createStackNavigator,createAppContainer,StackActions, NavigationActions} from 'react-navigation';
import { Constants, AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded } from 'expo';  
 
//for translation
import i18n from './i18n'; 

//styling
import styles from './style/main.js'  

class HomeScreen extends Component {

  //header bar is not required for first page
  static navigationOptions = { header: null };

  constructor() {
      super();
      this.state = {
         displayText:"",
         numOfHour: 0,
         numOfMin: 0,
         numOfSec: 0,
         calType: null,
         pCalType: CALTYPE.kAdd,
         calBtnPressed: false,
         firstTime: true,
         processed: false
      } 
  }

  componentDidMount() {
    var _this = this;
    i18n.on('loaded', function(loaded) {
      console.log("loaded = " + loaded);
      _this.reset();
    })
  }
  reset(){
    console.log("reset fire!");
    this.setState(
      {displayText:"",
        firstTime:true,
        calBtnPressed:false,
        numOfHour: 0,
        numOfMin: 0,
        numOfSec: 0,
        calType: null,
        pCalType: CALTYPE.kAdd,
        processed: false
      });
  }
  clearDisplay(){
    console.log("clearDisplay fire!");
    this.setState(
      {
        displayText:"" 
    });
  }
  validationInput(calType,s){
    console.log("validationInput fire!");

    if(this.state.processed) return true;
    var patt = new RegExp("^[0-9]+:[0-9]+$|^[0-9]+:[0-9]+:[0-9]+$");

    //regex for multiply and Divide
    if(this.state.pCalType==CALTYPE.kMultiply||this.state.pCalType==CALTYPE.kDivide){
      patt = new RegExp("^[0-9]+$");
    }
    
    if(patt.test(s)){
      console.log("**valid input**");
      return true;
    }
    else{
      if(this.state.pCalType==CALTYPE.kMultiply||this.state.pCalType==CALTYPE.kDivide){
        Alert.alert(i18n.t('alert_invalid_input'));
      }
      else
        Alert.alert(i18n.t('alert_invalid_format')); 
      return false;
    }
  }
  processInput(calType,s){
    console.log("processInput fire");

    if(this.validationInput(calType,s)){

      this.setState({
        calType:calType
      });
      
      //process it
      //break the input into times component
      var components = s.split(":");
      
      console.log(components);

      var totalHour,totalMin,totalSec,inputHour,inputMin,inputSec;
      totalHour=totalMin=totalSec=inputHour=inputMin=inputSec=0; 

      if(this.state.firstTime){
        
        totalHour=Number.parseInt(components[0]);
        totalMin=Number.parseInt(components[1]);
        totalSec=components.length>2?Number.parseInt(components[2]):0;

        console.log("very first time");
        this.setState((state) => ({         
          firstTime:false
        }))
      }
      else{
        totalHour=this.state.numOfHour;
        totalMin=this.state.numOfMin;
        totalSec=this.state.numOfSec;

        inputHour=Number.parseInt(components[0]);
        inputMin=Number.parseInt(components[1]);

        if(components.length>2){

          inputSec=Number.parseInt(components[2]);
        }
      }

      console.log("pCalType ="+this.state.pCalType);
      //resume this variable
      this.setState({calBtnPressed:false});
      
      //if the previous calculation is already processed, don't do it the second time, useful for switching Calculation type,e.g from Plus to divide
      if(!this.state.processed){
        switch(this.state.pCalType){
          case CALTYPE.kAdd:this.processAdd(totalHour,totalMin,totalSec,inputHour,inputMin,inputSec); break;
          case CALTYPE.kMinus:this.processMinus(totalHour,totalMin,totalSec,inputHour,inputMin,inputSec); break;
          case CALTYPE.kMultiply:this.processMultiply(totalHour,totalMin,totalSec,inputHour); break;
          case CALTYPE.kDivide:this.processMultiply(totalHour,totalMin,totalSec,1/inputHour); break;
        }
      }
      else{
        this.setState((state) => ({
          pCalType: state.calType
        }))  
      }
    }
  }
  processAdd(totalHour,totalMin,totalSec,inputHour,inputMin,inputSec){
    console.log("totalHour ="+totalHour);
    console.log("inputHour ="+inputHour);

    totalHour+=inputHour;
    totalMin+=inputMin;
    totalSec+=inputSec;   
    
    this.postProcess(totalHour,totalMin,totalSec);
  }
  processMinus(totalHour,totalMin,totalSec,inputHour,inputMin,inputSec){
    console.log("processMinus fire");
    console.log("totalHour ="+totalHour);
    console.log("inputHour ="+inputHour);

    totalHour=totalHour-inputHour;
    totalMin=totalMin-inputMin;
    totalSec=totalSec-inputSec;   
    
    this.postProcess(totalHour,totalMin,totalSec);
  }
  processMultiply(totalHour,totalMin,totalSec,factor){
    console.log("processMultiply fire");
    console.log("totalHour ="+totalHour);

    totalMin += totalHour*60;
    totalSec += totalMin*60;

    totalHour = totalMin = 0;

    console.log("orginal totalSec = "+totalSec);
    console.log("factor = "+factor);

    totalSec = totalSec*factor;
    console.log("post totalSec = "+totalSec);
    
    this.postProcess(totalHour,totalMin,totalSec);
  }
  processDivide(totalHour,totalMin,totalSec,factor){
    console.log("processDivide fire");
    console.log("totalHour ="+totalHour);

    totalHour=totalHour-inputHour;
    totalMin=totalMin-inputMin;
    totalSec=totalSec-inputSec;   
    
    this.postProcess(totalHour,totalMin,totalSec);
  }
  postProcess(totalHour,totalMin,totalSec){
    console.log("postProcess fire");
    totalMin+=Number.parseInt(totalSec/60);
    totalSec=Number.parseInt(totalSec%60);

    if(totalSec<0){
      totalMin--;
      totalSec=60-totalSec;
    }

    totalHour+=Number.parseInt(totalMin/60);
    totalMin=totalMin%60;

    if(totalMin<0){
      totalHour--;
      totalMin=60-totalMin;
    }

    this.setState((state) => ({
      numOfHour:totalHour,
      numOfMin:totalMin, 
      numOfSec: totalSec,
      displayText: totalHour+":"+totalMin+(totalSec>0?":"+totalSec:""),
      pCalType: state.calType,
      processed: true
    }))
  }
  _onPressButton(id) {
    console.log("Caltype = " + this.state.calType);
    console.log("i18n.language = "+ i18n.language);
     //for number button and ":" button
     if(!isNaN(id)||id==":"){

      console.log("number key clicked");
       
      console.log("this.state.calType ="+this.state.calType);
      console.log("this.state.calBtnPressed = "+this.state.calBtnPressed);
       if(this.state.calType!=null && !this.state.calBtnPressed){
        console.log("cleared displayText");
          this.setState(
            (state) => ({ displayText: "",
                          calBtnPressed:true})
          );
       }

       if(this.state.calType==CALTYPE.kEqual){
         this.reset();
       }
       this.setState(
          (state) => ({ displayText: state.displayText + id, processed:false})
        ); 
        
     }else{
      switch(id){
        case "+": this.processInput(CALTYPE.kAdd,this.state.displayText); break;
        case "-": this.processInput(CALTYPE.kMinus,this.state.displayText); break;
        case "÷": this.processInput(CALTYPE.kDivide,this.state.displayText); console.log("divide");break;
        case "×": this.processInput(CALTYPE.kMultiply,this.state.displayText); console.log("multiply");break;
        case "AC": this.reset(); break;
        case "C": this.clearDisplay(); break;
        case "=": this.processInput(CALTYPE.kEqual,this.state.displayText); console.log("equal");break;
      } 
    } 
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.topContainer}>
            <Text style={styles.resultText}>{this.state.displayText}</Text>
        </View>
        <View style={styles.colContainer}>
            <TouchableHighlight style={styles.bigButton} onPress={() => this._onPressButton("AC")} underlayColor="white">
            <View >
              <Text style={styles.buttonText}>AC</Text>
            </View>
          </TouchableHighlight>
          
          <TouchableHighlight style={styles.bigButton} onPress={() => this._onPressButton("C")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>C</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("÷")} underlayColor="white">
            <View>
              <Text style={[styles.buttonText, this.state.calType==CALTYPE.kDivide && styles.buttonTextHighlight]}>÷</Text>
            </View>
          </TouchableHighlight>
          
        </View>
        <View style={styles.colContainer}>
            <TouchableHighlight style={styles.button} onPress={() => this._onPressButton(7)} underlayColor="white">
            <View >
              <Text style={styles.buttonText}>7</Text>
            </View>
          </TouchableHighlight>
          
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("8")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>8</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("9")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>9</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("×")} underlayColor="white">
            <View>
              <Text style={[styles.buttonText, this.state.calType==CALTYPE.kMultiply && styles.buttonTextHighlight]}>×</Text>
            </View>
          </TouchableHighlight>
        </View>
        
        <View style={styles.colContainer}>
            <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("4")} underlayColor="white">
            <View >
              <Text style={styles.buttonText}>4</Text>
            </View>
          </TouchableHighlight>
          
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("5")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>5</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("6")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>6</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("-")} underlayColor="white">
            <View>
              <Text style={[styles.buttonText, this.state.calType==CALTYPE.kMinus && styles.buttonTextHighlight]}>-</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.colContainer}>
            <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("1")} underlayColor="white">
            <View >
              <Text style={styles.buttonText}>1</Text>
            </View>
          </TouchableHighlight>
          
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("2")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>2</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("3")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>3</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("+")} underlayColor="white">
            <View>
              <Text style={[styles.buttonText, this.state.calType==CALTYPE.kAdd && styles.buttonTextHighlight]}>+</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.colContainer}>
            <TouchableHighlight style={styles.bigButton} onPress={() => this._onPressButton("0")} underlayColor="white">
            <View >
              <Text style={styles.buttonText}>0</Text>
            </View>
          </TouchableHighlight>
          
          <TouchableHighlight style={styles.bigButton} onPress={() => this._onPressButton(":")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>:</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this._onPressButton("=")} underlayColor="white">
            <View>
              <Text style={styles.buttonText}>=</Text>
            </View>
          </TouchableHighlight>
          
        </View>

        <AdMobBanner
  bannerSize="fullBanner"
  adUnitID="ca-app-pub-6754000380546586/3909004780" // Test ID, Replace with your-admob-unit-id
  testDeviceID="EMULATOR"
  onDidFailToReceiveAdWithError={this.bannerError} />
        
      </View>
    );
  }
}
const CALTYPE = {
  kAdd: 0,
  kMinus: 1,
  kMultiply: 2,
  kDivide: 3,
  kEqual: 4
}
const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Setting: SettingScreen
  },
  { 
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);


