import AsyncStorage from '@react-native-community/async-storage';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistCombineReducers, persistStore } from 'redux-persist';

import orderReducer from 'redux/reducers/order';
import ordersReducer from 'redux/reducers/orders';
import userReducer from 'redux/reducers/user';
import infoSliderItems from 'redux/reducers/infoSliderItems';
import mediaSliderItems from 'redux/reducers/mediaSliderItems';
import concessionItems from 'redux/reducers/concessionItems';

import Reactotron from '../../reactotronConfig';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['concessionItems']
};

const reducers = {
  order: orderReducer, 
  orders: ordersReducer, 
  user: userReducer,
  infoSliderItems,
  mediaSliderItems,
  concessionItems
};

const combinedReducers = persistCombineReducers(persistConfig, reducers);

const configureStore = (): Record<string, unknown> => {
  const store = createStore(combinedReducers, compose(applyMiddleware(thunk), Reactotron.createEnhancer()));
  const persistor = persistStore(store);

  return { store, persistor };
};

export default configureStore;
