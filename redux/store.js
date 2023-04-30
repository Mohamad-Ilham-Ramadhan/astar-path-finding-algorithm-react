import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './reducers';
import { setPath, setFoundedPath } from './slices/board';

// for creating founded path using setTimeout for animation
const setPathListener = createListenerMiddleware();

setPathListener.startListening({
  actionCreator: setPath,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    // console.log('cancelled', cancel);
    const path = listenerApi.getState().board.path;
    if (path.length === 0) {
      return alert('The end node is not reachable! Please try to remove some walls.');
    }
    for (let i = 0; i < path.length; i++) {
      // setTimeout(() => {
      //   const box = path[i];
      //   listenerApi.dispatch( setFoundedPath(box) );
      // }, i * 40);
      await listenerApi.delay(40);
      const box = path[i];
      listenerApi.dispatch(setFoundedPath(box));

    }
  }
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(setPathListener.middleware)
})

export { store };