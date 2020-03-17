import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import Animated from 'react-native-reanimated';
import {interpolateColor} from 'react-native-redash';

export default ({
  item: {title},
  onLayout,
  onPress,
  textStyle,
  translateX,
  snapPoints,
  index,
  textColor,
  activeTextColor,
}) => {
  const color = interpolateColor(translateX, {
    inputRange: [
      snapPoints[index - 1] || 0,
      snapPoints[index],
      snapPoints[index + 1] || snapPoints[index],
    ],
    outputRange: [textColor, activeTextColor, textColor],
  });
  return (
    <TouchableOpacity
      {...{onPress}}
      style={styles.container}
      onLayout={({
        nativeEvent: {
          layout: {width, height},
        },
      }) => {
        onLayout({width, height});
      }}>
      <Animated.Text style={[styles.titleText, textStyle, {color}]}>
        {title}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
  },
});
