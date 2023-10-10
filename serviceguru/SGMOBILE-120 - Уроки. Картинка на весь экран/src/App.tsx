import React, { useState } from 'react';

import { NativeBaseProvider } from 'native-base';

import AppNavigator from 'navigation/AppNavigator';
import { NavigationProvider } from 'navigation/NavigationContext';

import { persistor, setupStore } from 'redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { apiWrapper, source } from 'config/api';

import theme from 'theme/themeConfig';

import Orientation from 'react-native-orientation-locker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Инициализация навигации проекта
const App = () => {
  const [loading, setLoading] = useState(false);

  Orientation.lockToPortrait();

  let breakRequestTimer = null;

  // Добавление нового поля в запрос к серверу + прекращение запроса при долгом ожидании ответа от сервера
  apiWrapper.addRequestTransform((request) => {
    const token = setupStore.getState()?.currentUser?.token;

    // Добавляем в запросе поле Authorization с токеном пльзователя
    if (token) request.headers.Authorization = `Bearer ${token}`;

    // Перед отправкой запроса сбрасываем таймаут прекращения работы запроса
    clearTimeout(breakRequestTimer);

    // Включаем индикацию ожидания ответа от сервера
    setLoading(true);

    // Запускаем таймер прекращения работы запроса
    breakRequestTimer = setTimeout(() => source.cancel(), 15000);
  });

  // Если вернулся ответ от сервера с любым статусом, сбрасываем индикацию ожидания ответа от сервера
  apiWrapper.addResponseTransform((response) => {
    const { status, problem } = response;

    const problemsEnum = {
      CANCEL_ERROR: 'Время ожидания ответа истекло',
      NETWORK_ERROR: 'Сеть недоступна',
      CONNECTION_ERROR: 'Не удалось установить соединение с сервером',
      TIMEOUT_ERROR: 'Время ожидания ответа истекло'
    };

    // Если не вернулся статус, принудительно заполняем дату ошибкой для корректной обработки
    if (!status) response.data = { error: { message: problemsEnum[problem] } };
    setLoading(false);

    clearTimeout(breakRequestTimer);
  });

  // Вывод компонента с обертками
  const renderContent = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationProvider value={loading}>
          <Provider store={setupStore}>
            <PersistGate loading={null} persistor={persistor}>
              <NativeBaseProvider theme={theme}>
                <AppNavigator />
              </NativeBaseProvider>
            </PersistGate>
          </Provider>
        </NavigationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  return renderContent();
};

export default App;
