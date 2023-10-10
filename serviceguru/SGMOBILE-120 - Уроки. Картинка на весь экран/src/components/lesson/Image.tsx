import React, { useState, useRef, createRef } from 'react';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';


const CoursesImage = ({ imageUrl, width, height }) => {

  const [panEnabled, setPanEnabled] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  // const translateY = useRef(new Animated.Value(0)).current;

  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event([{
    nativeEvent: { scale }
  }],
    { useNativeDriver: true });

  const onPanEvent = (obj) => {
    pan.x.setValue(obj.nativeEvent.translationX);
    pan.y.setValue(-obj.nativeEvent.translationY);
    // console.log('obj:', obj.nativeEvent.translationX);
    // Animated.event([{
    //   nativeEvent: {
    //     translationX: pan.x,
    //     translationY: pan.y
    //   }
    // }],
    // { useNativeDriver: true })
  };

  const handlePinchStateChange = ({ nativeEvent }) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true
        }).start();
        Animated.spring(pan.x, {
          toValue: 0,
          useNativeDriver: true
        }).start();
        Animated.spring(pan.y, {
          toValue: 0,
          useNativeDriver: true
        }).start();

        setPanEnabled(false);
      }
    }
  };

  const getValue = (value) => {
    console.log('value:', typeof value)
    console.log('here')
    return value
  }

  return (
    
      <>
        <PanGestureHandler
          onGestureEvent={onPanEvent}
          ref={panRef}
          simultaneousHandlers={[pinchRef]}
          enabled={panEnabled}
          failOffsetX={[-1000, 1000]}
          shouldCancelWhenOutside
        >
          <Animated.View>
            <PinchGestureHandler
              ref={pinchRef}
              onGestureEvent={onPinchEvent}
              simultaneousHandlers={[panRef]}
              onHandlerStateChange={handlePinchStateChange}
            >
              <Animated.Image
                source={{ uri: imageUrl }}
                style={{
                  width: width,
                  height: height,
                  transform: [{ scale }, { translateX: getValue(pan.getLayout().top) }, { translateY: pan.x }, { rotate: '90deg' }]
                }}
                resizeMode="contain"
              />

            </PinchGestureHandler>
          </Animated.View>

        </PanGestureHandler>
      </>
    
  );
};

export default CoursesImage;
