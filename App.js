/**
 * Sample React Native App
 * Showcasing the use of Class & Functional components
 * Using the React-Native Final Tree View and creating branching links using the data provided
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';
import HomeScreen from './components/HomeScreen';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
const entireScreenHeight = Dimensions.get('window').height;
const rem =
  entireScreenWidth > entireScreenHeight
    ? entireScreenHeight / 380
    : entireScreenWidth / 380;

EStyleSheet.build({$rem: rem});
const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#00000' : '#fffff',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#333aff',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: EStyleSheet.value('14rem'),
          }}>
          {'Tree View Branch Example'}
        </Text>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? '#00000' : '#fffff',
          }}>
          <HomeScreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
