import React, {useState, useMemo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';

import {useValues, timing, useClocks} from 'react-native-redash';
import {
  useCode,
  block,
  set,
  Easing,
  cond,
  clockRunning,
  eq,
} from 'react-native-reanimated';
import SelectorItem from './SelectorItem';
import SelectorIndicator, {INDICATOR_INITIAL_WIDTH} from './SelectorIndicator';

export default ({
  data,
  containerStyle,
  activeItemStyle,
  textStyle,
  textColor = 'black',
  activeTextColor = 'white',
  containerPadding = 8,
  indicatorBorderRadius = 8,
  selectedIndex,
  onSelected,
}) => {
  const [mustBeRender, setMustBeRender] = useState(false);
  const itemsWidthTemp = useRef([]);
  const [itemsWidth, setItemsWidth] = useState(data.map(item => 0));
  const snapPoints = useMemo(
    () =>
      itemsWidth.reduce((last, current, index, array) => {
        const currentSnapPoint =
          index === 0 ? 0 : array[index - 1] + last[index - 1];
        return [...last, currentSnapPoint];
      }, []),
    [itemsWidth],
  );
  const [translateX, lastTranslateX, lastScaleX, scaleX] = useValues(
    [
      snapPoints[selectedIndex],
      snapPoints[selectedIndex],
      itemsWidth[selectedIndex] / INDICATOR_INITIAL_WIDTH,
      itemsWidth[selectedIndex] / INDICATOR_INITIAL_WIDTH,
    ],
    [itemsWidth],
  );
  const [renderProgress] = useValues([0], []);
  const [transitionClock, renderProgressClock, scaleXClock] = useClocks(3, []);

  useCode(
    () =>
      block([
        cond(
          eq(clockRunning(transitionClock), 0),
          set(lastTranslateX, translateX),
        ),
        cond(eq(clockRunning(scaleXClock), 0), set(lastScaleX, scaleX)),
        set(
          translateX,
          timing({
            clock: transitionClock,
            duration: 200,
            easing: Easing.linear,
            from: lastTranslateX,
            to: snapPoints[selectedIndex],
          }),
        ),
        set(
          scaleX,
          timing({
            clock: scaleXClock,
            duration: 200,
            easing: Easing.linear,
            from: lastScaleX,
            to: itemsWidth[selectedIndex] / INDICATOR_INITIAL_WIDTH,
          }),
        ),
      ]),
    [selectedIndex],
  );

  useCode(
    () =>
      set(
        renderProgress,
        timing({
          clock: renderProgressClock,
          duration: 500,
          to: 1,
        }),
      ),
    [mustBeRender],
  );

  const handleLayoutSelectorItem = (index, {width: renderWidth, height}) => {
    itemsWidthTemp.current.push({index, renderWidth});
    const renderCompleted = itemsWidthTemp.current.length === data.length;
    renderCompleted &&
      setItemsWidth(
        itemsWidthTemp.current
          .sort((a, b) => a.index - b.index)
          .map(({renderWidth: w}) => w),
      );
    renderCompleted && setMustBeRender(true);
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {padding: containerPadding},
        styles.containerFix,
      ]}>
      <SelectorIndicator
        {...{
          activeItemStyle,
          translateX,
          scaleX,
          renderProgress,
          indicatorBorderRadius,
        }}
        padding={containerPadding}
      />
      {data.map((item, index) => {
        return (
          <SelectorItem
            key={`${index}`}
            {...{
              item,
              textStyle,
              translateX,
              snapPoints,
              activeTextColor,
              textColor,
              index,
            }}
            onLayout={event => handleLayoutSelectorItem(index, event)}
            onPress={() => onSelected && onSelected(item, index)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.2)',
    padding: 8,
  },
  containerFix: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
