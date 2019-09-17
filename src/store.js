import reducers from './reducers/index';
import { createStorage } from './utils/ReduxPersistStorage';
import { STORE_PERSIST_KEY } from './env';

import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers(reducers);

const storage = createStorage(STORE_PERSIST_KEY);

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['snap'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };

export default {
  store,
  persistor,
};
