import React, { ReactElement, useEffect, useState } from 'react';

import { Box,
         useTheme,
         Row,
         Text,
         Button,
         FlatList,
         Image,
         ScrollView, 
         Center } from 'native-base';
import { Dimensions, RefreshControl } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { nanoid } from 'nanoid/non-secure';
import { useNavigation } from 'react-native-navigation-hooks';

import Layout from 'components/helpers/Layout';
import { CuttedBaseBlock } from 'helpers/BaseBlocks';
import LayoutSkeleton from 'helpers/LayoutSkeleton';
import ArrowNext from 'svg/ArrowNext.svg';
import BasketIcon from 'svg/Basket.svg';
import RatingBg from 'svg/RatingBg.svg';
import SmallLogo from 'svg/SmallLogo.svg';

import { ConcessionItemInterface, ConcessionItemsStateInterface } from 'functions/Interfaces';

import { handleErrors, loadingHandler } from 'functions/Data';

import { changeConcessionItemCount, resetConcessionItems, setConcessionItemsCategories } from 'redux/actions/concessionItems';
import { useDispatch, useSelector } from 'react-redux';

import { apiUrls, apiWrapper } from 'config/api';

import { dark } from 'theme/base/themeConfig';

interface PropsInteface {
  componentId: string, 
  orderId: string, 
  sessionId: string
}

