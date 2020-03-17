import React from 'react';
import {StyleSheet} from 'react-native';

import Animated, {sub, divide, multiply, add} from 'react-native-reanimated';

export const INDICATOR_INITIAL_WIDTH = 10;

export default ({
  translateX,
  activeItemStyle,
  renderProgress,
  scaleX,
  indicatorBorderRadius,
}) => {
  const normalizeScaleX = sub(
    scaleX,
    (indicatorBorderRadius / INDICATOR_INITIAL_WIDTH) * 4,
  );

  const leftCornerTranslateX = translateX;
  const rightCornerTranslateX = add(
    translateX,
    sub(multiply(scaleX, INDICATOR_INITIAL_WIDTH), indicatorBorderRadius * 2),
  );

  const scaleOriginTranslateX = sub(
    divide(multiply(scaleX, INDICATOR_INITIAL_WIDTH), 2),
    INDICATOR_INITIAL_WIDTH / 2,
  );

  return (
    <Animated.View style={{opacity: renderProgress}}>
      <Animated.View
        style={[
          styles.activeSelectorContainer,
          activeItemStyle,
          styles.activeSelectorContainerFix,
          {
            ...StyleSheet.absoluteFillObject,
            transform: [
              {
                translateX: scaleOriginTranslateX,
              },
              {
                translateX,
              },
              {
                scaleX: normalizeScaleX,
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.corner,
          activeItemStyle,
          {
            ...StyleSheet.absoluteFillObject,
            width: indicatorBorderRadius * 2,
            borderTopLeftRadius: indicatorBorderRadius,
            borderBottomLeftRadius: indicatorBorderRadius,
            transform: [{translateX: leftCornerTranslateX}],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.corner,
          activeItemStyle,
          {
            ...StyleSheet.absoluteFillObject,
            width: indicatorBorderRadius * 2,
            borderTopRightRadius: indicatorBorderRadius,
            borderBottomRightRadius: indicatorBorderRadius,
            transform: [{translateX: rightCornerTranslateX}],
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  activeSelectorContainer: {
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  activeSelectorContainerFix: {
    position: 'absolute',
    width: INDICATOR_INITIAL_WIDTH,
  },
  corner: {
    backgroundColor: 'rgba(0,0,0,.4)',
  },
});
