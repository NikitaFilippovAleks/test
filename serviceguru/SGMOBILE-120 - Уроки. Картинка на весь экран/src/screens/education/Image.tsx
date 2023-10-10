import Layout from 'helpers/Layout';
import React, { useEffect, useState } from 'react';

// import { ImageZoom } from '@likashefqet/react-native-image-zoom';

import Orientation from 'react-native-orientation-locker';
import { Box, Button, Center, Pressable, Text } from 'native-base';
import { Dimensions, Image, View } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import CoursesImage from 'components/courses/Image';

const ScreensEducationImage = ({ route: { params: { imageUrl } }, navigation: { goBack } }) => {
  const [orientation, setOrientation] = useState('PORTRAIT');
  // console.log('log:', imageUrl);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const styles = {
    PORTRAIT: {
      width: windowWidth,
      height: windowHeight,
      rotate: '0deg',
      top: 20
    },
    'LANDSCAPE-RIGHT': {
      width: windowHeight,
      height: windowWidth,
      rotate: '-90deg',
      top: 20
    },
    'LANDSCAPE-LEFT': {
      width: windowHeight,
      height: windowWidth,
      rotate: '90deg',
      top: 20
    }
  };

  useEffect(() => {
    Orientation.addDeviceOrientationListener((o) => {
      console.log('o:', o);
      console.log('width:', windowWidth)
      if (o === 'PORTRAIT' || o === 'LANDSCAPE-RIGHT' || o === 'LANDSCAPE-LEFT') {
        setOrientation(o);
      }
    });
  }, []);

  const onClose = () => {
    console.log('here')
    goBack();

    
  }
  const renderContent = () => (
    <Layout>
      {/* <Center width={styles[orientation].width} height={styles[orientation].height}
      // style={{ transform: [{ rotate: styles[orientation].rotate }] }}
      > */}
      {/* <Center flex={1} style={{ transform: [{ rotate: styles[orientation].rotate }] }}> */}
        <Pressable color='black' zIndex={1000} h={10} w={10} top={20} left={20} position='absolute' onPress={onClose}><Text>Go back</Text></Pressable>
        {/* <ImageZoom uri={imageUrl} imageContainerStyle={{ width: styles[orientation].width }} /> */}
        {/* <ImageZoom cropWidth={styles[orientation].width}
                   cropHeight={styles[orientation].height}
                   onSwipeDown={onClose}
                   imageWidth={styles[orientation].width} imageHeight={'100%'} >
          <Image style={{ flex: 1, resizeMode: 'contain', }}
                 source={{ uri: imageUrl }}/>
        </ImageZoom> */}

        <CoursesImage imageUrl={imageUrl} width={styles[orientation].width} height={styles[orientation].height} />
      {/* </Center> */}
      {/* </Center> */}
    </Layout>
  );

  return renderContent();
};

export default ScreensEducationImage;