// Вывод списка барной продукции
const BarIndexScreen = ({ componentId, orderId, sessionId }: PropsInteface): ReactElement => {
  const [currentCategoryId, setCurrentCategoryId] = useState(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showBarItems, setShowBarItems] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [errors, setErrors] = useState([]);

  const { concessionItemsCategories, totalCount, totalPrice } = useSelector((state: { 
    concessionItems: ConcessionItemsStateInterface
  }) => state.concessionItems);

  const { push } = useNavigation();
  const { colors, space } = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    loadingHandler(() => fetchConcessionItems(), setIsLoading);

    return () => {
      dispatch(resetConcessionItems());
    };
  }, []);

  // Получение списка барной продукции
  const fetchConcessionItems = async () => {
    const response = await apiWrapper.get(apiUrls.sessions.concessionItems(sessionId));
    const { ok, data } = response;

    if (ok) dispatch(setConcessionItemsCategories(data.concession_items));
    else setErrors(handleErrors(response));
  };

  // Сохранение выбранных позиций бара и переход на подтверждение оплаты
  const saveBarItems = async () => {
    push('OrdersConfirmationScreen', { componentId, id: orderId });
  };

  // Обновление данных экрана
  function onRefresh() {
    setRefreshing(true);

    fetchConcessionItems().then(() => setRefreshing(false));
  }

  // Вывод блока фильтра категориям
  function renderFilterByCategories () {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} w='100%' mt={4} mb={2}>
        {concessionItemsCategories.map((concessionItemsCategory, index) => {
          const activeFilter = currentCategoryId === index;

          return (
            renderFilterByCategoriesItem(concessionItemsCategory.name, activeFilter, index)
          );
        })}
      </ScrollView>
    );
  }

  // Вывод кнопки переключения фильтра по категориям
  function renderFilterByCategoriesItem (categoryName: string, activeFilter: boolean, id: number) {
    const onPress = () => {
      setCurrentCategoryId(id);
    };

    return (
      <CuttedBaseBlock tHeight={15}
                       tWidth={15}
                       cuttedBottom
                       cuttedTop
                       backColor={colors.bgColor}
                       color={colors.bgDark}
                       py={2}
                       px={8}
                       mx={1} 
                       minW='35px' 
                       alignItems='center' 
                       justifyContent='center'
                       bgColor={activeFilter ? colors.primary : colors.bgDark}
                       rounded={10}
                       onPress={onPress}
                       key={`filterByCategory${nanoid()}`}>
        <Text textTransform='uppercase' fontSize={10}>{categoryName}</Text>
      </CuttedBaseBlock>
    );
  }

  // Вывод списка товаров барной продукции
  const renderConcessionItemsList = () => {
    return (
      <FlatList data={concessionItemsCategories[currentCategoryId].concession_items}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                h='100%'
                pt={2}
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }: { 
                  item: ConcessionItemInterface, 
                  index: number 
                }) => renderConcessionItem(item, index)}
                keyExtractor={(item: ConcessionItemInterface) => `barItem${item.id}`} />
    );
  };

  // Вывод элемента списка барной продукции
  const renderConcessionItem = (concessionItem: ConcessionItemInterface, concessionItemIndex: number) => {
    const { name, description, price, karo_points: points, image_main_url: image, count: concessionItemCount } = concessionItem;

    return (
      <CuttedBaseBlock tWidth={47}
                       tHeight={47}
                       cuttedBottom
                       bgColor={colors.bgDark}
                       rounded={15}
                       mb={4}
                       p={5}
                       position='relative'>
        <Row>
          <Box width='30%' alignItems='center'>
            <Box rounded={10} shadow={3} height={110} width='100%' mb={3}>
              {isLoading ? (
                <Box />
              ) : (
                <Image source={{ uri: image }} alt={name} rounded={10} flex={1} />
              )}
            </Box>

            {renderConcessionItemChangeCountButtons(concessionItemCount, concessionItemIndex)}
          </Box>

          <Box flex={1} pl={4} justifyContent='space-between'>
            <Text mb={1} fontWeight={700}>{name}</Text>

            <Text fontSize='xs' mb={3}>{description}</Text>

            <Row alignItems='center'>
              <Text mr={6} variant='karo'>{price} ₽</Text>

              {points && 
              <Row alignItems='center'>
                <Text variant='karo' mr={1}>{points}</Text>
                <SmallLogo height={15} width={15} fill={colors.bgColor} />
              </Row>}
            </Row>
          </Box>
        </Row>
      </CuttedBaseBlock>
    );
  };

  // Вывод кнопок изменения количества выбранной позиции
  const renderConcessionItemChangeCountButtons = (concessionItemCount: number | undefined, concessionItemIndex: number) => {
    return (
      <Row alignItems='center' justifyContent='space-between' w='100%'>
        <Button h={6}
                w={7}
                p={0}
                disabled={!concessionItemCount}
                bgColor={colors.bgDark}
                onPress={() => dispatch(changeConcessionItemCount({
                  categoryIndex: currentCategoryId,
                  productIndex: concessionItemIndex,
                  changeType: 'delete'
                }))}>
          <RatingBg position='absolute' top={-4} left={-5} height={25} width={25} fill={colors.bgColor} />
          <Text variant='karo'>–</Text>
        </Button>

        <Text textAlign='center' variant='karo' pt={1}>{concessionItemCount || 0}</Text>

        <Button h={6}
                w={7}
                p={0}
                bgColor={colors.bgDark}
                onPress={() => dispatch(changeConcessionItemCount({
                  categoryIndex: currentCategoryId,
                  productIndex: concessionItemIndex,
                  changeType: 'add'
                }))}>
          <RatingBg position='absolute' top={-4} left={-6} height={25} width={25} fill={colors.bgColor} />
          <Text variant='karo'>+</Text>
        </Button>
      </Row>
    );
  };

  // Вывод нижних кнопок
  const renderBottomButtons = () => {
    return (
      <DropShadow style={styles.dropShadow}>
        <Row p={4}
             h='75px' 
             zIndex={10} 
             bgColor='bgColor'>
          <Button bgColor='primary'
                  mr={2}
                  px={4}
                  w={54}
                  h={54}
                  disabled={totalCount === 0}
                  borderRadius={6}
                  onPress={() => setShowBarItems(!showBarItems)}>
            <Box position='relative'>
              <Center position='absolute'
                      bottom={-8}
                      right={-7}
                      bgColor='primaryDark'
                      opacity={totalCount === 0 ? 0.5 : 1}
                      w={4}
                      h={4}
                      borderRadius='full'
                      zIndex={100}>
                <Text bold fontSize='sm'>{totalCount}</Text>
              </Center>

              <BasketIcon />
            </Box>
          </Button>

          <Button bgColor={colors.primary} flex={1} h={54} borderRadius={6} onPress={saveBarItems}>
            <Row>
              <Text fontSize='lg' variant='karo' mt='2px' textAlign='center' mr={2}>
                {totalPrice === 0 ? 'Пропустить' : totalPrice }
              </Text>
              
              <ArrowNext />
            </Row>
          </Button>
        </Row>
      </DropShadow>
    );
  };

  // Вывод списка скелетного плейсхолдера
  function renderSkeletonPlaceholderList() {
    const skeletons = new Array(3).fill('');

    return (
      <FlatList data={skeletons}
                showsVerticalScrollIndicator={false}
                renderItem={renderSkeletonPlaceholderItem}
                keyExtractor={() => `barItemSkeleton${nanoid()}`} />
    );
  }

  // Вывод элемента скелетного плейсхолдера
  function renderSkeletonPlaceholderItem () {
    const itemContentWidth = Dimensions.get('window').width - parseInt(space[6], 10) / 4;
    
    return (
      <CuttedBaseBlock tWidth={45}
                       tHeight={45}
                       cuttedBottom
                       width='100%'
                       my={2}>
        <LayoutSkeleton height={180} borderRadius={15} mb={4} bgColor={colors.bgDark} px={6} pt={6} nested>
          <SkeletonPlaceholder.Item flexDirection='row' justifyContent='space-between'>
            <SkeletonPlaceholder.Item width={100} height={130} borderRadius={5} marginRight={10} />

            <SkeletonPlaceholder.Item width={itemContentWidth} justifyContent='space-between'>
              <SkeletonPlaceholder.Item width={150} height={20} borderRadius={5} marginBottom={parseInt(space[2], 10)} />
              <SkeletonPlaceholder.Item width={itemContentWidth} justifyContent='space-between'>
                <SkeletonPlaceholder.Item width={120} height={10} borderRadius={5} marginBottom={parseInt(space[1], 10)} />
                <SkeletonPlaceholder.Item width={140} height={10} borderRadius={5} marginBottom={parseInt(space[1], 10)} />
                <SkeletonPlaceholder.Item width={130} height={10} borderRadius={5} marginBottom={parseInt(space[6], 10)} />
              </SkeletonPlaceholder.Item>

              <SkeletonPlaceholder.Item width={50} height={20} borderRadius={5} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </LayoutSkeleton>
      </CuttedBaseBlock>
    );
  }

  function renderMainContent () {
    return (
      <Layout headerShowed 
              backComponentId={componentId} 
              headerBackButtonShowed 
              title="Заказ товаров из бара" 
              lightHeader 
              errors={errors} 
              removeErrors={() => setErrors([])}>
        <Box flex={1} position='relative'>
          <Box px={5}>
            {isLoading 
              ? renderSkeletonPlaceholderList()
              : (
                <>
                  {renderFilterByCategories()}

                  {concessionItemsCategories.length > 0 && renderConcessionItemsList()}
                </>
              )
            }
          </Box>
        </Box>

        {renderBottomButtons()}
      </Layout>
    );
  }

  return renderMainContent();
};

export default BarIndexScreen;

const styles = {
  dropShadow: {
    shadowColor: dark,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
  }
};
