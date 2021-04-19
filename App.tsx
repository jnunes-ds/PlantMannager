import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { Welcome } from './src/screens/Welcome';

export default function App(){
  return (
    <SafeAreaView style={styles.container}>
      <Welcome />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});