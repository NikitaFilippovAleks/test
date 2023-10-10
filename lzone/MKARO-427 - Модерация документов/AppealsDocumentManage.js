import React, { useEffect, useState } from 'react';

import { Button, Card, Container, ScrollableTab, Tab, TabHeading, Tabs, Text, Thumbnail, View } from 'native-base';
import { FlatList, RefreshControl } from 'react-native';

import SearchForm from '../../components/helpers/SearchForm';
import Throbber from '../../components/helpers/Throbber';

import { openModal } from '../../Functions/Navigation';
import { loadingHandler } from '../../Functions/Data';
import { colorWithOpacity } from '../../Functions/Main';

import { apiUrls, apiWrapper } from '../../../config/api';

import themeVariables from '../../Theme/native-base-theme/variables/platform';

// Компонент экрана модерации заявок на документы
export default function AppealsDocumentManage () {
  const [searchValue, setSearchValue] = useState('');

  const [appeals, setAppeals] = useState([]);

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadingHandler(fetchAppeals(), setLoading);
  }, []);

  // Запрос на получение заявок для модерации
  const fetchAppeals = async (activePage = 1, appendAppeals = false) => {
    const filterData = {};

    setPage(activePage);

    filterData.page = activePage;

    const response = await apiWrapper.get(apiUrls.hr.appeals.documents.listManage, filterData);

    const { ok, data, status } = response;

    if (ok) {
      setAppeals(appendAppeals ? [...appeals, ...data.documents] : data.documents);
      setTotalItems(data.total_items);
    }
    else { openModal({ status, errors: [data.errors] }, 'ErrorsModal'); }
  };

  // Запрос на выполнение заявки
  const manageAppeal = async (id) => {
    const response = await apiWrapper.get(apiUrls.hr.appeals.documents.approve(id));

    const { ok, data, status } = response;

    if (!ok) {
      openModal({ status, errors: data.documents.errors }, 'ErrorsModal');
    } else {
      fetchAppeals();
    }
  };

  // Загрузка дополнительных заявок
  const loadMoreAppeals = async () => {
    if (appeals.length < totalItems) {
      fetchAppeals(page + 1, true);
    }
  };

  // Обновление материалов экрана при свайпе вниз
  const onRefresh = () => {
    setRefreshing(true);

    loadingHandler(fetchAppeals(), setLoading);

    setRefreshing(false);
  };

  // Вывод информации о сотруднике
  const renderUserInfo = (user) => {
    const { avatar, username, position } = user;

    return (
      <View rowDirection>
        <Thumbnail middle source={{uri: avatar}} />

        <View padderHorizontal fullSize>
          <Text smaller>{username}</Text>
          <Text brandG smaller>{position}</Text>
        </View>
      </View>
    );
  };

  // Вывод информации по заявке
  const renderWaitingItem = (appealItem) => {
    const {
      id,
      user,
      document_type_name: documentTypeName,
      status
    } = appealItem;

    return (
      <Card marginBottom={10}
            paddingVertical={10}
            paddingHorizontal={20}>
        {renderUserInfo(user)}

        <View fullSize rowDirection justifyContentBetween padderVertical>
          <View flex={5}>
            <Text brandG smaller>Запрос №{id}</Text>
            <Text smaller>{documentTypeName}</Text>
          </View>
        </View>

        {status === 'created' &&
          <View fullSize>
            <Button bordered
                    small
                    success
                    block
                    style={styles.appeal.manageButton}
                    smallRounded
                    onPress={() => loadingHandler(manageAppeal(id), setLoading)}>
              <Text textUppercase center>Выполнено</Text>
            </Button>
          </View>
        }
      </Card>
    );
  };

  // Вывод списка заявок
  const renderAppeals = (status) => {
    return (
      appeals.length > 0 &&
      <FlatList refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                style={styles.listWrapper}
                data={appeals.filter(appeal => appeal.status === status)}
                keyExtractor={(item) => item.id.toString()}
                initialNumToRender={10}
                onEndReached={loadMoreAppeals}
                onEndReachedThreshold={0.1}
                renderItem={({item}) => renderWaitingItem(item)} />
    );
  };

  // Отрисовка вкладок с заявками и меню
  const renderTabs = () => {
    return (
      <Tabs borderHeading renderTabBar={() => <ScrollableTab style={{height: 42}} />}>
        <Tab heading={<TabHeading><Text style={styles.tabText}>Ждут действий</Text></TabHeading>} style={styles.tab}>
          {renderAppeals('created')}
        </Tab>
        <Tab heading={<TabHeading><Text style={styles.tabText}>Выполненные</Text></TabHeading>} style={styles.tab}>
          {renderAppeals('approved')}
        </Tab>
      </Tabs>
    );
  };

  const renderMainContent = () => {
    return (
      <Container>
        {loading && <Throbber fullCover/>}

        <SearchForm formStyle={styles.searchForm}
                    inputStyle={styles.searchInput}
                    searchBarStyle={styles.searchBar}
                    iconStyle={styles.iconStyle}
                    placeholder="Поиск"
                    placeholderTextColor={'#8E8E93'}
                    filterByText={searchValue}
                    setFilterByText={setSearchValue} />

        {renderTabs()}
      </Container>
    );
  };

  return renderMainContent();
}

const styles = {
  listWrapper: {
    backgroundColor: themeVariables.containerBgAccentColor,
    paddingVertical: 16
  },
  appeal: {
    cardColor: {
      approved: {
        backgroundColor: colorWithOpacity(themeVariables.brandSuccess, 0.15),
      },
      declined: {
        backgroundColor: colorWithOpacity(themeVariables.brandDanger, 0.15),
      }
    },
    dateRange: {
      borderRightWidth: 0.5,
      borderLeftWidth: 0.5,
      borderColor: themeVariables.brandGrey
    },
    manageButton: {
      height: 30
    }
  },
  tab: {
    backgroundColor: themeVariables.containerBgAccentColor,
  },
  tabText: {
    fontSize: 16
  },
  searchForm: {
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: themeVariables.listBorderColor
  },
  searchInput: {
    height: 31,
    backgroundColor: '#f1f1f2',
    fontSize: 16
  },
  searchBar: {
    height: 31,
    backgroundColor: '#f1f1f2',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderStartWidth: 0,
    borderEndWidth: 0
  },
  iconStyle: {
    fontSize: 21,
    paddingTop: 2,
    paddingLeft: 8,
    paddingRight: 5
  }
};
