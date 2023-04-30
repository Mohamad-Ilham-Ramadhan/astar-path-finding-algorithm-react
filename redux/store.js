import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './reducers';
import { setPath, setFoundedPath, clearFoundedPath } from './slices/board';

// for creating founded path using setTimeout for animation
const setPathListener = createListenerMiddleware();

setPathListener.startListening({
  actionCreator: setPath,
  effect: async (action, listenerApi) => {
    // listenerApi.dispatch(clearFoundedPath());
    // await listenerApi.delay(100);
    // console.log('cancelled', cancel);
    // const path = listenerApi.getState().board.path;
    const path = Object.assign([], listenerApi.getState().board.path); // supaya nanti di splice gak mutate yang di state (immerjs)
    if (path.length === 0) {
      return alert('The end node is not reachable! Please try to remove some walls.');
    }
    listenerApi.cancelActiveListeners();
    path.splice(0, 1);
    path.splice(path.length - 1, 1);
    for (let i = 0; i < path.length; i++) {
      await listenerApi.delay(80);
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