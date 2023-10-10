import React, { ReactElement } from 'react';

import { Box, Image, Row, Text } from 'native-base';
import { FlashList } from '@shopify/flash-list';
import ImageView from 'react-native-image-viewing';

import CoursesLessonHostedVideoSection from 'components/courses/lesson/HostedVideoSection';
import CoursesLessonTextSection from 'components/courses/lesson/TextSection';
import CoursesLessonYouTubeVideoSection from 'components/courses/lesson/YouTubeVideoSection';

import { InterfaceChapter, InterfaceSection } from 'models/Lesson';
import CoursesLessonImageSection from './ImageSection';

interface InterfaceProps {
  chapterData: InterfaceChapter // Данные главы
}

// Компонент вывода главы урока
const CoursesLessonChapter = ({ chapterData }: InterfaceProps): ReactElement => {
  // Типы секций
  const sictionTypes = {
    text: 'Section::Text',
    image: 'Section::Image',
    video: 'Section::Video',
    hostedVideo: 'Section::HostedVideo',
    dish: 'Section::Dish'
  };

  // Вывод секции картинки
  const renderImageSection = ({ content, image_url: imageUrl }: InterfaceSection) => (
    <Box mb={6} testID='CoursesLessonImageSection'>
      <Image w='100%' h={175} borderRadius={15} source={{ uri: imageUrl }} alt='ImageSectionImage' />

      <ImageView images={[{ uri: imageUrl }]}
                 imageIndex={0}
                 visible={visible}
                 onRequestClose={() => setIsVisible(false)} />

      {content && <Text fontSize='xs' mt={2}>{content}</Text>}
    </Box>
  );

  // Вывод секции блюда
  const renderDishSection = ({ dish, image_url: imageUrl }: InterfaceSection) => (
    <Box mb={6} testID='CoursesLessonDishSection'>
      <Image mb={3} w='full' h={150} borderRadius={15} source={{ uri: imageUrl }} alt='DishSectionImage' />

      <Text fontWeight='normal' mb={1}>{dish.name}</Text>

      <Text fontSize='xs' mb={2}>{dish.ingredients}</Text>

      <Row flexWrap='wrap'>
        {dish.full_path.map(
          (item, index: number) => (
            <Text key={`${item.id}_${item.name}`} fontSize='xs' color='gray'>{index !== 0 && ' -> '}{item.name}</Text>
          )
        )}
      </Row>
    </Box>
  );

  // Вывод секции
  const renderSection = (sectionData: InterfaceSection) => {
    const { dish, hostedVideo, image, text, video } = sictionTypes;

    switch (sectionData.type) {
      case dish:
        return renderDishSection(sectionData);
      case hostedVideo:
        return <CoursesLessonHostedVideoSection data={sectionData} />;
      case image:
        return <CoursesLessonImageSection data={sectionData} />;
      case text:
        return <CoursesLessonTextSection data={sectionData} />;
      case video:
        return <CoursesLessonYouTubeVideoSection data={sectionData} />;
      default:
        return null;
    }
  };

  const renderContent = () => (
    <Box minHeight='100px' px={4}>
      <Text fontSize='lg' fontWeight='semibold' mb={4}>{chapterData.name}</Text>

      <FlashList renderItem={({ item }) => renderSection(item)}
                 estimatedItemSize={200}
                 data={chapterData.sections}
                 scrollEnabled={false} />
    </Box>
  );

  return renderContent();
};

export default CoursesLessonChapter;
