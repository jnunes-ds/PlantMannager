import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Confirmation } from './src/screens/Confirmation';
import {  
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';

export default function App(){
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  if(!fontsLoaded){
    return <AppLoading />
  } 
  
  return (
    <SafeAreaView style={styles.container}>
      <Confirmation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});