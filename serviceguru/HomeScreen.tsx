import React, { ReactElement, useEffect, useMemo, useState } from 'react';

import { Dimensions } from 'react-native';

import { Avatar, Box, Button, Center, Column, Image, Pressable, Row, Text } from 'native-base';

import Carousel from 'react-native-reanimated-carousel';

import { FlashList } from '@shopify/flash-list';

import { RenderHTML } from 'helpers/Base';

import Layout from 'helpers/Layout';

import FilterItem from 'helpers/FilterItem';
import useFetch from 'functions/Api';

import { apiUrls, apiWrapper } from 'config/api';

// Компонент HomeScreen
const HomeScreen = ({ navigation }): ReactElement => {
  const [news, setNews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeFilter, setActiveFilter] = useState('news');

  const { width } = Dimensions.get('window');

  const {
    data: { announcements: responseAnnouncements = [] },
    errors: announcementsErrors
  } = useFetch(apiUrls.announcements.allNews, 'get');

  const {
    data: { courses: responseCourses },
    errors: coursesErrors
  } = useFetch(apiUrls.courses.list, 'get');

  const filters = useMemo(() => ({
    news: {
      lineItems: responseAnnouncements,
      errors: announcementsErrors,
      renderItem: renderNewsItem
    },
    courses: {
      lineItems: responseCourses,
      errors: coursesErrors,
      renderItem: renderCoursesItem
    }
  }), [responseAnnouncements, responseCourses, announcementsErrors, coursesErrors]);

  const activeFilterData = filters[activeFilter];

  // const fetchNewsCheck = async () => {
  //   const response = await apiWrapper.get(apiUrls.announcements.allNews);
  //   const { ok, data } = response;

  //   if (ok) setNews(data.announcements);
  // };

  // const fetchCourses = async () => {
  //   const response = await apiWrapper.get(apiUrls.courses.list);
  //   const { ok, data } = response;

  //   if (ok) setCourses(data.courses);
  // };

  // useEffect(() => {
  //   fetchNewsCheck();
  // }, []);

  const openNews = (item) => {
    navigation.navigate('NewsScreen', { id: item.id });
  };

  const openCourse = (item) => {
    navigation.push('CourseScreen', { id: item.id });
  };

  function renderCoursesItem(item) {
    const { name, description, image_url: image, created_at: date } = item;

    return (
      <Pressable bg='primary' mb={4} mx={5} onPress={() => openCourse(item)}>
        <Row>
          <Column>
            <Text>
              {name}
            </Text>
            <Text>
              {description}
            </Text>
            <Text>
              {date}
            </Text>
          </Column>
          <Image w='100%' h='100%' source={{ uri: image }} alt='image' />
        </Row>
      </Pressable>
    );
  }

  function renderNewsItem(item) {
    const { user: { first_name: firstName, last_name: lastName, image, role } } = item;
    const { published_at: date, name, content_html: html } = item;

    return (
      <Pressable w='90%' bg='primary' mb={4} mx={5} onPress={() => openNews(item)}>
        <Row alignItems='center' mb='2'>
          <Avatar borderRadius={100} source={{ uri: image }} alt={`${firstName} ${lastName}`} />

          <Column ml={2}>
            <Text mb={-4}>{`${firstName} ${lastName}`}</Text>

            <Text>{role}</Text>

            <Text>{date}</Text>
          </Column>
        </Row>

        <Box>
          <Text bold mb={1}>{name}</Text>

          <RenderHTML text={html} />
        </Box>
      </Pressable>
    );
  }

  const renderFilterBlock = () => (
    <Row mb={2}>
      <FilterItem label='Новости' setActiveFilter={setActiveFilter} filter='news' isActive={activeFilter === 'news'} />
      <FilterItem label='Курсы' setActiveFilter={setActiveFilter} filter='courses' isActive={activeFilter === 'courses'} />
    </Row>
  );

  const renderCarouselBlock = () => (
    <Box w='100%' overflow='hidden' mb={4}>
      <Carousel data={responseAnnouncements.filter(item => item.is_pinned === true)}
                renderItem={({ item }) => renderNewsItem(item)}
                width={width}
                height={100}
                loop={false} />
    </Box>
  );

  const renderMainContent = () => {
    const { lineItems, renderItem } = activeFilterData;

    return (
      <Layout>
        <Box flex={1} bg='blue.100'>
          {renderFilterBlock()}
          {renderCarouselBlock()}
          <FlashList data={lineItems}
                     estimatedItemSize={200}
                     renderItem={({ item }) => renderItem(item)} />
        </Box>
      </Layout>
    );
  };

  return renderMainContent();
};

export default HomeScreen;
