import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import AppLoading from 'expo-app-loading';
import { UserIdentification } from './src/screens/UserIdentification';
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
      <UserIdentification />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});