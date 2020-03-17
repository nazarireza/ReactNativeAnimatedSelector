/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';

import Selector from './Selector';

const selectorData = [
  {
    title: 'Text1',
  },
  {
    title: 'Description1',
  },
  {
    title: 'Tny1',
  },
  {
    title: 'M',
  },
];

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Selector
          data={selectorData}
          containerStyle={styles.selectorContainer}
          activeItemStyle={styles.activeItem}
          textStyle={styles.titleText}
          textColor="white"
          activeTextColor="white"
          containerPadding={8}
          indicatorBorderRadius={8}
          {...{selectedIndex}}
          onSelected={(item, index) => setSelectedIndex(index)}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3e1e59',
  },
  selectorContainer: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#56297d',
  },
  activeItem: {
    backgroundColor: '#56297d',
  },
  titleText: {
    fontSize: 16,
    color: 'white',
  },
});

export default App;
