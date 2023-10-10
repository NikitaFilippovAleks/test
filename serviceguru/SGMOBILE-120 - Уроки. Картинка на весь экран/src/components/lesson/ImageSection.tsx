import React, { useEffect, useState } from 'react';

import { InterfaceSection } from 'models/Lesson';
import { Box, Image, Pressable, Text } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageView from 'react-native-image-viewing';

import Orientation from 'react-native-orientation-locker';
import { Modal } from 'react-native';

import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { useNavigation } from '@react-navigation/native';

interface InterfaceProps {
  data: InterfaceSection // Данные секции "Картинка"
}

// Компонент секции "Картинка"
const CoursesLessonImageSection = ({ data: { content, image_url: imageUrl } }: InterfaceProps) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { push } = useNavigation();

  // useEffect(() => {
  //   Orientation.unlockAllOrientations();
  // }, []);

  const renderContent = () => (
    <Pressable mb={6} onPress={() => push('ScreensEducationImage', { imageUrl })} testID='CoursesLessonImageSection'>
      <Image w='100%' h={175} borderRadius={15} source={{ uri: imageUrl }} alt='ImageSectionImage' />

      {/* <Modal animationType='fade'
             transparent={true}
             statusBarTranslucent
             visible={isPreviewMode}> */}
      {/* <Box w={300} h={300}>
        <ImageViewer imageUrls={[{ url: imageUrl }]} onClick={() => setIsPreviewMode(false)} />
      </Box> */}
      {/* </Modal> */}
      <Box w={300} h={300}>
      <ImageZoom uri={imageUrl} />
      </Box>

      {content && <Text fontSize='xs' mt={2}>{content}</Text>}
    </Pressable>
  );

  return renderContent();
};

export default CoursesLessonImageSection;
