import { configureStore, combineReducers, StateFromReducersMapObject, PreloadedState } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventSlice';
import formReducer from './slices/formSlice';
import reminderReducer from './slices/reminderSlice';

// https://redux.js.org/usage/writing-tests
const rootReducer = combineReducers({
  events: eventsReducer,
  form: formReducer,
  reminder: reminderReducer,
});

//https://stackoverflow.com/questions/66315413/type-definitions-for-redux-toolkit-store-with-preloadedstate
// export type RootState = StateFromReducersMapObject<typeof rootReducer>;
export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
};

type Store = ReturnType<typeof setupStore>;

export type AppDispatch = Store['dispatch'];

// export default setupStore